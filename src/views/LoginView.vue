<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">로그인</h2>
    <input v-model="email" class="border p-2 mb-2 w-full" placeholder="이메일" />
    <input
      v-model="password"
      type="password"
      class="border p-2 mb-2 w-full"
      placeholder="비밀번호"
    />
    <button @click="handleLogin" class="bg-blue-500 text-white p-2 w-full">로그인</button>
    <p class="mt-4 text-center">
      아직 계정이 없으신가요?
      <span class="text-blue-500 cursor-pointer" @click="goSignup">회원가입</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    alert('로그인 실패')
  }
}

const goSignup = () => router.push('/signup')
</script>
