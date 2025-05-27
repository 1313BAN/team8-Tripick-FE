<template>
  <div class="mb-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">관광지 유형 선택</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <Button
        v-for="contentType in contentTypes"
        :key="contentType.id"
        :variant="selectedContentType === contentType.id ? 'default' : 'outline'"
        :class="[
          'px-4 py-3 text-sm font-medium transition-all duration-200 h-auto flex-col',
          selectedContentType === contentType.id
            ? 'bg-black text-white hover:bg-gray-800 shadow-md'
            : 'border-gray-800 text-black hover:bg-gray-900 hover:text-white hover:border-black',
        ]"
        @click="selectContentType(contentType.id)"
      >
        <div class="text-4xl mb-1">{{ contentType.icon }}</div>
        {{ contentType.name }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface ContentType {
  id: number
  name: string
  icon: string
}

interface Props {
  selectedContentType: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  contentTypeChange: [contentTypeId: number | null]
}>()

// 컨텐츠 타입 데이터 (이미지 기반으로 매핑)
const contentTypes: ContentType[] = [
  { id: 1, name: '자연관광지', icon: '🏔️' },
  { id: 2, name: '역사 시설', icon: '🏛️' },
  { id: 3, name: '공연,영화,전시', icon: '🎬' },
  { id: 4, name: '상업 스팟', icon: '🏪' },
  { id: 5, name: '레저, 스포츠', icon: '🏖️' },
  { id: 6, name: '테마시설', icon: '🏯' },
  { id: 7, name: '걷기 좋은 길', icon: '🚶' },
  { id: 8, name: '지역 축제', icon: '🎪' },
]

const selectContentType = (contentTypeId: number) => {
  // 같은 버튼 클릭 시 토글 (선택 해제)
  const newSelection = props.selectedContentType === contentTypeId ? null : contentTypeId

  // 값이 실제로 변경될 때만 emit
  if (newSelection !== props.selectedContentType) {
    emit('contentTypeChange', newSelection)
  }
}

const clearSelection = () => {
  // 현재 선택된 값이 있을 때만 emit
  if (props.selectedContentType !== null) {
    emit('contentTypeChange', null)
  }
}
</script>
