<template>
  <div class="bg-gray-800 rounded-lg p-6 text-white">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">리뷰 작성</h3>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white">
        <span class="text-xl">×</span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 관광지 정보 -->
      <div class="bg-gray-700 p-3 rounded-lg">
        <h4 class="font-medium text-sm text-gray-300">{{ spotTitle }}</h4>
      </div>

      <!-- 별점 -->
      <div>
        <label class="block text-sm font-medium mb-2">별점 *</label>
        <StarRating v-model="form.rating" />
        <p v-if="errors.rating" class="text-red-400 text-xs mt-1">{{ errors.rating }}</p>
      </div>

      <!-- 리뷰 제목 -->
      <div>
        <label class="block text-sm font-medium mb-2">리뷰 제목 *</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="리뷰 제목을 입력하세요"
          class="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxlength="50"
        />
        <div class="flex justify-between mt-1">
          <p v-if="errors.title" class="text-red-400 text-xs">{{ errors.title }}</p>
          <p class="text-gray-400 text-xs">{{ form.title.length }}/50</p>
        </div>
      </div>

      <!-- 리뷰 내용 -->
      <div>
        <label class="block text-sm font-medium mb-2">리뷰 내용 *</label>
        <textarea
          v-model="form.content"
          placeholder="솔직한 후기를 남겨주세요"
          rows="4"
          class="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          maxlength="1000"
        ></textarea>
        <div class="flex justify-between mt-1">
          <p v-if="errors.content" class="text-red-400 text-xs">{{ errors.content }}</p>
          <p class="text-gray-400 text-xs">{{ form.content.length }}/200</p>
        </div>
      </div>

      <!-- 여행 목적 -->
      <div>
        <label class="block text-sm font-medium mb-2">여행 목적</label>
        <select
          v-model="form.motiveCode"
          class="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <option value="">선택하세요</option>
        <option v-for="code in Object.keys(motiveOptions)" :key="code" :value="code">
          {{ motiveOptions[code] }}
        </option>
        </select>
      </div>

      <!-- 동반자 수 -->
      <div>
        <label class="block text-sm font-medium mb-2">동반자 수</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="form.comNum"
            type="number"
            min="1"
            max="20"
            class="w-20 px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="text-sm text-gray-400">명</span>
        </div>
        <p v-if="errors.comNum" class="text-red-400 text-xs mt-1">{{ errors.comNum }}</p>
      </div>

      <!-- 버튼 -->
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? '등록 중...' : '리뷰 등록' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import StarRating from '@/components/StarRating.vue'
import { motiveOptions } from '@/constants/motiveOptions'

interface ReviewForm {
  rating: number
  title: string
  content: string
  motiveCode: string
  comNum: number
}

interface Props {
  spotId: number
  spotTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [reviewData: ReviewForm & { no: number }]
}>()

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive<ReviewForm>({
  rating: 0,
  title: '',
  content: '',
  motiveCode: '',
  comNum: 1
})

const validateForm = (): boolean => {
  errors.value = {}

  if (form.rating === 0) {
    errors.value.rating = '별점을 선택해주세요'
  }

  if (!form.title.trim()) {
    errors.value.title = '리뷰 제목을 입력해주세요'
  } else if (form.title.length < 5) {
    errors.value.title = '리뷰 제목은 5자 이상 입력해주세요'
  } else if (form.title.length > 50) {
    errors.value.title = '리뷰 제목은 50자 이하로 입력해주세요'
  }

  if (!form.content.trim()) {
    errors.value.content = '리뷰 내용을 입력해주세요'
  } else if (form.content.length < 1) {
    errors.value.content = '리뷰 내용은 1자 이상 입력해주세요'
  } else if (form.content.length > 1000) {
    errors.value.content = '리뷰 내용은 1000자 이하로 입력해주세요'
  }

  if (form.comNum < 1) {
    errors.value.comNum = '동반자 수는 1명 이상이어야 합니다'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const reviewData = {
      ...form,
      no: props.spotId,
      motiveCode: form.motiveCode ? Number(form.motiveCode) : undefined
    }

    emit('submit', reviewData)
  } catch (error) {
    console.error('리뷰 작성 오류:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 폼 초기화 함수 (필요시 사용)
const resetForm = () => {
  form.rating = 0
  form.title = ''
  form.content = ''
  form.motiveCode = ''
  form.comNum = 1
  errors.value = {}
}

defineExpose({
  resetForm
})
</script>
