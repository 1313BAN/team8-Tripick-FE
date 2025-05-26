import type { IdNameItem } from "./common"

export interface ContentType extends IdNameItem {
  id: number
  name: string
  icon: string
}

export interface Hashtag extends IdNameItem {
  id: string
  name: string
  category?: string
}

export interface MotiveOption extends IdNameItem {
  id: number
  name: string
}
