<template>
  <Card class="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
    <CardContent class="p-0">
      <div class="h-48 bg-gray-200 flex items-center justify-center">
        <span class="text-gray-400">{{ destination.title }}</span>
      </div>
    </CardContent>
    <CardFooter class="bg-gray-900 text-white p-4">
      <div class="w-full">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-medium text-lg">{{ destination.title }}</h3>
         <!-- 평점 표시 -->
          <div v-if="destination.rating !== undefined" class="flex items-center gap-2">
            <span class="text-yellow-400 text-xl">★</span>
            <span class="text-lg text-white">{{ destination.rating.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface Destination {
  id: number;
  title: string;
  tags: string[];
  rating?: number;
}

interface Props {
  destination: Destination;
}

defineProps<Props>();
</script>
