<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-sm hover:shadow-md hover:border-gray-600 transition-all duration-200">
    <h3 class="font-semibold text-white mb-1 line-clamp-2">{{ title }}</h3>
    <p class="text-gray-400 text-xs mb-3">{{ type }}</p>

    <div class="flex items-center justify-between">
      <!-- 평점 표시 -->
      <div class="flex items-center gap-1">
        <template v-if="rating && rating > 0">
          <span class="text-yellow-400">⭐</span>
          <span class="text-sm font-medium text-white">{{ rating.toFixed(1) }}</span>
          <span class="text-xs text-gray-400">({{ reviewCount || 0 }})</span>
        </template>
        <template v-else>
          <span class="text-xs text-gray-500">리뷰 없음</span>
        </template>
      </div>

      <!-- 타입 표시 (작게) -->
      <div class="text-xs text-gray-500">
        {{ type }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpotCardProps } from '@/types/spot'


defineProps<SpotCardProps>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
