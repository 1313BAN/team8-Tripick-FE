<template>
  <div class="py-12 px-4 text-center">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold mb-4">당신만의 특별한 여행</h1>

      <div v-if="showResults">
        <!-- 가로 스크롤 컨테이너 -->
        <div class="overflow-x-auto whitespace-nowrap py-4 -mx-2 px-2">
          <!-- 관광지 카드 -->
          <div
            v-for="spot in results"
            :key="spot.no"
            class="inline-block align-top bg-white p-4 rounded-lg shadow mr-4 w-fit text-left"
          >
            <h2 class="text-xl font-semibold">{{ spot.title }}</h2>
            <p class="text-gray-500 text-sm">{{ spot.addr }} | {{ spot.type }}</p>
            <p class="text-sm mt-2">👉 {{ spot.reason }}</p>

            <!-- 동행 유형 박스 -->
            <div class="block w-fit bg-blue-50 border border-blue-300 rounded-xl px-3 py-1 mt-3">
              <p class="text-[10px] text-blue-800 font-medium">
                {{ spot.accompanySummary }}
              </p>
            </div>

            <!-- 여행 동기 박스 -->
            <div class="block w-fit bg-green-50 border border-green-300 rounded-xl px-3 py-1 mt-2">
              <p class="text-[10px] text-green-800 font-medium">
                {{ spot.motiveSummary }}
              </p>
            </div>
          </div>
        </div>

        <Button
          :disabled="isLoading"
          variant="secondary"
          size="lg"
          class="mt-6 cursor-pointer"
          @click="emit('reset')"
        >
          다시 추천받기
        </Button>
      </div>

      <div v-else>
        <p class="text-gray-600 mb-6">해시태그를 선택하여 AI에게 관광지를 추천받아보세요</p>

        <!-- 연도 표시 -->
        <div class="text-8xl font-bold text-gray-200 opacity-30 my-6">2025</div>
        <div class="text-6xl text-gray-200 opacity-30 mb-6">TRAVEL</div>

        <!-- 해시태그 버튼들 -->
        <div class="flex flex-wrap justify-center gap-2 my-8">
          <HashtagBadge
            v-for="tag in hashtags"
            :key="tag.id"
            :tag="tag"
            :is-selected="selectedTags.includes(tag.id)"
            @toggle="toggleTag"
          />
        </div>

        <div v-if="isLoading" class="text-lg font-semibold text-gray-600 animate-pulse my-6">
          관광지를 추천 중...
        </div>
        <!-- 관광지 추천 버튼 -->
        <Button
          :disabled="isLoading"
          variant="destructive"
          size="lg"
          class="cursor-pointer"
          @click="emit('recommend')"
        >
          관광지 추천 받기
        </Button>

        <p class="text-gray-600 mt-12">인기 있는 관광지 미리보기</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import HashtagBadge from '@/components/HashtagBadge.vue'

interface Tag {
  id: string
  name: string
}

interface Props {
  hashtags: Tag[]
  selectedTags: string[]
  isLoading: boolean
  showResults: boolean
  results: {
    no: number
    title: string
    addr: string
    type: string
    accompanySummary: string
    motiveSummary: string
    reason: string
  }[]
}

defineProps<Props>()

const emit = defineEmits<{
  toggleTag: [tagId: string]
  recommend: []
  reset: []
}>()

const toggleTag = (tagId: string) => emit('toggleTag', tagId)
</script>
