<template>
  <div>
    <!-- 히어로 섹션 -->
    <HeroSection
      :hashtags="HASHTAG_LIST"
      :selected-tags="selectedTags"
      :show-results="showResults"
      :results="recommendResults"
      :is-loading="isLoading"
      @toggle-tag="toggleTag"
      @recommend="handleRecommend"
      @reset="handleReset"
    />

    <!-- 인기 관광지 섹션 (필터 기능 포함) -->
    <PopularDestinationsSection />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/feature/recommendation/HeroSection.vue'
import PopularDestinationsSection from '@/components/feature/recommendation/PopularDestinationsSection.vue'
import TopDestinationCard from '@/components/feature/recommendation/TopRecommendationCard.vue'
import axios from '@/api/authApi'
import { HASHTAG_LIST } from '@/constants/recommendation'

// 선택된 해시태그를 관리하기 위한 상태
const selectedTags = ref<string[]>([])
const showResults = ref(false)
const recommendResults = ref([])
const isLoading = ref(false)

// 해시태그 토글 함수
const toggleTag = (tagId: string) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId)
  } else {
    selectedTags.value.push(tagId)
  }
}

// 관광지 추천 함수
const handleRecommend = async () => {
  isLoading.value = true
  showResults.value = false
  try {
    const response = await axios.post('/ai-recommend/category', {
      categories: selectedTags.value,
    })
    recommendResults.value = response.data
    showResults.value = true
  } catch (error) {
    console.error('추천 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  selectedTags.value = []
  showResults.value = false
}

// TOP 여행지 데이터
const topDestinations = [
  { id: 1, title: 'TOP 여행지 1' },
  { id: 2, title: 'TOP 여행지 2' },
  { id: 3, title: 'TOP 여행지 3' },
]
</script>
