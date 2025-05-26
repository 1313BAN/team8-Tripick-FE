// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    REISSUE: '/auth/reissue',
    LOGIN: '/login'
  },
  RECOMMENDATIONS: {
    COMPLEX: '/recommendations/complex',
    AI: '/ai-recommend/category'
  },
  DESTINATIONS: {
    POPULAR: '/destinations/popular'
  },
  SPOTS: {
    IN_BOUNDARY: '/spots/in-boundary',
    SEARCH: '/spots/search',
    DETAIL: (id: number) => `/spots/${id}/detail`,
    BY_ID: (id: number) => `/spots/${id}`
  }
} as const

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const
