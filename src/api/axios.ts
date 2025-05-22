import axios from 'axios'

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token)
    else prom.reject(error)
  })
  failedQueue = []
}

const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 Access Token 자동 첨부
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 응답 시 401 처리 → Refresh Token 재발급
// 응답 인터셉터 수정
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    console.warn('❗인터셉터 작동:', error?.response?.status, originalRequest.url)

    // 재시도 플래그
    if (error.response?.status === 401 && !originalRequest._retry) {
      ;(originalRequest as any)._retry = true

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post('/api/auth/reissue', null, {
          withCredentials: true,
        })
        const newAccessToken = res.data.accessToken

        localStorage.setItem('accessToken', newAccessToken)
        instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        return instance(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default instance
