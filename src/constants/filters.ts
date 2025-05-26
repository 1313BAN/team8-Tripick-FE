import type { GenderOption, AgeGroupOption, AgeRange } from '@/types/filter'

export const GENDER_OPTIONS: readonly GenderOption[] = [
  { value: 'male', label: '남자' },
  { value: 'female', label: '여자' }
] as const

export const AGE_GROUP_OPTIONS: readonly AgeGroupOption[] = [
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s', label: '40대' },
  { value: '50s', label: '50대' },
  { value: '60s', label: '60대 이상' }
] as const

// 연령대 → 나이 범위 매핑
export const AGE_RANGE_MAP: Record<string, AgeRange> = {
  '10s': { minAge: 10, maxAge: 19 },
  '20s': { minAge: 20, maxAge: 29 },
  '30s': { minAge: 30, maxAge: 39 },
  '40s': { minAge: 40, maxAge: 49 },
  '50s': { minAge: 50, maxAge: 59 },
  '60s': { minAge: 60, maxAge: 100 }
} as const

// 유틸리티 함수들
export const convertAgeGroupToRange = (ageGroup?: string | null): AgeRange => {
  if (!ageGroup) return { minAge: 0, maxAge: 100 }
  return AGE_RANGE_MAP[ageGroup] || { minAge: 0, maxAge: 100 }
}

export const convertGenderForBackend = (gender?: string | null): string | undefined => {
  if (gender === 'male') return 'MALE'
  if (gender === 'female') return 'FEMALE'
  return undefined // unknown 값은 변환하지 않음
}
