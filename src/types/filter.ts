import type { LabelValueItem, AgeRange } from './common'

export interface GenderOption extends LabelValueItem {
  value: 'male' | 'female'
}

export interface AgeGroupOption extends LabelValueItem {
  value: string // '10s', '20s', etc.
}

export type SortOption = 'rating' | 'rating-low' | 'reviews'
