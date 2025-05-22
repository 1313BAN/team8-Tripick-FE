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
