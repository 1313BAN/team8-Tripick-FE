import type { Coordinates } from '@/types/common'

// 지도 기본 설정
export const MAP_CONFIG = {
  // 기본 위치 (서울)
  DEFAULT_LOCATION: {
    lat: 37.5665,
    lng: 126.978
  } as Coordinates,

  // 줌 레벨
  DEFAULT_LEVEL: 6,
  DETAIL_LEVEL: 3,
  CURRENT_LOCATION_LEVEL: 4,
  MIN_LEVEL: 2,

  // 검색 설정
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300,

  // 위치 서비스 설정
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  }
} as const

// 사이드바 설정
export const SIDEBAR_CONFIG = {
  DEFAULT_WIDTH: 360,
  MIN_WIDTH: 260,
  MAX_WIDTH: 600
} as const
