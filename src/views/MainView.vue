<template>
  <div>

    <!-- 히어로 섹션 -->
    <div class="py-12 px-4 text-center">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-4xl font-bold mb-4">당신만의 특별한 여행</h1>
        <p class="text-gray-600 mb-8">해시태그를 선택하여 당신에게 맞는 관광지를 찾아보세요</p>

        <!-- 연도 표시 -->
        <div class="text-8xl font-bold text-gray-200 opacity-30 my-6"></div>
        <div class="text-6xl text-gray-200 opacity-30 mb-6"></div>

        <!-- 해시태그 버튼들 -->
        <div class="flex flex-wrap justify-center gap-2 my-8">
          <Badge
            v-for="tag in hashtags"
            :key="tag.id"
            :variant="selectedTags.includes(tag.id) ? 'default' : 'secondary'"
            class="px-4 py-2 text-sm rounded-full cursor-pointer"
            @click="toggleTag(tag.id)"
          >
            #{{ tag.name }}
          </Badge>
        </div>

        <!-- 관광지 추천 버튼 -->
        <Button variant="destructive" size="lg">
          관광지 추천 받기
        </Button>

        <p class="text-gray-600 mt-12">인기 있는 관광지 미리보기</p>
      </div>
    </div>

    <!-- 인기 관광지 카드 섹션 -->
    <div class="py-10 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card v-for="destination in popularDestinations" :key="destination.id">
            <CardContent class="p-0">
              <div class="h-48 bg-gray-200"></div>
            </CardContent>
            <CardFooter class="bg-gray-900 text-white p-4">
              <div>
                <h3 class="font-medium text-lg">{{ destination.title }}</h3>
                <div class="flex gap-2 mt-1">
                  <span v-for="(tag, index) in destination.tags" :key="index" class="text-xs">
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>

    <!-- TOP 여행지 섹션 -->
    <div class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-10 text-center">이주의 TOP 여행지</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(topDest, index) in topDestinations" :key="topDest.id" class="relative">
            <div class="absolute top-0 left-0 bg-red-500 text-white px-4 py-1 font-bold z-10">
              TOP {{ index + 1 }}
            </div>
            <div class="h-48 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Menu } from 'lucide-vue-next';

// 선택된 해시태그를 관리하기 위한 상태
const selectedTags = ref([]);

// 해시태그 토글 함수
const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId);
  } else {
    selectedTags.value.push(tagId);
  }
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

// 인기 관광지 데이터
const popularDestinations = [
  {
    id: 1,
    title: '제주 성산일출봉',
    tags: ['자연', '힐링']
  },
  {
    id: 2,
    title: '경주 불국사',
    tags: ['역사', '문화']
  },
  {
    id: 3,
    title: '부산 해운대',
    tags: ['힐링', '바다']
  },
  {
    id: 4,
    title: '서울 남산타워',
    tags: ['로맨틱', '야경']
  }
];

// TOP 여행지 데이터
const topDestinations = [
  { id: 1, title: 'TOP 여행지 1' },
  { id: 2, title: 'TOP 여행지 2' },
  { id: 3, title: 'TOP 여행지 3' }
];
</script>
