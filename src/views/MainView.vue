<template>
  <div>
    <!-- 히어로 섹션 -->
    <HeroSection
      :hashtags="hashtags"
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

    <!-- TOP 여행지 섹션 -->
    <div class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-10 text-center">이주의 TOP 여행지</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TopDestinationCard
            v-for="(topDest, index) in topDestinations"
            :key="topDest.id"
            :destination="topDest"
            :rank="index + 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import PopularDestinationsSection from '@/components/PopularDestinationsSection.vue'
import TopDestinationCard from '@/components/TopDestinationCard.vue'
import axios from '@/api/axios'

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

// 해시태그 데이터
const hashtags = [
  { id: 'nature', name: '자연' },
  { id: 'culture', name: '문화' },
  { id: 'history', name: '역사' },
  { id: 'exhibition', name: '전시' },
  { id: 'photo', name: '사진명소' },
  { id: 'shopping', name: '쇼핑' },
  { id: 'leisure', name: '레저' },
  { id: 'themepark', name: '놀이공원' },
  { id: 'city', name: '도심여행' },
  { id: 'healing', name: '힐링' },
  { id: 'relax', name: '휴식' },
  { id: 'newexp', name: '새로운경험' },
  { id: 'romantic', name: '로맨틱' },
  { id: 'educational', name: '교육적' },
  { id: 'slowlife', name: '슬로우라이프' },
  { id: 'family', name: '가족' },
  { id: 'lover', name: '연인' },
  { id: 'friend', name: '우정여행' },
  { id: 'parent', name: '부모님과' },
  { id: 'child', name: '아이와함께' },
  { id: 'solo', name: '혼자' },
]

// TOP 여행지 데이터
const topDestinations = [
  { id: 1, title: 'TOP 여행지 1' },
  { id: 2, title: 'TOP 여행지 2' },
  { id: 3, title: 'TOP 여행지 3' },
]
</script>
