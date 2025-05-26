import { type AxiosResponse } from 'axios'
import instance from '@/api/authApi'
import type { RecommendationRequestDTO,
              SpotRecommendationDTO,
              FilterOptions
            } from '@/types/spot'
import {
  convertAgeGroupToRange,
  convertGenderForBackend
} from '@/constants/filters'

/**
 * 복합 추천 API 호출
 * @param filters - 필터 조건
 * @returns API 응답
 */
export const getComplexRecommendations = async (
  filters: FilterOptions = {},
): Promise<SpotRecommendationDTO[]> => {
  try {
    // 연령대를 나이 범위로 변환
    const ageRange = convertAgeGroupToRange(filters.age)

    // 요청 데이터 구성
    const requestData: RecommendationRequestDTO = {
      gender: convertGenderForBackend(filters.gender),
      minAge: ageRange.minAge,
      maxAge: ageRange.maxAge,
      motiveCode: filters.motiveCode || undefined,
      contentTypeId: filters.contentTypeId || undefined,
      areaCode: filters.areaCode || undefined,
      siGunGuCode: filters.siGunGuCode || undefined,
      limit: filters.limit || 10,
    }

    // undefined 값 제거 (백엔드에서 기본값 처리)
    Object.keys(requestData).forEach((key) => {
      const typedKey = key as keyof RecommendationRequestDTO
      if (requestData[typedKey] === undefined || requestData[typedKey] === null) {
        delete requestData[typedKey]
      }
    })

    console.log('API 요청 데이터:', requestData)
    console.log('API 요청 url:', instance.defaults.baseURL)
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)

    const response: AxiosResponse<SpotRecommendationDTO[]> = await instance.post(
      '/recommendations/complex',
      requestData,
    )

    return response.data
  } catch (error) {
    console.error('복합 추천 API 호출 실패:', error)
    throw error
  }
}

/**
 * 인기 관광지 목록 조회
 * @returns API 응답
 */
export const fetchPopularDestinations = async (): Promise<SpotRecommendationDTO[]> => {
  try {
    const response: AxiosResponse<SpotRecommendationDTO[]> =
      await instance.get('/recommendations/popular-2022')
    return response.data
  } catch (error) {
    console.error('인기 관광지 조회 실패:', error)
    throw error
  }
}

// 타입 내보내기
export type { RecommendationRequestDTO, SpotRecommendationDTO, FilterOptions}

export default {
  getComplexRecommendations,
  fetchPopularDestinations,
}
