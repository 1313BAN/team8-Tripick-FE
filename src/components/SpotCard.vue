<template>
  <div class="bg-gray-800 p-4 rounded shadow text-white">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <span class="text-sm text-gray-400">{{ type }}</span>
      </div>
      <div class="text-yellow-400 font-bold text-sm text-right">
        ★ {{ rating.toFixed(1) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  rating: number
  type: string
}>()
</script>
