
<template>
  <div class="bg-gray-800 p-4 rounded shadow text-white">
    <!-- 헤더 부분 -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-lg font-semibold">{{ spot.title }}</h3>
        <div class="flex gap-2 mt-1">
          <span class="px-2 py-0.5 text-xs bg-blue-600 rounded">{{ getTypeName(spot.contentTypeId) }}</span>

          <span class="text-yellow-400 text-sm">★ {{ spot.averageRating.toFixed(1) }}</span>
          <span class="text-gray-400 text-xs">({{ spot.reviewCount }}개 리뷰)</span>
        </div>
      </div>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white">
        <span class="text-xl">×</span>
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-pulse text-gray-400">상세 정보를 불러오는 중...</div>
    </div>

    <!-- 상세 정보 -->
    <div v-else>
      <!-- 연령대별 평점 (상세 정보가 있을 때만 표시) -->
      <div v-if="hasDetailInfo" class="mb-4">
        <h4 class="text-gray-300 mb-2 font-medium text-sm">연령대별 평점</h4>
        <div class="grid grid-cols-5 gap-1 text-xs">
          <div class="text-center">
            <div class="text-gray-400">20대 </div>
            <div class="text-yellow-400">{{ (spot.ageRatings?.twenties && spot.ageRatings.twenties !== 0) ? spot.ageRatings.twenties.toFixed(1) :'없음' }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-400">30대</div>
            <div class="text-yellow-400">{{ (spot.ageRatings?.thirties && spot.ageRatings.thirties !== 0) ? spot.ageRatings.thirties.toFixed(1) :'없음' }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-400">40대</div>
            <div class="text-yellow-400">{{ (spot.ageRatings?.forties && spot.ageRatings.forties !== 0) ? spot.ageRatings.forties.toFixed(1) :'없음' }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-400">50대</div>
            <div class="text-yellow-400">{{ (spot.ageRatings?.fifties && spot.ageRatings.fifties !== 0) ? spot.ageRatings.fifties.toFixed(1) :'없음' }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-400">60대+</div>
            <div class="text-yellow-400">{{ (spot.ageRatings?.sixties && spot.ageRatings.sixties !== 0) ? spot.ageRatings.sixties.toFixed(1) :'없음' }}</div>
          </div>
        </div>
      </div>

      <!-- 인기 정보 (상세 정보가 있을 때만 표시) -->
    <!-- 인기 정보 (상세 정보가 있을 때만 표시) -->
<div v-if="hasDetailInfo" class="mb-3">
  <div class="space-y-1.5">
    <!-- 동행 타입 -->
    <div class="flex items-center justify-between bg-gray-800/30 p-2 rounded-md border border-gray-700/30">
      <div class="flex items-center gap-1.5">
        <span class="text-gray-400 text-xs">👥</span>
        <span class="text-gray-200 text-xs">주요 동행 타입</span>
      </div>
      <span class="text-gray-200 text-xs font-medium">
        {{ spot.mostPopularAccompanyType || '정보 없음' }}
      </span>
    </div>

    <!-- 방문 목적 -->
    <div class="flex items-center justify-between bg-gray-800/30 p-2 rounded-md border border-gray-700/30">
      <div class="flex items-center gap-1.5">
        <span class="text-gray-400 text-xs">🎯</span>
        <span class="text-gray-200 text-xs">여행 목적</span>
      </div>
      <span class="text-gray-200 text-xs font-medium">
        {{ spot.mostPopularMotive || '정보 없음' }}
      </span>
    </div>
  </div>
</div>

      <!-- 이미지 (기본 정보에는 없으므로 placeholder) -->
      <div class="mb-3 bg-gray-700 h-40 flex items-center justify-center rounded">
        <span class="text-gray-400">이미지 정보 없음</span>
      </div>

      <!-- 기본 정보 안내 -->
      <div v-if="!hasDetailInfo" class="mb-3 p-2 bg-blue-900 bg-opacity-50 rounded text-xs">
        <span class="text-blue-300">💡 연령대별 평점과 인기 정보는 상세 데이터 로딩 시 표시됩니다.</span>
      </div>

      <!-- 버튼 -->
      <div class="mt-4 flex justify-between">
        <button
          @click="moveToSpot"
          class="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700"
        >
          지도에서 보기
        </button>
        <button
          @click="refreshDetail"
          class="bg-gray-700 text-white px-4 py-2 rounded text-xs hover:bg-gray-600"
          :disabled="isLoading"
        >
          {{ isLoading ? '로딩중...' : '상세정보 새로고침' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// DetailSpot 타입 정의
interface DetailSpot {
  no: number
  title: string
  contentTypeId: number
  latitude: number
  longitude: number
  averageRating: number
  reviewCount: number
  ageRatings?: {
    twenties: number
    thirties: number
    forties: number
    fifties: number
    sixties: number
  }
  mostPopularAccompanyType?: string
  mostPopularMotive?: string
}

const props = defineProps<{
  spot: DetailSpot
  isLoading?: boolean
}>()

const emit = defineEmits(['close', 'move-to-spot', 'refresh-detail'])

// 상세 정보가 있는지 확인
const hasDetailInfo = computed(() => {
  return props.spot.ageRatings &&
         props.spot.mostPopularAccompanyType !== undefined &&
         props.spot.mostPopularMotive !== undefined
})

const typeMap: Record<number, string> = {
  1: '자연관광지',
  2: '역사시설',
  3: '공연,영화,전시',
  4: '상업스팟',
  5: '레저스포츠',
  6: '테마시설',
  7: '산책',
  8: '지역축제'
}

function getTypeName(typeId: number): string {
  return typeMap[typeId] || '기타'
}

function moveToSpot() {
  emit('move-to-spot', props.spot)
}

function refreshDetail() {
  emit('refresh-detail', props.spot.no)
}
</script>
