<!-- src/components/layout/Navbar.vue -->
<template>
  <nav class="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="text-xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent cursor-pointer hover:from-red-700 hover:to-red-900 transition-all duration-200" @click="goHome">
      Tripick
    </div>
    <div class="flex items-center space-x-4">
      <button
        @click="goHome"
        class="px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded transition-colors duration-200"
      >
        홈
      </button>
      <button
        @click="goMap"
        class="px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded transition-colors duration-200"
      >
        지도
      </button>
      <template v-if="auth.isLoggedIn">
        <!-- 유저 이름 표시 -->
        <span v-if="auth.user" class="text-gray-700 ml-2">
          안녕하세요, {{ getUserName }}님!
        </span>
        <button
          @click="goMypage"
          class="px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded transition-colors duration-200"
        >
          마이페이지
        </button>
        <button
          @click="auth.logout"
          class="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
        >
          로그아웃
        </button>
      </template>
      <template v-else>
        <button
          @click="goLogin"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors duration-200"
        >
          로그인
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'

const router = useRouter()
const auth = useAuthStore()

console.log('디버강', auth)

// 유저 이름을 가져오는 computed 속성
const getUserName = computed(() => {
  if (!auth.user) return ''

  // UserDto에서 사용 가능한 이름 필드를 우선순위대로 체크
  // 아래 필드명들을 실제 UserDto 타입에 맞게 수정하세요
  return auth.user.nickname || auth.user.name || '사용자'
})

const goHome = () => router.push('/')
const goMap = () => router.push('/map')
const goLogin = () => router.push('/login')
const goMypage = () => router.push('/mypage')
</script>
