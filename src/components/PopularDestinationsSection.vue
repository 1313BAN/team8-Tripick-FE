<template>
  <div class="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="container mx-auto px-4">
      <!-- 카테고리별 메인 제목 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">카테고리별 인기 관광지 모음</h1>
        <p class="text-gray-600 text-lg">다양한 조건으로 맞춤형 관광지를 찾아보세요</p>
      </div>

      <!-- 컨텐츠 타입 선택 섹션 -->
      <ContentTypeSelector
        :selected-content-type="selectedContentType"
        @content-type-change="handleContentTypeChange"
      />

      <!-- 첫 번째 카테고리: 성별, 연령대 기반 -->
      <div class="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">성별, 연령대 기반 추천 관광지</h2>

        <!-- 필터 섹션 -->
        <FilterSection
          :selected-gender="selectedGender"
          :selected-age="selectedAge"
          @filter-change="handleFilterChange"
        />

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <span class="ml-2 text-gray-600">관광지를 불러오는 중...</span>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 text-lg mb-4">{{ error }}</p>
          <Button variant="outline" class="border-gray-300 text-gray-700 hover:bg-gray-50" @click="fetchDestinations">
            다시 시도
          </Button>
        </div>

        <!-- shadcn Carousel 슬라이더 -->
        <div v-else-if="destinations.length > 0" class="relative">
          <Carousel
            :opts="{
              align: 'start',
              loop: false,
            }"
            class="w-full"
          >
            <CarouselContent class="-ml-6">
              <CarouselItem
                v-for="destination in destinations"
                :key="destination.id || destination.contentId"
                class="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <DestinationCard
                  :destination="destination"
                  @click="handleDestinationClick(destination)"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md" />
            <CarouselNext class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md" />
          </Carousel>

          <!-- 모바일 스크롤 힌트 -->
          <div class="text-center mt-4 text-gray-500 text-sm md:hidden">
            ← 좌우로 스와이프하세요 →
          </div>
        </div>

        <!-- 결과가 없을 때 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 text-lg">선택한 조건에 맞는 관광지가 없습니다.</p>
          <Button variant="outline" class="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50" @click="resetFilters">
            필터 초기화
          </Button>
        </div>
      </div>

      <!-- 여기에 추가 카테고리들이 들어갈 예정 -->
      <!-- 두 번째 카테고리 -->
      <!-- <div class="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">지역별 인기 관광지</h2>
        추가 카테고리 내용...
      </div> -->

      <!-- 세 번째 카테고리 -->
      <!-- <div class="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">테마별 추천 관광지</h2>
        추가 카테고리 내용...
      </div> -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ContentTypeSelector from '@/components/ContentTypeSelector.vue';
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
const selectedContentType = ref<number | null>(null);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const destinations = ref<Destination[]>([]);

// 디바운싱을 위한 타이머
let fetchTimer: NodeJS.Timeout | null = null;

// 디바운싱된 API 호출 함수
const debouncedFetchDestinations = () => {
  if (fetchTimer) {
    clearTimeout(fetchTimer);
  }

  fetchTimer = setTimeout(() => {
    fetchDestinations();
  }, 300); // 300ms 디바운싱
};

// 컨텐츠 타입 변경 핸들러
const handleContentTypeChange = (contentTypeId: number | null): void => {
  selectedContentType.value = contentTypeId;
  debouncedFetchDestinations();
};

// 필터 변경 핸들러
const handleFilterChange = (filterData: FilterData): void => {
  selectedGender.value = filterData.gender;
  selectedAge.value = filterData.age;
  debouncedFetchDestinations();
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
  // 이미 로딩 중이면 중복 호출 방지
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const filters: FilterOptions = {
      gender: selectedGender.value,
      age: selectedAge.value,
      contentTypeId: selectedContentType.value, // 🔥 컨텐츠 타입 추가
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
  selectedContentType.value = null; // 🔥 컨텐츠 타입도 초기화
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
