<template>
  <div class="py-10 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6 text-center">인기 관광지</h2>

      <!-- 필터 섹션 -->
      <FilterSection
        :selected-gender="selectedGender"
        :selected-age="selectedAge"
        @filter-change="handleFilterChange"
      />

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">관광지를 불러오는 중...</span>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg mb-4">{{ error }}</p>
        <Button variant="outline" @click="fetchDestinations">
          다시 시도
        </Button>
      </div>

      <!-- 관광지 카드 그리드 -->
      <div v-else-if="destinations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DestinationCard
          v-for="destination in destinations"
          :key="destination.id || destination.contentId"
          :destination="destination"
          @click="handleDestinationClick(destination)"
        />
      </div>

      <!-- 결과가 없을 때 -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">선택한 조건에 맞는 관광지가 없습니다.</p>
        <Button variant="outline" class="mt-4" @click="resetFilters">
          필터 초기화
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import FilterSection from '@/components/FilterSection.vue';
import DestinationCard from '@/components/DestinationCard.vue';
import {
  getComplexRecommendations,
  type SpotRecommendationDTO,
  type FilterOptions
} from '@/api/destinations';

interface Destination {
  id?: number;
  contentId?: number;
  title: string;
  tags: string[];
  image?: string;
  rating?: number;
  location?: string;
  addr1?: string;
  firstImage?: string;
  mapX?: number;
  mapY?: number;
}

interface FilterData {
  gender: string | null;
  age: string | null;
}

// 상태 관리
const selectedGender = ref<string | null>(null);
const selectedAge = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const destinations = ref<Destination[]>([]);

// 필터 변경 핸들러
const handleFilterChange = async (filterData: FilterData): Promise<void> => {
  if (filterData.gender) {
    selectedGender.value = selectedGender.value === filterData.gender ? null : filterData.gender;
  }
  if (filterData.age) {
    selectedAge.value = selectedAge.value === filterData.age ? null : filterData.age;
  }

  await fetchDestinations();
};

// 백엔드 응답을 프론트엔드 형식으로 변환
const convertToDestination = (item: SpotRecommendationDTO): Destination => ({
  id: item.contentId,
  contentId: item.contentId,
  title: item.title || item.spotName || '제목 없음',
  tags: item.tags || [],
  image: item.firstImage,
  rating: item.rating,
  location: item.addr1,
  addr1: item.addr1,
  firstImage: item.firstImage,
  mapX: item.mapX,
  mapY: item.mapY
});

// API 호출 함수
const fetchDestinations = async (): Promise<void> => {
  isLoading.value = true;
  error.value = null;

  try {
    const filters: FilterOptions = {
      gender: selectedGender.value,
      age: selectedAge.value,
      limit: 12 // 한 번에 12개씩 가져오기
    };

    console.log('필터 조건:', filters);

    const response: SpotRecommendationDTO[] = await getComplexRecommendations(filters);

    // 백엔드 응답 데이터를 프론트엔드 형식으로 변환
    destinations.value = response.map(convertToDestination);

    console.log('받은 관광지 데이터:', destinations.value);

  } catch (err: any) {
    console.error('관광지 데이터를 불러오는데 실패했습니다:', err);
    error.value = err.response?.data?.message || '관광지 데이터를 불러오는데 실패했습니다.';
    destinations.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 필터 초기화
const resetFilters = (): void => {
  selectedGender.value = null;
  selectedAge.value = null;
  fetchDestinations();
};

// 관광지 클릭 핸들러
const handleDestinationClick = (destination: Destination): void => {
  console.log('관광지 선택:', destination);
  // 상세 페이지로 이동하거나 모달 열기 등의 로직
  // 예: router.push(`/destination/${destination.contentId || destination.id}`);
};

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchDestinations();
});
</script>
