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
