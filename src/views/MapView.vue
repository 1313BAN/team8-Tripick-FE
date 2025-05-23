<template>
  <div class="flex h-screen">
    <!-- 📌 사이드바 (크기 조절 가능) -->
    <div
      ref="sidebar"
      class="bg-gray-900 text-white overflow-y-auto flex flex-col"
      :style="{ width: sidebarWidth + 'px' }"
    >
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-2xl font-bold mb-2">관광지 검색</h2>
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="관광지명을 입력하세요"
            class="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            @input="handleSearch"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      <!-- 카테고리 필터 -->
      <div class="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-700">
        <button
          class="px-3 py-1 rounded-full text-sm"
          :class="currentType === null ? 'bg-red-600 text-white' : 'bg-gray-700'"
          @click="changeType(null)"
        >전체</button>
        <button
          v-for="(name, id) in typeMap"
          :key="id"
          class="px-3 py-1 rounded-full text-sm"
          :class="currentType === Number(id) ? 'bg-red-600 text-white' : 'bg-gray-700'"
          @click="changeType(Number(id))"
        >{{ name }}</button>
      </div>

      <!-- 위치 안내 메시지 -->
      <div v-if="isLoadingLocation" class="p-4 bg-blue-50 text-blue-700">📍 현재 위치를 가져오는 중...</div>
      <div v-if="locationError" class="p-4 bg-yellow-50 text-yellow-700">
        ⚠️ {{ locationError }}<br />
        <span class="text-sm text-yellow-600">서울 지역으로 기본 설정됩니다.</span>
      </div>

      <!-- 선택된 관광지 상세 정보 -->
      <div v-if="selectedSpot" class="p-4">
        <SpotDetail
          :spot="selectedSpot"
          :rating="getRandomRating(selectedSpot.no)"
          @close="closeSpotDetail"
          @move-to-spot="moveToSpot"
        />
      </div>

      <!-- 검색 상태 표시 -->
      <div v-else-if="isLoadingSpots" class="p-4 text-center text-gray-400">
        <div class="animate-pulse">관광지 정보를 불러오는 중...</div>
      </div>

      <!-- 검색 결과가 없을 경우 -->
      <div v-else-if="filteredSpots.length === 0" class="p-4 text-center text-gray-400">
        <p>검색 결과가 없습니다.</p>
        <p class="text-sm">다른 지역으로 이동하거나 검색어를 변경해보세요.</p>
      </div>

      <!-- 관광지 목록 -->
      <div v-else class="p-4 space-y-3 text-sm">
        <div v-for="spot in filteredSpots" :key="spot.no" @click="selectSpot(spot)" class="cursor-pointer transition-transform hover:scale-[1.02]">
          <SpotCard
            :title="spot.title"
            :type="getTypeName(spot.contentTypeId)"
            :rating="getRandomRating(spot.no)"
          />
        </div>

        <!-- 더 많은 결과가 있을 경우 -->
        <div v-if="filteredSpots.length >= 20" class="text-center text-gray-400 mt-2">
          <p>더 많은 결과를 보려면 지도를 조정하세요</p>
        </div>
      </div>
    </div>

    <!-- 📌 드래그 핸들 -->
    <div class="w-1 bg-gray-600 cursor-col-resize" @mousedown="startResizing"></div>

    <!-- 📌 지도 영역 -->
    <div class="flex-1 relative">
      <div id="map" class="w-full h-full"></div>

      <!-- 지도 컨트롤 -->
      <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          @click="moveToCurrentLocation"
          class="p-3 hover:bg-gray-100 flex items-center justify-center"
          title="내 위치로 이동"
        >
          <span class="text-blue-600">📍</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { onBeforeUnmount } from 'vue'
import SpotCard from '@/components/SpotCard.vue'
import SpotDetail from '@/components/SpotDetail.vue'

const sidebarWidth = ref(360) // 사이드바 초기 너비
let isResizing = false

// 반응형 변수로 선언
const currentType = ref<number | null>(null)
const isLoadingLocation = ref(false)
const locationError = ref<string | null>(null)
const isLoadingSpots = ref(false)
const spots = ref<any[]>([])
const searchKeyword = ref('')
const selectedSpot = ref<any | null>(null)
const currentLocation = ref<{lat: number, lng: number} | null>(null)

// 검색어 필터링된 관광지 목록
const filteredSpots = computed(() => {
  if (!searchKeyword.value) return spots.value

  const keyword = searchKeyword.value.toLowerCase()
  return spots.value.filter(spot =>
    spot.title.toLowerCase().includes(keyword) ||
    (spot.addr && spot.addr.toLowerCase().includes(keyword))
  )
})

function startResizing(e: MouseEvent) {
  isResizing = true
  document.addEventListener('mousemove', resizeSidebar)
  document.addEventListener('mouseup', stopResizing)
}

function resizeSidebar(e: MouseEvent) {
  if (!isResizing) return
  const minWidth = 260
  const maxWidth = 600
  const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth)
  sidebarWidth.value = newWidth
}

function stopResizing() {
  isResizing = false
  document.removeEventListener('mousemove', resizeSidebar)
  document.removeEventListener('mouseup', stopResizing)
}

onBeforeUnmount(() => {
  stopResizing()
})

let map: kakao.maps.Map
let markers: kakao.maps.Marker[] = []
let openDetailInfoWindow: kakao.maps.InfoWindow | null = null

// 기본 위치 (서울)
const DEFAULT_LAT = 37.5665
const DEFAULT_LNG = 126.978
const DEFAULT_LEVEL = 7

const typeMap: Record<number, string> = {
  12: '관광지',
  14: '문화시설',
  15: '축제공연',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점',
}

function getTypeName(typeId: number): string {
  return typeMap[typeId] || '기타'
}

// 리뷰 점수 랜덤 생성 (실제로는 DB에서 가져와야 함)
function getRandomRating(id: number): number {
  // id를 시드로 사용하여 같은 id는 항상 같은 점수를 반환하도록 함
  const seed = id % 100
  return 3 + (seed % 20) / 10 // 3.0 ~ 5.0 사이의 값
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
}

function drawMarkers(spotsData: any[]) {
  clearMarkers()
  spots.value = spotsData // 관광지 목록 저장

  spotsData.forEach((spot) => {

    const position = new kakao.maps.LatLng(spot.latitude, spot.longitude)
    const marker = new kakao.maps.Marker({ position, map, title: spot.title })

    const hoverInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px; font-size:13px;"><strong>${spot.title}</strong><br>${getTypeName(spot.contentTypeId)}</div>`,
    })

    const detailInfo = new kakao.maps.InfoWindow({
      content: `
          <div style="padding:10px; font-size:14px; max-width:300px;">
            <strong>${spot.title}</strong><br/>
            주소: ${spot.addr || '없음'}<br/>
            <a href="#" onclick="window.selectSpotById(${spot.no}); return false;" style="color:blue;text-decoration:underline;">상세정보 보기</a>
          </div>
        `,
    })

    kakao.maps.event.addListener(marker, 'mouseover', () => hoverInfo.open(map, marker))
    kakao.maps.event.addListener(marker, 'mouseout', () => hoverInfo.close())
    kakao.maps.event.addListener(marker, 'click', () => {
      if (openDetailInfoWindow) openDetailInfoWindow.close()
      detailInfo.open(map, marker)
      openDetailInfoWindow = detailInfo

      // 해당 관광지 선택
      selectSpotByCoords(spot.latitude, spot.longitude)
    })

    markers.push(marker)
  })

  // 전역 함수로 노출시켜 인포윈도우에서 호출할 수 있게 함
  // @ts-ignore
  window.selectSpotById = (id: number) => {
    const spot = spots.value.find(s => s.no === id)
    if (spot) {
      selectedSpot.value = spot
    }
  }
}

// 좌표로 관광지 선택
function selectSpotByCoords(lat: number, lng: number) {
  const spot = spots.value.find(s =>
    s.latitude === lat && s.longitude === lng
  )

  if (spot) {
    console.log(spot, "디버깅")
    selectedSpot.value = spot
  }
}

// 관광지 선택 시 호출
function selectSpot(spot: any) {
  selectedSpot.value = spot
  moveToSpot(spot)
}

// 관광지 상세보기 닫기
function closeSpotDetail() {
  selectedSpot.value = null
}

// 관광지 위치로 지도 이동
function moveToSpot(spot: any) {
  const position = new kakao.maps.LatLng(spot.latitude, spot.longitude)
  map.setCenter(position)
  map.setLevel(3) // 더 가까이 줌

  // 해당 마커의 인포윈도우 열기
  const marker = markers.find(m =>
    m.getPosition().getLat() === spot.latitude &&
    m.getPosition().getLng() === spot.longitude
  )

  if (marker) {
    if (openDetailInfoWindow) openDetailInfoWindow.close()

    const detailInfo = new kakao.maps.InfoWindow({
      content: `
          <div style="padding:10px; font-size:14px; max-width:300px;">
            <strong>${spot.title}</strong><br/>
            주소: ${spot.addr || '없음'}<br/>
            <a href="#" onclick="window.selectSpotById(${spot.no}); return false;" style="color:blue;text-decoration:underline;">상세정보 보기</a>
          </div>
        `,
    })

    detailInfo.open(map, marker)
    openDetailInfoWindow = detailInfo
  }
}

// 현재 위치로 이동하는 함수
function moveToCurrentLocation() {
  if (currentLocation.value) {
    const position = new kakao.maps.LatLng(currentLocation.value.lat, currentLocation.value.lng)
    map.setCenter(position)
    map.setLevel(4)
  } else {
    alert('위치 정보를 가져올 수 없습니다.')
  }
}

// 검색 핸들러 (디바운스 적용)
let searchTimeout: number | null = null
function handleSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    // 검색어가 있으면 필터링된 목록 사용, 없으면 모든 관광지 표시
    if (!searchKeyword.value) {
      // 마커 전체 다시 표시
      markers.forEach(marker => marker.setMap(map))
    } else {
      // 검색어로 필터링된 관광지만 마커 표시
      const filtered = filteredSpots.value
      markers.forEach(marker => {
        const isVisible = filtered.some(spot =>
          spot.title === marker.getTitle()
        )
        marker.setMap(isVisible ? map : null)
      })
    }
  }, 200)
}

function fetchSpots() {
  if (!map) return

  const bounds = map.getBounds()
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  let url = `/api/spots/in-boundary?swLat=${sw.getLat()}&swLng=${sw.getLng()}&neLat=${ne.getLat()}&neLng=${ne.getLng()}`
  if (currentType.value !== null) {
    url += `&type=${currentType.value}`
  }

  isLoadingSpots.value = true

  fetch(url)
    .then((res) => res.json())
    .then(data => {
      drawMarkers(data)
      isLoadingSpots.value = false
    })
    .catch((err) => {
      console.error('관광지 데이터 요청 실패:', err)
      isLoadingSpots.value = false
    })
}

function changeType(type: number | null) {
  currentType.value = type
  selectedSpot.value = null // 상세 정보 닫기
  fetchSpots()
}

// 사용자의 현재 위치를 가져오는 함수
function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        currentLocation.value = location // 현재 위치 저장
        resolve(location)
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
            break
        }

        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,  // 더 정확한 위치 요청
        timeout: 10000,           // 10초 타임아웃
        maximumAge: 300000        // 5분간 캐시된 위치 정보 사용
      }
    )
  })
}

// 적절한 지도 레벨을 결정하는 함수
function getMapLevel(lat: number, lng: number): number {
  // 한국 내 위치인지 확인 (대략적인 범위)
  const isInKorea = lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132

  if (isInKorea) {
    // 한국 내 위치면 시/군 레벨로 설정
    return 6
  } else {
    // 해외 위치면 좀 더 넓은 범위로 설정
    return 8
  }
}

async function initializeMap() {
  if (typeof kakao === 'undefined') {
    console.error('❌ Kakao 객체가 없습니다.')
    return
  }

  const container = document.getElementById('map')
  if (!container) {
    console.error('❌ #map DOM을 찾을 수 없습니다.')
    return
  }

  let mapLat = DEFAULT_LAT
  let mapLng = DEFAULT_LNG
  let mapLevel = DEFAULT_LEVEL

  // 현재 위치 가져오기 시도
  isLoadingLocation.value = true
  locationError.value = null

  try {
    const location = await getCurrentLocation()
    mapLat = location.lat
    mapLng = location.lng
    mapLevel = getMapLevel(mapLat, mapLng)

    console.log(`✅ 현재 위치: ${mapLat}, ${mapLng}`)
  } catch (error) {
    console.warn('현재 위치를 가져올 수 없어서 기본 위치(서울)로 설정합니다:', error)
    locationError.value = error instanceof Error ? error.message : '위치를 가져올 수 없습니다.'

    // 기본 위치 사용
    currentLocation.value = {
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG
    }
  } finally {
    isLoadingLocation.value = false
  }

  // 지도 초기화
  const mapOption = {
    center: new kakao.maps.LatLng(mapLat, mapLng),
    level: mapLevel,
  }

  map = new kakao.maps.Map(container, mapOption)

  // 현재 위치에 마커 표시 (기본 위치가 아닌 경우에만)
  if (mapLat !== DEFAULT_LAT || mapLng !== DEFAULT_LNG) {
    const currentLocationMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(mapLat, mapLng),
      map: map,
      // 현재 위치 마커에 다른 이미지 사용
      image: new kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new kakao.maps.Size(24, 35)
      )
    })

    const currentLocationInfoWindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px; font-size:13px; color: #0066cc;"><strong>📍 현재 위치</strong></div>'
    })

    kakao.maps.event.addListener(currentLocationMarker, 'click', () => {
      currentLocationInfoWindow.open(map, currentLocationMarker)
    })
  }

  // 지도 이벤트 리스너 등록
  kakao.maps.event.addListener(map, 'idle', fetchSpots)
  fetchSpots()
}

onMounted(() => {
  initializeMap()
})
</script>
