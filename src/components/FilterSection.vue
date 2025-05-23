<template>
  <div class="bg-gray-50 p-6 rounded-lg mb-6">
    <!-- 성별 필터 -->
    <div class="mb-4">
      <div class="flex gap-2">
        <Button
          v-for="gender in genders"
          :key="gender.value"
          :variant="selectedGender === gender.value ? 'default' : 'outline'"
          class="px-6 py-2"
          @click="selectGender(gender.value)"
        >
          {{ gender.label }}
        </Button>
      </div>
    </div>

    <!-- 연령대 필터 -->
    <div>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="age in ageGroups"
          :key="age.value"
          :variant="selectedAge === age.value ? 'default' : 'outline'"
          class="px-6 py-2"
          @click="selectAge(age.value)"
        >
          {{ age.label }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';

interface FilterData {
  gender: string | null;
  age: string | null;
}

interface Props {
  selectedGender: string | null;
  selectedAge: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  filterChange: [filterData: FilterData];
}>();

const genders = [
  { value: 'male', label: '남자' },
  { value: 'female', label: '여자' }
];

const ageGroups = [
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s', label: '40대' },
  { value: '50s', label: '50대' },
  { value: '60s', label: '60대 이상' }
];

const selectGender = (gender: string) => {
  emit('filterChange', {
    gender: gender,
    age: props.selectedAge
  });
};

const selectAge = (age: string) => {
  emit('filterChange', {
     gender: props.selectedGender,
    age: age
  });
};
</script>
