<template>
  <Card class="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
    <CardContent class="p-0">
      <div class="h-48 bg-gray-200 flex items-center justify-center">
        <span class="text-gray-400">{{ destination.title }}</span>
      </div>
    </CardContent>
    <CardFooter class="bg-gray-900 text-white p-4">
      <div>
        <h3 class="font-medium text-lg">{{ destination.title }}</h3>
        <div class="flex gap-2 mt-1 flex-wrap">
          <span
            v-for="(tag, index) in destination.tags"
            :key="index"
            class="text-xs bg-gray-700 px-2 py-1 rounded"
          >
            #{{ tag }}
          </span>
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
}

interface Props {
  destination: Destination;
}

defineProps<Props>();
</script>
