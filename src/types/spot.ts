import type { Coordinates, SimpleRating, ClickHandler } from './common'

// ===================================
// 기본 관광지 타입 (MapView에서 사용)
// ===================================


export interface BasicSpot {
  no: number
  title: string
  contentTypeId: number
  latitude: number
  longitude: number
  addr?: string
  averageRating: number
  reviewCount: number
  firstImage1?: string
  overview?: string
  contentTypeName?: string
}

// 상세 관광지 정보 타입
export  interface DetailSpot extends BasicSpot {
  ageRatings: {
    twenties: number
    thirties: number
    forties: number
    fifties: number
    sixties: number
  }
  mostPopularAccompanyType: string
  mostPopularMotive: string
}

// ===================================
// UI용 통합 관광지 타입 (추천 컴포넌트에서 사용)
// ===================================

export interface Destination {
  id: number               // 프론트엔드용 ID
  contentId?: number       // 백엔드 실제 ID
  title: string
  tags?: string[]
  image?: string
  rating?: number
  location?: string
  addr1?: string
  firstImage?: string
  mapX?: number
  mapY?: number
  contentTypeId?: number
  contentTypeName?: string
  reviewCount?: number
  overview?: string
}

// ===================================
// API 관련 타입들
// ===================================

// API 응답 타입 (백엔드에서 오는 원본)
export interface SpotRecommendationDTO {
  no: number
  title: string
  contentTypeId: number
  contentTypeName?: string
  addr?: string
  latitude: number
  longitude: number
  avgRating: number
  reviewCount: number
  firstImage1?: string
  overview?: string
  tags?: string[]
}

// 필터 옵션
export interface FilterOptions {
  gender?: string | null
  age?: string | null
  contentTypeId?: number | null
  motiveCode?: number | null
  areaCode?: number | null
  siGunGuCode?: number | null
  limit?: number
}

// API 요청 타입 (백엔드로 보내는 용)
export interface RecommendationRequestDTO {
  gender?: string | null
  minAge?: number
  maxAge?: number
  motiveCode?: number | null
  contentTypeId?: number | null
  areaCode?: number | null
  siGunGuCode?: number | null
  limit?: number
}

// ===================================
// 컴포넌트 Props 타입들
// ===================================

// SpotCard Props
export interface SpotCardProps {
  title: string
  type: string
  rating?: number | null
  reviewCount?: number | null
  onClick?: ClickHandler
}

// SpotDetail Props
export interface SpotDetailProps {
  spot: DetailSpot
  isLoading?: boolean
  onClose?: ClickHandler
  onMoveToSpot?: ClickHandler<BasicSpot>
  onRefreshDetail?: ClickHandler<number>
}

// BasicRecommendationCard Props
export interface RecommendationCardProps {
  destination: Destination
}
