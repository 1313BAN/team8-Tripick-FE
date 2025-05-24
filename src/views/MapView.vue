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
      <div v-if="isLoadingLocation" class="p-4 bg-blue-900 text-blue-200">📍 현재 위치를 가져오는 중...</div>
      <div v-if="locationError" class="p-4 bg-yellow-900 text-yellow-200">
        ⚠️ {{ locationError }}<br />
        <span class="text-sm text-yellow-300">서울 지역으로 기본 설정됩니다.</span>
      </div>

      <!-- 정렬 옵션 -->
      <div class="p-4 border-b border-gray-700">
        <select
          v-model="sortOption"
          class="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="rating">⭐ 평점 높은 순</option>
          <option value="rating-low">⭐ 평점 낮은 순</option>
          <option value="reviews">💬 리뷰 많은 순</option>
          <option value="name">🔤 이름 순</option>
        </select>
      </div>

      <!-- 선택된 관광지 상세 정보 -->
      <div v-if="selectedSpot && selectedSpotDetail" class="p-4">
        <SpotDetail
          :spot="selectedSpotDetail"
          :is-loading="isLoadingSpotDetail"
          @close="closeSpotDetail"
          @move-to-spot="moveToSpot"
        />
      </div>

      <!-- 상세 정보 로딩 중 -->
      <div v-else-if="selectedSpot && isLoadingSpotDetail" class="p-4 text-center text-gray-400">
        <div class="animate-pulse">상세 정보를 불러오는 중...</div>
      </div>

      <!-- 검색 상태 표시 -->
      <div v-else-if="isLoadingSpots" class="p-4 text-center text-gray-400">
        <div class="animate-pulse">관광지 정보를 불러오는 중...</div>
      </div>

      <!-- 검색 결과가 없을 경우 -->
      <div v-else-if="sortedSpots.length === 0" class="p-4 text-center text-gray-400">
        <p>검색 결과가 없습니다.</p>
        <p class="text-sm">다른 지역으로 이동하거나 검색어를 변경해보세요.</p>
      </div>

      <!-- 관광지 목록 -->
      <div v-else class="p-4 space-y-3 text-sm">
        <div v-for="spot in sortedSpots" :key="spot.no" @click="selectSpot(spot)" class="cursor-pointer transition-transform hover:scale-[1.02]">
          <SpotCard
            :title="spot.title"
            :type="getTypeName(spot.contentTypeId)"
            :rating="spot.averageRating"
            :review-count="spot.reviewCount"
          />
        </div>

        <!-- 더 많은 결과가 있을 경우 -->
        <div v-if="sortedSpots.length >= 300" class="text-center text-gray-400 mt-2">
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
import { onMounted, ref, computed} from 'vue'
import { onBeforeUnmount } from 'vue'
import SpotCard from '@/components/SpotCard.vue'
import SpotDetail from '@/components/SpotDetail.vue'

// 기본 관광지 정보 타입
interface BasicSpot {
  no: number
  title: string
  contentTypeId: number
  latitude: number
  longitude: number
  averageRating: number
  reviewCount: number
}

// 상세 관광지 정보 타입
interface DetailSpot extends BasicSpot {
  ageRatings: {
    twenties: number
    thirties: number
    forties: number
    fifties: number
    sixties: number
  }
  mostPopularAccompanyType: string
  mostPopularMotive: string
}

const sidebarWidth = ref(360) // 사이드바 초기 너비
let isResizing = false

// 반응형 변수로 선언
const currentType = ref<number | null>(null)
const isLoadingLocation = ref(false)
const locationError = ref<string | null>(null)
const isLoadingSpots = ref(false)
const isLoadingSpotDetail = ref(false)
const spots = ref<BasicSpot[]>([])
const searchKeyword = ref('')
const selectedSpot = ref<BasicSpot | null>(null)
const selectedSpotDetail = ref<DetailSpot | null>(null)
const currentLocation = ref<{lat: number, lng: number} | null>(null)

// 정렬 옵션 상태
const sortOption = ref('rating')

// 검색어 필터링된 관광지 목록
const filteredSpots = computed(() => {
  if (!searchKeyword.value) return spots.value

  const keyword = searchKeyword.value.toLowerCase()
  return spots.value.filter(spot =>
    spot.title.toLowerCase().includes(keyword)
  )
})

// 🔥 정렬 기능 추가 - 검색 + 정렬이 모두 적용된 최종 목록
const sortedSpots = computed(() => {
  const spotsToSort = [...filteredSpots.value]

  switch (sortOption.value) {
    case 'rating':
      return spotsToSort.sort((a, b) => {
        const ratingA = a.averageRating || 0
        const ratingB = b.averageRating || 0

        // 평점이 둘 다 0이면 리뷰 개수로 정렬
        if (ratingA === 0 && ratingB === 0) {
          return (b.reviewCount || 0) - (a.reviewCount || 0)
        }

        // 평점이 0인 것은 맨 뒤로
        if (ratingA === 0) return 1
        if (ratingB === 0) return -1

        // 평점 높은 순
        return ratingB - ratingA
      })

    case 'rating-low':
      return spotsToSort.sort((a, b) => {
        const ratingA = a.averageRating || 0
        const ratingB = b.averageRating || 0

        // 평점이 둘 다 0이면 리뷰 개수로 정렬
        if (ratingA === 0 && ratingB === 0) {
          return (b.reviewCount || 0) - (a.reviewCount || 0)
        }

        // 평점이 0인 것은 맨 뒤로
        if (ratingA === 0) return 1
        if (ratingB === 0) return -1

        // 평점 낮은 순
        return ratingA - ratingB
      })

    case 'reviews':
      return spotsToSort.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))

    case 'name':
      return spotsToSort.sort((a, b) => a.title.localeCompare(b.title, 'ko'))

    default:
      return spotsToSort
  }
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
  1: '자연관광지',
  2: '역사 시설',
  3: '공연,영화,전시',
  4: '상업 스팟',
  5: '레저, 스포츠',
  6: '테마시설',
  7: '걷기 좋은 길',
  8: '지역 축제',
}

function getTypeName(typeId: number): string {
  return typeMap[typeId] || '기타'
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
}

function drawMarkers(spotsData: BasicSpot[]) {
  clearMarkers()
  spots.value = spotsData // 관광지 목록 저장

  spotsData.forEach((spot) => {
    const position = new kakao.maps.LatLng(spot.latitude, spot.longitude)
    const marker = new kakao.maps.Marker({ position, map, title: spot.title })

    // 🔥 평점 표시 개선
    const ratingDisplay = spot.averageRating > 0
      ? `⭐ ${spot.averageRating.toFixed(1)} (${spot.reviewCount}개)`
      : '리뷰 없음'

    const hoverInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px; font-size:13px;">
        <strong>${spot.title}</strong><br>
        ${getTypeName(spot.contentTypeId)}<br>
        ${ratingDisplay}
      </div>`,
    })

    const detailInfo = new kakao.maps.InfoWindow({
      content: `
        <div style="padding:10px; font-size:14px; max-width:300px;">
          <strong>${spot.title}</strong><br/>
          타입: ${getTypeName(spot.contentTypeId)}<br/>
          평점: ${ratingDisplay}<br/>
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

      // 해당 관광지 선택 (기본 정보만)
      selectSpotBasic(spot)
    })

    markers.push(marker)
  })

  // 전역 함수로 노출시켜 인포윈도우에서 호출할 수 있게 함
  // @ts-ignore
  window.selectSpotById = async (id: number) => {
    const spot = spots.value.find(s => s.no === id)
    if (spot) {
      await selectSpot(spot)
    }
  }
}

// 기본 관광지 선택 (상세 정보 로드하지 않음)
function selectSpotBasic(spot: BasicSpot) {
  selectedSpot.value = spot
  selectedSpotDetail.value = null // 상세 정보 초기화
}

// 관광지 선택 시 상세 정보 로드
async function selectSpot(spot: BasicSpot) {
  selectedSpot.value = spot
  selectedSpotDetail.value = null
  isLoadingSpotDetail.value = true

  try {
    const response = await fetch(`/api/spots/${spot.no}/detail`)
    if (!response.ok) {
      throw new Error('상세 정보를 가져올 수 없습니다.')
    }

    const detailData: DetailSpot = await response.json()
    selectedSpotDetail.value = detailData
  } catch (error) {
    console.error('상세 정보 로딩 실패:', error)
    // 상세 정보 로딩 실패 시 기본 정보라도 표시
    selectedSpotDetail.value = {
      ...spot,
      ageRatings: {
        twenties: 0,
        thirties: 0,
        forties: 0,
        fifties: 0,
        sixties: 0
      },
      mostPopularAccompanyType: '정보 없음',
      mostPopularMotive: '정보 없음'
    }
  } finally {
    isLoadingSpotDetail.value = false
  }

  moveToSpot(spot)
}

// 관광지 상세보기 닫기
function closeSpotDetail() {
  selectedSpot.value = null
  selectedSpotDetail.value = null
}

// 관광지 위치로 지도 이동
function moveToSpot(spot: BasicSpot) {
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

    const ratingDisplay = spot.averageRating > 0
      ? `⭐ ${spot.averageRating.toFixed(1)} (리뷰 ${spot.reviewCount}개)`
      : '리뷰 없음'

    const detailInfo = new kakao.maps.InfoWindow({
      content: `
        <div style="padding:10px; font-size:14px; max-width:300px;">
          <strong>${spot.title}</strong><br/>
          타입: ${getTypeName(spot.contentTypeId)}<br/>
          평점: ${ratingDisplay}<br/>
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

// 🔥 검색 핸들러 (디바운스 적용) - 정렬된 목록 기준으로 마커 표시
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
    console.log(currentType.value, "디버깅")
    url += `&type=${currentType.value}`
  }

  isLoadingSpots.value = true

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('관광지 데이터를 가져올 수 없습니다.')
      }
      return res.json()
    })
    .then((data: BasicSpot[]) => {
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
  selectedSpotDetail.value = null
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  })
}

// 적절한 지도 레벨을 결정하는 함수
function getMapLevel(lat: number, lng: number): number {
  // 한국 내 위치인지 확인 (대략적인 범위)
  const isInKorea = lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132

  if (isInKorea) {
    return 6
  } else {
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
