<template>
  <Badge
    :variant="isSelected ? 'default' : 'secondary'"
    class="px-4 py-2 text-sm rounded-full cursor-pointer transition-colors hover:opacity-80"
    @click="$emit('toggle', tag.id)"
  >
    #{{ tag.name }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import type { IdNameItem} from '@/types/common';

interface Props {
  tag: IdNameItem<string>
  isSelected?: boolean
}

defineProps<Props>();

defineEmits<{
  toggle: [tagId: string];
}>();
</script>
