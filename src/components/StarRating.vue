<template>
  <div class="flex items-center gap-1">
    <div class="flex items-center">
      <button
        v-for="star in 5"
        :key="star"
        type="button"
        @click="setRating(star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
        class="text-2xl transition-colors duration-150 focus:outline-none"
        :class="getStarClass(star)"
      >
        ★
      </button>
    </div>
    <span v-if="showLabel && modelValue > 0" class="ml-2 text-sm text-gray-600">
      {{ modelValue }}점
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: number
  showLabel?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  showLabel: true,
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverRating = ref(0)

const setRating = (rating: number) => {
  if (props.readonly) return
  emit('update:modelValue', rating)
}

const getStarClass = (star: number) => {
  const currentRating = hoverRating.value || props.modelValue

  if (props.readonly) {
    return star <= props.modelValue
      ? 'text-yellow-400'
      : 'text-gray-300'
  }

  return star <= currentRating
    ? 'text-yellow-400 hover:text-yellow-500 cursor-pointer'
    : 'text-gray-300 hover:text-yellow-300 cursor-pointer'
}
</script>
