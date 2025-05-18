import { defineStore } from 'pinia'
import axios from '@/api/axios'

interface UserDto {
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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserDto | null,
    token: localStorage.getItem('token') || '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      const res = await axios.post('/users/login', { email, password })
      this.token = res.data
      localStorage.setItem('token', this.token)
      await this.fetchMe()
    },
    async signup(payload: {
      email: string
      password: string
      nickname: string
      name: string
      gender: string
      age: number
    }) {
      await axios.post('/users/signup', payload)
    },
    async fetchMe() {
      const res = await axios.get('/users/me', {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      this.user = res.data
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
