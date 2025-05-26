import type { Hashtag, MotiveOption } from '@/types/content'

export const HASHTAG_LIST: readonly Hashtag[] = [
  // 테마별
  { id: 'nature', name: '자연', category: 'theme' },
  { id: 'culture', name: '문화', category: 'theme' },
  { id: 'history', name: '역사', category: 'theme' },
  { id: 'exhibition', name: '전시', category: 'theme' },
  { id: 'photo', name: '사진명소', category: 'theme' },
  { id: 'shopping', name: '쇼핑', category: 'theme' },
  { id: 'leisure', name: '레저', category: 'theme' },
  { id: 'themepark', name: '놀이공원', category: 'theme' },
  { id: 'city', name: '도심여행', category: 'theme' },

  // 목적별
  { id: 'healing', name: '힐링', category: 'purpose' },
  { id: 'relax', name: '휴식', category: 'purpose' },
  { id: 'newexp', name: '새로운경험', category: 'purpose' },
  { id: 'romantic', name: '로맨틱', category: 'purpose' },
  { id: 'educational', name: '교육적', category: 'purpose' },
  { id: 'slowlife', name: '슬로우라이프', category: 'purpose' },

  // 동행별
  { id: 'family', name: '가족', category: 'companion' },
  { id: 'lover', name: '연인', category: 'companion' },
  { id: 'friend', name: '우정여행', category: 'companion' },
  { id: 'parent', name: '부모님과', category: 'companion' },
  { id: 'child', name: '아이와함께', category: 'companion' },
  { id: 'solo', name: '혼자', category: 'companion' }
] as const

export const MOTIVE_OPTIONS: Record<number, string> = {
  1: '일상적인 환경 탈출',
  2: '휴식과 회복',
  3: '유대감 증진',
  4: '자아 찾기',
  5: 'SNS 명소',
  6: '건강 증진',
  7: '새로운 경험',
  8: '교육적 동기',
  9: '특별한 행사'
} as const
