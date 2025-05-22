// 연령 범위 인터페이스
export interface AgeRange {
  minAge: number;
  maxAge: number;
}

// API 에러 응답 인터페이스
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// 해시태그 인터페이스
export interface Tag {
  id: string;
  name: string;
}

// TOP 여행지 인터페이스
export interface TopDestination {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

// 성별 타입
export type Gender = 'male' | 'female';

// 연령대 타입
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s' | '60s';

// API 응답 래퍼
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 페이지네이션 인터페이스
export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 페이지네이션된 응답
export interface PageableResponse<T> {
  content: T[];
  pagination: Pagination;
}
