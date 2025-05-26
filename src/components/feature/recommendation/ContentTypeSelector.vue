<template>
  <div class="mb-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">관광지 유형 선택</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <Button
        v-for="contentType in CONTENT_TYPES"
        :key="contentType.id"
        :variant="selectedContentType === contentType.id ? 'default' : 'outline'"
        :class="[
          'px-4 py-3 text-sm font-medium transition-all duration-200 h-auto flex-col',
          selectedContentType === contentType.id
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        ]"
        @click="selectContentType(contentType.id)"
      >
        <div class="text-lg mb-1">{{ contentType.icon }}</div>
        <div class="text-xs leading-tight text-center">{{ contentType.name }}</div>
      </Button>
    </div>
    <div class="mt-4 text-center">
      <Button
        v-if="selectedContentType"
        variant="ghost"
        size="sm"
        class="text-gray-500 hover:text-gray-700"
        @click="clearSelection"
      >
        선택 해제
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { CONTENT_TYPES } from '@/constants/contentTypes'

interface Props {
  selectedContentType: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  contentTypeChange: [contentTypeId: number | null];
}>();

const selectContentType = (contentTypeId: number) => {
  // 같은 버튼 클릭 시 토글 (선택 해제)
  const newSelection = props.selectedContentType === contentTypeId ? null : contentTypeId;

  // 값이 실제로 변경될 때만 emit
  if (newSelection !== props.selectedContentType) {
    emit('contentTypeChange', newSelection);
  }
};

const clearSelection = () => {
  // 현재 선택된 값이 있을 때만 emit
  if (props.selectedContentType !== null) {
    emit('contentTypeChange', null);
  }
};
</script>
