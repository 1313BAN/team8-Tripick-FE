<template>
  <div>
    <!-- 히어로 섹션 -->
    <HeroSection
      :hashtags="hashtags"
      :selected-tags="selectedTags"
      @toggle-tag="toggleTag"
      @recommend="handleRecommend"
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
import { ref } from 'vue';
import HeroSection from '@/components/HeroSection.vue';
import PopularDestinationsSection from '@/components/PopularDestinationsSection.vue';
import TopDestinationCard from '@/components/TopDestinationCard.vue';

// 선택된 해시태그를 관리하기 위한 상태
const selectedTags = ref<string[]>([]);

// 해시태그 토글 함수
const toggleTag = (tagId: string) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId);
  } else {
    selectedTags.value.push(tagId);
  }
};

// 관광지 추천 함수
const handleRecommend = () => {
  console.log('선택된 태그들:', selectedTags.value);
  // 여기에 추천 로직 구현 (라우터로 결과 페이지 이동 등)
};

// 해시태그 데이터
const hashtags = [
  { id: 'nature', name: '자연' },
  { id: 'culture', name: '문화' },
  { id: 'food', name: '미식' },
  { id: 'history', name: '역사' },
  { id: 'healing', name: '힐링' },
  { id: 'activity', name: '액티비티' },
  { id: 'family', name: '가족' },
  { id: 'romance', name: '로맨틱' },
  { id: 'slow', name: '슬로우팡' }
];

// TOP 여행지 데이터
const topDestinations = [
  { id: 1, title: 'TOP 여행지 1' },
  { id: 2, title: 'TOP 여행지 2' },
  { id: 3, title: 'TOP 여행지 3' }
];
</script>
