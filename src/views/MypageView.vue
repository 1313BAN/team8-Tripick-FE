<!-- src/views/MypageView.vue -->
<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">마이페이지</h2>
    <div v-if="user">
      <input v-model="user.nickname" placeholder="닉네임" class="border p-2 mb-2 w-full" />
      <input v-model="user.name" placeholder="이름" class="border p-2 mb-2 w-full" />
      <input v-model="user.bio" placeholder="소개" class="border p-2 mb-2 w-full" />

      <select v-model="user.gender" class="border p-2 mb-2 w-full">
        <option disabled value="">성별 선택</option>
        <option value="MALE">남성</option>
        <option value="FEMALE">여성</option>
      </select>

      <input
        v-model.number="user.age"
        type="number"
        placeholder="나이"
        class="border p-2 mb-2 w-full"
      />

      <button @click="handleUpdate" class="bg-blue-500 text-white p-2 w-full">정보 수정</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/authStore'
import { reactive } from 'vue'

const auth = useAuthStore()
const user = reactive({ ...auth.user })

const handleUpdate = async () => {
  await auth.updateMyInfo(user)
  alert('수정 완료')
}
</script>
