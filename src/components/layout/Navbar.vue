<!-- src/components/layout/Navbar.vue -->
<template>
  <nav class="flex justify-between items-center px-6 py-4 shadow bg-white sticky top-0 z-10">
    <div class="text-xl font-bold cursor-pointer" @click="goHome">Tripick</div>
    <div class="space-x-4">
      <button @click="goHome">홈</button>
      <button @click="goMap">지도</button>
      <template v-if="auth.isLoggedIn">
        <button @click="goMypage">마이페이지</button>
        <button @click="auth.logout">로그아웃</button>
      </template>
      <template v-else>
        <button @click="goLogin">로그인</button>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'

const router = useRouter()
const auth = useAuthStore()

const goHome = () => router.push('/')
const goMap = () => router.push('/map')
const goLogin = () => router.push('/login')
const goMypage = () => router.push('/mypage')
</script>
