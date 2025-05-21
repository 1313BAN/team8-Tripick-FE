// src/features/auth/authStore.ts
import { defineStore } from 'pinia'
import axios from '@/api/axios'
import type { AuthResponse } from '@/types/auth'
import type { UserDto } from '@/types/UserDto'
import type { UserDetailDto } from '@/types/UserDetailDto'
import type { UserUpdateDto } from '@/types/UserUpdateDto'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserDto | null,
    userDetail: null as UserDetailDto | null,
    accessToken: localStorage.getItem('accessToken') || '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    async login(email: string, password: string) {
      const res = await axios.post<AuthResponse>(
        '/auth/login',
        { email, password },
        { withCredentials: true },
      )

      const { accessToken } = res.data
      this.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)

      await this.fetchMe()
    },

    async signup(payload: {
      email: string
      password: string
      nickname: string
      name: string
      gender: string
      age: number
      bio?: string
      accompanyCode: number
      residenceSidoCode: number
      motiveCodes: number[]
    }) {
      await axios.post('/users/signup', payload)
    },

    async fetchMe() {
      const res = await axios.get<UserDto>('/users/me')
      this.user = res.data
    },

    async fetchMyDetail() {
      const res = await axios.get<UserDetailDto>('/users/me')
      this.userDetail = res.data
    },

    async updateMyInfo(payload: UserUpdateDto) {
      await axios.put('/users/me', payload)
      if (this.user) {
        this.user = { ...this.user, ...payload }
      }
    },

    async logout() {
      try {
        await axios.post('/auth/logout', null, { withCredentials: true })
      } catch (e) {
        console.error('서버 로그아웃 실패', e)
      }
      this.accessToken = ''
      this.user = null
      this.userDetail = null
      localStorage.removeItem('accessToken')
    },
  },
})
