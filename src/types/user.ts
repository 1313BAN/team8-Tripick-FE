
// src/types/user.ts
export interface UserDto {
  id: number
  nickname: string
  email: string
  name: string
  role: string
  gender: string
  age: number
  profileImage?: string
  bio?: string
}

export interface UserDetailDto {
  id: number
  email: string
  nickname: string
  name: string
  gender: string
  age: number
  accompanyCode?: number
  accompanyLabel?: string
  residenceSidoCode?: number
  residenceSidoName?: string
  motiveCodes: number[]
  motiveNames: string[]
  profileImage?: string
  bio?: string
  createdAt: string
}


export interface UserUpdateDto {
  nickname: string
  name: string
  gender: string
  age: number
  bio?: string
  profileImage?: string
  accompanyCode?: number
  residenceSidoCode?: number
  motiveCodes: number[]
}

// ===================================
// 필터용 성별 타입 (기존 코드 호환)
// ===================================

export type Gender = 'MALE' | 'FEMALE'
export type GenderFilter = 'male' | 'female'

// 성별 변환 함수용 타입
export interface GenderConversion {
  backend: Gender
  frontend: GenderFilter
  display: string
}
