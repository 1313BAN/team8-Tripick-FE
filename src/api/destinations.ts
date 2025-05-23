import axios, { type AxiosResponse } from 'axios';
import instance from '@/api/axios';
import type { AgeRange } from '@/types/api';
// API 기본 URL (환경변수나 설정파일에서 관리하는 것을 권장)
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

// 인터페이스 정의
interface RecommendationRequestDTO {
  gender?: string | null;
  minAge?: number;
  maxAge?: number;
  motiveCode?: number | null;
  contentTypeId?: number | null;
  areaCode?: number | null;
  siGunGuCode?: number | null;
  limit?: number;
}

interface SpotRecommendationDTO {
  contentId: number;
  title: string;
  addr1?: string;
  firstImage?: string;
  mapX?: number;
  mapY?: number;
  contentTypeId?: number;
  areaCode?: number;
  siGunGuCode?: number;
  rating?: number;
  tags?: string[];
  spotName?: string;
}

interface FilterOptions {
  gender?: string | null;
  age?: string | null;
  motiveCode?: number | null;
  contentTypeId?: number | null;
  areaCode?: number | null;
  siGunGuCode?: number | null;
  limit?: number;
}

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (인증 토큰 등 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 오류 시 로그인 페이지로 리다이렉트
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 성별을 백엔드 형식으로 변환
 * @param gender - 프론트엔드 성별 ('male' | 'female')
 * @returns 백엔드 성별 형식
 */
const convertGenderForBackend = (gender?: string | null): string | undefined => {
  if (!gender) return undefined;
  return gender === 'male' ? 'MALE' : 'FEMALE';
};

/**
 * 연령대를 나이 범위로 변환
 * @param ageGroup - 연령대 ('10s', '20s', etc.)
 * @returns minAge, maxAge 포함한 객체
 */
const convertAgeGroupToRange = (ageGroup?: string | null): AgeRange => {
  if (!ageGroup) return { minAge: 0, maxAge: 100 };

  const ageRanges: Record<string, AgeRange> = {
    '10s': { minAge: 10, maxAge: 19 },
    '20s': { minAge: 20, maxAge: 29 },
    '30s': { minAge: 30, maxAge: 39 },
    '40s': { minAge: 40, maxAge: 49 },
    '50s': { minAge: 50, maxAge: 59 },
    '60s': { minAge: 60, maxAge: 100 }
  };

  return ageRanges[ageGroup] || { minAge: 0, maxAge: 100 };
};

/**
 * 복합 추천 API 호출
 * @param filters - 필터 조건
 * @returns API 응답
 */
export const getComplexRecommendations = async (
  filters: FilterOptions = {}
  ):Promise<SpotRecommendationDTO[]> => {
  try {
    // 연령대를 나이 범위로 변환
    const ageRange = convertAgeGroupToRange(filters.age);

    // 요청 데이터 구성
    const requestData: RecommendationRequestDTO = {
      gender: convertGenderForBackend(filters.gender),
      minAge: ageRange.minAge,
      maxAge: ageRange.maxAge,
      motiveCode: filters.motiveCode || undefined,
      contentTypeId: filters.contentTypeId || undefined,
      areaCode: filters.areaCode || undefined,
      siGunGuCode: filters.siGunGuCode || undefined,
      limit: filters.limit || 10
    };

    // undefined 값 제거 (백엔드에서 기본값 처리)
    Object.keys(requestData).forEach(key => {
      const typedKey = key as keyof RecommendationRequestDTO;
      if (requestData[typedKey] === undefined || requestData[typedKey] === null) {
        delete requestData[typedKey];
      }
    });

    console.log('API 요청 데이터:', requestData);

    const response: AxiosResponse<SpotRecommendationDTO[]> = await apiClient.post(
      '/recommendations/complex',
      requestData
    );

    return response.data;
  } catch (error) {
    console.error('복합 추천 API 호출 실패:', error);
    throw error;
  }
};

/**
 * 인기 관광지 목록 조회
 * @returns API 응답
 */
export const fetchPopularDestinations = async (): Promise<SpotRecommendationDTO[]> => {
  try {
    const response: AxiosResponse<SpotRecommendationDTO[]> = await instance.get('/destinations/popular');
    return response.data;
  } catch (error) {
    console.error('인기 관광지 조회 실패:', error);
    throw error;
  }
};


// 타입 내보내기
export type {
  RecommendationRequestDTO,
  SpotRecommendationDTO,
  FilterOptions,
  AgeRange
};

export default {
  getComplexRecommendations,
  fetchPopularDestinations,
};
