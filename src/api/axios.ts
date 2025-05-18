// src/api/axios.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api', // 프록시가 붙어 있으므로 그대로 사용 가능
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
