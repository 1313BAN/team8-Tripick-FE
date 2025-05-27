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
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">
          성별, 연령대 기반 추천 관광지
        </h2>

        <!-- 필터 섹션 -->
        <FilterSection
          :selected-gender="selectedGender"
          :selected-age="selectedAge"
          @filter-change="handleFilterChange"
          @filter-reset="handleFilterReset"
        />

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <span class="ml-2 text-gray-600">관광지를 불러오는 중...</span>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 text-lg mb-4">{{ error }}</p>
          <Button
            variant="outline"
            class="border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="fetchDestinations"
          >
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
            <CarouselPrevious
              class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
            />
            <CarouselNext
              class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
            />
          </Carousel>

          <!-- 모바일 스크롤 힌트 -->
          <div class="text-center mt-4 text-gray-500 text-sm md:hidden">
            ← 좌우로 스와이프하세요 →
          </div>
        </div>

        <!-- 결과가 없을 때 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 text-lg">선택한 조건에 맞는 관광지가 없습니다.</p>
          <Button
            variant="outline"
            class="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="resetFilters"
          >
            필터 초기화
          </Button>
        </div>
      </div>

      <!-- 두 번째 카테고리: 동기 기반 추천 -->
      <div class="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">
          동기 기반 추천 관광지
        </h2>

        <!-- 동기 선택 필터 -->
        <div class="mb-8">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <button
              v-for="(label, code) in motiveOptions"
              :key="code"
              @click="selectMotive(Number(code))"
              :class="[
                'p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                selectedMotive === Number(code)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ label }}
            </button>
          </div>

          <!-- 선택된 동기 표시 -->
          <div v-if="selectedMotive" class="flex items-center gap-2">
            <span class="text-sm text-gray-600">선택된 동기:</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {{ motiveOptions[selectedMotive] }}
              <button @click="clearMotive" class="ml-2 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isMotiveLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <span class="ml-2 text-gray-600">관광지를 불러오는 중...</span>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="motiveError" class="text-center py-12">
          <p class="text-red-500 text-lg mb-4">{{ motiveError }}</p>
          <Button
            variant="outline"
            class="border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="fetchMotiveDestinations"
          >
            다시 시도
          </Button>
        </div>

        <!-- shadcn Carousel 슬라이더 -->
        <div v-else-if="motiveDestinations.length > 0" class="relative">
          <Carousel
            :opts="{
              align: 'start',
              loop: false,
            }"
            class="w-full"
          >
            <CarouselContent class="-ml-6">
              <CarouselItem
                v-for="destination in motiveDestinations"
                :key="destination.id || destination.contentId"
                class="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <DestinationCard
                  :destination="destination"
                  @click="handleDestinationClick(destination)"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious
              class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
            />
            <CarouselNext
              class="hidden md:flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
            />
          </Carousel>

          <!-- 모바일 스크롤 힌트 -->
          <div class="text-center mt-4 text-gray-500 text-sm md:hidden">
            ← 좌우로 스와이프하세요 →
          </div>
        </div>

        <!-- 결과가 없을 때 -->
        <div v-else-if="selectedMotive" class="text-center py-12">
          <p class="text-gray-600 text-lg">선택하신 동기에 맞는 관광지가 없습니다.</p>
          <Button
            variant="outline"
            class="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="clearMotive"
          >
            동기 선택 해제
          </Button>
        </div>

        <!-- 초기 상태 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 text-lg">여행 동기를 선택해주세요.</p>
        </div>
      </div>

      <!-- 세 번째 카테고리 -->
      <!-- <div class="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-left text-gray-800">테마별 추천 관광지</h2>
        추가 카테고리 내용...
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ContentTypeSelector from '@/components/ContentTypeSelector.vue'
import FilterSection from '@/components/FilterSection.vue'
import DestinationCard from '@/components/DestinationCard.vue'
import {
  getComplexRecommendations,
  type SpotRecommendationDTO,
  type FilterOptions,
} from '@/api/destinations'
import { useAuthStore } from '@/features/auth/authStore'
import { useRouter } from 'vue-router'


const router = useRouter()


interface Destination {
  id: number
  contentId?: number
  title: string
  tags: string[]
  image?: string
  rating?: number
  location?: string
  addr1?: string
  firstImage?: string
  mapX?: number
  mapY?: number
  contentTypeId: number,         // 추가 정보
  contentTypeName: string,     // 추가 정보
  reviewCount: number,
}

interface FilterData {
  gender: string | null
  age: string | null
}

// 동기 옵션
const motiveOptions: Record<number, string> = {
  1: '일상적인 환경 탈출',
  2: '휴식과 회복',
  3: '유대감 증진',
  4: '자아 찾기',
  5: 'SNS 명소',
  6: '건강 증진',
  7: '새로운 경험',
  8: '교육적 동기',
  9: '특별한 행사'
}

// AuthStore 접근
const authStore = useAuthStore()

// 기존 성별, 연령대 상태 관리
const selectedGender = ref<string | null>(null)
const selectedAge = ref<string | null>(null)
const selectedContentType = ref<number | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const destinations = ref<Destination[]>([])

// 동기 기반 상태 관리
const selectedMotive = ref<number | null>(null)
const isMotiveLoading = ref<boolean>(false)
const motiveError = ref<string | null>(null)
const motiveDestinations = ref<Destination[]>([])

// 디바운싱을 위한 타이머
let fetchTimer: NodeJS.Timeout | null = null
let motiveFetchTimer: NodeJS.Timeout | null = null

// 🔥 사용자 정보를 바탕으로 초기 필터값 설정
const initializeUserFilters = (): void => {
  if (!authStore.isLoggedIn || !authStore.user) {
    console.log('로그인되지 않았거나 사용자 정보가 없어 필터 초기화 건너뜀')
    return
  }

  const user = authStore.user
  console.log('🎯 사용자 맞춤 필터 초기화:', user)

  // 성별 변환: backend의 'MALE'/'FEMALE' → frontend의 'male'/'female'
  if (user.gender) {
    selectedGender.value = convertGenderToFilterFormat(user.gender)
  }

  // 나이를 연령대로 변환: 25 → '20s'
  if (user.age) {
    selectedAge.value = convertAgeToAgeGroup(user.age)
  }

  console.log('설정된 필터:', {
    gender: selectedGender.value,
    age: selectedAge.value,
  })
}

// 성별 변환 함수
const convertGenderToFilterFormat = (gender: string): string => {
  const normalizedGender = gender.toLowerCase()

  if (normalizedGender === 'male' || normalizedGender === 'm' || normalizedGender === '남자') {
    return 'male'
  } else if (
    normalizedGender === 'female' ||
    normalizedGender === 'f' ||
    normalizedGender === '여자'
  ) {
    return 'female'
  }

  // 기본값 처리 - 첫 글자로 판단
  return normalizedGender.startsWith('m') ? 'male' : 'female'
}

// 나이를 연령대로 변환하는 함수
const convertAgeToAgeGroup = (age: number): string => {
  if (age >= 10 && age < 20) return '10s'
  if (age >= 20 && age < 30) return '20s'
  if (age >= 30 && age < 40) return '30s'
  if (age >= 40 && age < 50) return '40s'
  if (age >= 50 && age < 60) return '50s'
  if (age >= 60) return '60s'

  // 10세 미만인 경우 10대로 분류
  return '10s'
}

// 디바운싱된 API 호출 함수
const debouncedFetchDestinations = () => {
  if (fetchTimer) {
    clearTimeout(fetchTimer)
  }

  fetchTimer = setTimeout(() => {
    fetchDestinations()
  }, 300) // 300ms 디바운싱
}

// 동기 기반 디바운싱된 API 호출 함수
const debouncedFetchMotiveDestinations = () => {
  if (motiveFetchTimer) {
    clearTimeout(motiveFetchTimer)
  }

  motiveFetchTimer = setTimeout(() => {
    fetchMotiveDestinations()
  }, 300)
}

// 컨텐츠 타입 변경 핸들러
const handleContentTypeChange = (contentTypeId: number | null): void => {
  selectedContentType.value = contentTypeId
  debouncedFetchDestinations()
  // 동기 기반도 같이 업데이트 (선택된 동기가 있을 때만)
  if (selectedMotive.value) {
    debouncedFetchMotiveDestinations()
  }
}

// 필터 변경 핸들러
const handleFilterChange = (filterData: FilterData): void => {
  selectedGender.value = filterData.gender
  selectedAge.value = filterData.age
  debouncedFetchDestinations()
}

// 필터 리셋 핸들러
const handleFilterReset = (): void => {
  console.log('🔄 필터 리셋 실행')
  selectedGender.value = null
  selectedAge.value = null
  selectedContentType.value = null
  fetchDestinations()
}

// 동기 선택 핸들러
const selectMotive = (motiveCode: number): void => {
  selectedMotive.value = motiveCode
  debouncedFetchMotiveDestinations()
}

// 동기 선택 해제 핸들러
const clearMotive = (): void => {
  selectedMotive.value = null
  motiveDestinations.value = []
  motiveError.value = null
}

// 백엔드 응답을 프론트엔드 형식으로 변환
const convertToDestination = (item: SpotRecommendationDTO): Destination => ({
  id: item.no ?? 0,                          // no 필드 사용
  contentId: item.no,                        // no 필드 사용
  title: item.title || '제목 없음',
  tags: item.tags || [item.contentTypeName] || [],                     // tags가 없다면 contentTypeName을 태그로 사용
  image: item.firstImage1,                   // firstImage1 필드 사용
  rating: item.avgRating,                    // avgRating 필드 사용
  location: item.addr,                       // addr 필드 사용
  addr1: item.addr,                          // addr 필드 사용
  firstImage: item.firstImage1,              // firstImage1 필드 사용
  mapX: item.longitude,                      // longitude 필드 사용
  mapY: item.latitude,                       // latitude 필드 사용
  contentTypeId: item.contentTypeId,         // 추가 정보
  contentTypeName: item.contentTypeName,     // 추가 정보
  reviewCount: item.reviewCount,             // 리뷰 개수 추가
})

// 성별, 연령대 기반 API 호출 함수
const fetchDestinations = async (): Promise<void> => {
  // 이미 로딩 중이면 중복 호출 방지
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const filters: FilterOptions = {
      gender: selectedGender.value,
      age: selectedAge.value,
      contentTypeId: selectedContentType.value,
      limit: 12, // 한 번에 12개씩 가져오기
    }

    console.log('성별/연령대 필터 조건:', filters)

    const response: SpotRecommendationDTO[] = await getComplexRecommendations(filters)

    console.log('성별/연령대 디버깅:', response)
    // 백엔드 응답 데이터를 프론트엔드 형식으로 변환
    destinations.value = response.map(convertToDestination)

    console.log('받은 성별/연령대 관광지 데이터:', destinations.value)
  } catch (err: any) {
    console.error('성별/연령대 관광지 데이터를 불러오는데 실패했습니다:', err)
    error.value = err.response?.data?.message || '관광지 데이터를 불러오는데 실패했습니다.'
    destinations.value = []
  } finally {
    isLoading.value = false
  }
}

// 동기 기반 API 호출 함수
const fetchMotiveDestinations = async (): Promise<void> => {
  if (!selectedMotive.value || isMotiveLoading.value) {
    return
  }

  isMotiveLoading.value = true
  motiveError.value = null

  try {
    const filters: FilterOptions = {
      motiveCode: selectedMotive.value,
      contentTypeId: selectedContentType.value, // 컨텐츠 타입도 적용
      limit: 12,
    }

    console.log('동기 기반 필터 조건:', filters)

    const response: SpotRecommendationDTO[] = await getComplexRecommendations(filters)

    console.log('동기 기반 디버깅:', response)
    motiveDestinations.value = response.map(convertToDestination)

    console.log('받은 동기 기반 관광지 데이터:', motiveDestinations.value)
  } catch (err: any) {
    console.error('동기 기반 관광지 데이터를 불러오는데 실패했습니다:', err)
    motiveError.value = err.response?.data?.message || '관광지 데이터를 불러오는데 실패했습니다.'
    motiveDestinations.value = []
  } finally {
    isMotiveLoading.value = false
  }
}

// 필터 초기화 (결과가 없을 때 버튼에서 사용)
const resetFilters = (): void => {
  handleFilterReset()
}

// 관광지 클릭 핸들러
function  handleDestinationClick(spot: any) {
  router.push({
    name: 'MapWithSpot',
    params: {
      spotId: spot.id
    }
  })
  // 결과 URL: /map/spot/123
}

// 🔥 컴포넌트 마운트 시 사용자 필터 초기화 후 데이터 로드
onMounted(async () => {
  // 1. 사용자 정보 기반 필터 초기화
  initializeUserFilters()

  // 2. 초기 데이터 로드 (사용자 필터가 적용된 상태)
  await nextTick() // DOM 업데이트 대기
  fetchDestinations()
})

// 🔥 로그인 상태 변화 감지하여 필터 관리
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    console.log('사용자 상태 변화 감지:', { 이전: oldUser, 현재: newUser })

    if (newUser && !oldUser) {
      // 로그인됨: 사용자 정보 기반으로 필터 설정
      console.log('로그인 감지 - 사용자 맞춤 필터 적용')
      initializeUserFilters()
      fetchDestinations()
    } else if (!newUser && oldUser) {
      // 로그아웃됨: 필터 초기화
      console.log('로그아웃 감지 - 필터 초기화')
      selectedGender.value = null
      selectedAge.value = null
      selectedContentType.value = null
      selectedMotive.value = null
      fetchDestinations()
      motiveDestinations.value = []
    }
  },
  { immediate: false }, // 초기 실행 방지 (onMounted에서 이미 처리)
)

// 🔥 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (fetchTimer) {
    clearTimeout(fetchTimer)
    fetchTimer = null
  }
  if (motiveFetchTimer) {
    clearTimeout(motiveFetchTimer)
    motiveFetchTimer = null
  }
})
</script>
