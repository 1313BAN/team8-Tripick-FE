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
