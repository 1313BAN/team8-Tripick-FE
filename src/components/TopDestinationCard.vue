<template>
  <div class="relative cursor-pointer group">
    <div class="absolute top-0 left-0 bg-red-500 text-white px-4 py-1 font-bold z-10 transition-colors group-hover:bg-red-600">
      TOP {{ rank }}
    </div>
    <div class="h-48 bg-gray-200 flex items-center justify-center transition-transform group-hover:scale-105">
      <span class="text-gray-400">{{ destination.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TopDestination {
  id: number;
  title: string;
}

interface Props {
  destination: TopDestination;
  rank: number;
}

defineProps<Props>();
</script>
