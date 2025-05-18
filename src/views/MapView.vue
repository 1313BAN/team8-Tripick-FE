<template>
  <div class="p-4">
    <div id="category" class="flex gap-2 my-2">
      <button @click="changeType(null)">전체</button>
      <button @click="changeType(12)">관광지</button>
      <button @click="changeType(14)">문화시설</button>
      <button @click="changeType(15)">축제</button>
      <button @click="changeType(25)">여행코스</button>
      <button @click="changeType(28)">레포츠</button>
      <button @click="changeType(32)">숙박</button>
      <button @click="changeType(38)">쇼핑</button>
      <button @click="changeType(39)">음식점</button>
    </div>

    <h2 class="text-2xl font-bold mb-4">📍 관광지 지도</h2>
    <div id="map" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 반응형 변수로 선언
const currentType = ref<number | null>(null)
let map: kakao.maps.Map
let markers: kakao.maps.Marker[] = []
let openDetailInfoWindow: kakao.maps.InfoWindow | null = null

function getTypeName(typeId: number): string {
  const typeMap: Record<number, string> = {
    12: '관광지',
    14: '문화시설',
    15: '축제공연행사',
    25: '여행코스',
    28: '레포츠',
    32: '숙박',
    38: '쇼핑',
    39: '음식점',
  }
  return typeMap[typeId] || '기타'
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
}

function drawMarkers(spots: any[]) {
  clearMarkers()

  spots.forEach((spot) => {
    const position = new kakao.maps.LatLng(spot.latitude, spot.longitude)
    const marker = new kakao.maps.Marker({ position, map, title: spot.title })

    const hoverInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px; font-size:13px;"><strong>${spot.title}</strong><br>${getTypeName(spot.contentTypeId)}</div>`,
    })

    const detailInfo = new kakao.maps.InfoWindow({
      content: `
          <div style="padding:10px; font-size:14px; max-width:300px;">
            <strong>${spot.title}</strong><br/>
            주소: ${spot.addr1 || '없음'}<br/>
            전화: ${spot.tel || '없음'}<br/>
            <a href="${spot.homepage || '#'}" target="_blank">홈페이지</a>
          </div>
        `,
    })

    kakao.maps.event.addListener(marker, 'mouseover', () => hoverInfo.open(map, marker))
    kakao.maps.event.addListener(marker, 'mouseout', () => hoverInfo.close())
    kakao.maps.event.addListener(marker, 'click', () => {
      if (openDetailInfoWindow) openDetailInfoWindow.close()
      detailInfo.open(map, marker)
      openDetailInfoWindow = detailInfo
    })

    markers.push(marker)
  })
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

  fetch(url)
    .then((res) => res.json())
    .then(drawMarkers)
    .catch((err) => console.error('관광지 데이터 요청 실패:', err))
}

function changeType(type: number | null) {
  currentType.value = type
  fetchSpots()
}

onMounted(() => {
  if (typeof kakao === 'undefined') {
    console.error('❌ Kakao 객체가 없습니다.')
    return
  }

  const container = document.getElementById('map')
  if (!container) {
    console.error('❌ #map DOM을 찾을 수 없습니다.')
    return
  }

  const mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 7,
  }

  map = new kakao.maps.Map(container, mapOption)

  kakao.maps.event.addListener(map, 'idle', fetchSpots)
  fetchSpots()
})
</script>
