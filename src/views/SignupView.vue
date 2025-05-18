<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">회원가입</h2>
    <input v-model="form.email" placeholder="이메일" class="border p-2 mb-2 w-full" />
    <input
      v-model="form.password"
      type="password"
      placeholder="비밀번호"
      class="border p-2 mb-2 w-full"
    />
    <input v-model="form.nickname" placeholder="닉네임" class="border p-2 mb-2 w-full" />
    <input v-model="form.name" placeholder="이름" class="border p-2 mb-2 w-full" />
    <select v-model="form.gender" class="border p-2 mb-2 w-full">
      <option disabled value="">성별 선택</option>
      <option value="MALE">남성</option>
      <option value="FEMALE">여성</option>
    </select>
    <input
      v-model.number="form.age"
      type="number"
      placeholder="나이"
      class="border p-2 mb-2 w-full"
    />
    <button @click="handleSignup" class="bg-green-500 text-white p-2 w-full">회원가입</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'

const form = reactive({
  email: '',
  password: '',
  nickname: '',
  name: '',
  gender: '',
  age: 0,
})

const auth = useAuthStore()
const router = useRouter()

const handleSignup = async () => {
  try {
    await auth.signup(form)
    alert('회원가입 성공!')
    router.push('/login')
  } catch (e) {
    alert('회원가입 실패')
  }
}
</script>
