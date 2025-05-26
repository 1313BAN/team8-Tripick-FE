import type { ContentType } from '@/types/content'

export const CONTENT_TYPES: readonly ContentType[] = [
  { id: 1, name: '자연관광지', icon: '🏔️' },
  { id: 2, name: '역사 시설', icon: '🏛️' },
  { id: 3, name: '공연,영화,전시', icon: '🎬' },
  { id: 4, name: '상업 스팟', icon: '🏪' },
  { id: 5, name: '레저, 스포츠', icon: '🏖️' },
  { id: 6, name: '테마시설', icon: '🏯' },
  { id: 7, name: '걷기 좋은 길', icon: '🚶' },
  { id: 8, name: '지역 축제', icon: '🎪' }
] as const

// 타입 ID → 이름 매핑 (역방향 검색용)
export const CONTENT_TYPE_MAP: Record<number, string> = Object.fromEntries(
  CONTENT_TYPES.map(type => [type.id, type.name])
)

// 유틸리티 함수
export const getContentTypeName = (typeId: number): string => {
  return CONTENT_TYPE_MAP[typeId] || '기타'
}
