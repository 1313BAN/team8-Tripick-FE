import axios from 'axios'

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false // 토큰 갱신 중인지 여부
let failedQueue: FailedRequest[] = [] // 대기 중인 요청들

// 토큰 갱신 함수
function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token)
    else prom.reject(error)
  })
  failedQueue = []
}

const baseURL = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 모든 요청 직전에 Access Token 자동 첨부
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
      (originalRequest as any)._retry = true

      // 2단계: 이미 갱신 중이면 큐에 추가
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        })
      }

      // 3단계: 토큰 갱신 실행
      isRefreshing = true
      try {
        const res = await axios.post(`${baseURL}/auth/reissue`, null, {
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
