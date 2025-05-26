export interface IdNameItem {
  id: number | string
  name: string
}

export interface LabelValueItem<T = string> {
  label: string
  value: T
}

export interface AgeRange {
  minAge: number
  maxAge: number
}

export interface Coordinates {
  lat: number
  lng: number
}

// 로딩/에러 상태 (모든 컴포넌트에서 사용)
export interface RequestState {
  loading: boolean
  error: string | null
}

// 간단한 평점 (기존 코드 호환)
export interface SimpleRating {
  rating?: number | null
  reviewCount?: number | null
}

// 클릭 핸들러 (컴포넌트에서 많이 사용)
export type ClickHandler<T = any> = (data: T) => void
