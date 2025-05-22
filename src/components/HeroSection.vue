<template>
  <div class="py-12 px-4 text-center">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold mb-4">당신만의 특별한 여행</h1>
      <p class="text-gray-600 mb-8">해시태그를 선택하여 당신에게 맞는 관광지를 찾아보세요</p>

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

      <!-- 관광지 추천 버튼 -->
      <Button variant="destructive" size="lg" @click="emit('recommend')">
        관광지 추천 받기
      </Button>

      <p class="text-gray-600 mt-12">인기 있는 관광지 미리보기</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import HashtagBadge from '@/components/HashtagBadge.vue';

interface Tag {
  id: string;
  name: string;
}

interface Props {
  hashtags: Tag[];
  selectedTags: string[];
}

defineProps<Props>();

// defineEmits는 한 번만 정의하고 변수에 할당
const emit = defineEmits<{
  toggleTag: [tagId: string];
  recommend: [];
}>();

const toggleTag = (tagId: string) => {
  // 부모 컴포넌트로 이벤트 전달
  emit('toggleTag', tagId);
};
</script>
