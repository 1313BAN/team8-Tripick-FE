<template>
  <div class="bg-gray-800 p-4 rounded shadow text-white">
    <!-- 헤더 부분 -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-lg font-semibold">{{ spot.title }}</h3>
        <div class="flex gap-2 mt-1">
          <span class="px-2 py-0.5 text-xs bg-blue-600 rounded">{{ getTypeName(spot.contentTypeId) }}</span>
          <span class="text-yellow-400 text-sm">★ {{ rating.toFixed(1) }}</span>
        </div>
      </div>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white">
        <span class="text-xl">×</span>
      </button>
    </div>

    <!-- 이미지 -->
    <div v-if="spot.firstImage1" class="mb-3">
      <img :src="spot.firstImage1" :alt="spot.title" class="w-full h-40 object-cover rounded">
    </div>
    <div v-else class="mb-3 bg-gray-700 h-40 flex items-center justify-center rounded">
      <span class="text-gray-400">이미지 없음</span>
    </div>

    <!-- 주소 및 연락처 -->
    <div class="mb-3 text-sm">
      <div class="flex items-start mb-1">
        <span class="text-gray-400 mr-2">📍</span>
        <span>{{ spot.addr || '주소 정보 없음' }}</span>
      </div>
      <div class="flex items-start" v-if="spot.homepage">
        <span class="text-gray-400 mr-2">🔗</span>
        <a :href="spot.homepage" target="_blank" class="text-blue-400 hover:underline">홈페이지 바로가기</a>
      </div>
    </div>

    <!-- 개요 -->
    <div v-if="spot.overview" class="mt-3 text-sm">
      <h4 class="text-gray-300 mb-1 font-medium">개요</h4>
      <p class="text-gray-400 leading-relaxed">{{ formatOverview(spot.overview) }}</p>
    </div>

    <!-- 버튼 -->
    <div class="mt-4 flex justify-between">
      <button
        @click="moveToSpot"
        class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        지도에서 보기
      </button>
      <button
        v-if="spot.homepage"
        @click="openHomepage"
        class="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
      >
        상세정보
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  spot: {
    no: number
    title: string
    contentTypeId: number
    areaCode: number
    siGunGuCode: number
    firstImage1: string
    firstImage2: string
    latitude: number
    longitude: number
    addr: string
    homepage: string
    overview: string
  }
  rating: number
}>()

const emit = defineEmits(['close', 'move-to-spot'])

const typeMap: Record<number, string> = {
  12: '관광지',
  14: '문화시설',
  15: '축제공연',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점'
}

function getTypeName(typeId: number): string {
  return typeMap[typeId] || '기타'
}

function formatOverview(overview: string): string {
  // HTML 태그 제거
  const withoutTags = overview.replace(/<[^>]*>/g, '')

  // 100자로 제한 (필요시)
  if (withoutTags.length > 150) {
    return withoutTags.substring(0, 150) + '...'
  }

  return withoutTags
}

function moveToSpot() {
  emit('move-to-spot', props.spot)
}

function openHomepage() {
  if (props.spot.homepage) {
    window.open(props.spot.homepage, '_blank')
  }
}
</script>
