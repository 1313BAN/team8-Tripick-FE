// 기본 관광지 정보 타입
export interface BasicSpot {
  no: number
  title: string
  contentTypeId: number
  latitude: number
  longitude: number
  averageRating: number
  reviewCount: number
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


