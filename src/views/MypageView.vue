<!-- src/views/MypageView.vue -->
<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">마이페이지</h2>
    <div v-if="form">
      <input v-model="form.nickname" placeholder="닉네임" class="input" />
      <input v-model="form.name" placeholder="이름" class="input" />
      <input v-model="form.bio" placeholder="소개" class="input" />

      <select v-model="form.gender" class="input">
        <option disabled value="">성별 선택</option>
        <option value="MALE">남성</option>
        <option value="FEMALE">여성</option>
      </select>

      <input v-model.number="form.age" type="number" placeholder="나이" class="input" />

      <button @click="handleUpdate" class="bg-blue-500 text-white p-2 w-full mt-2">
        정보 수정
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/authStore'

const auth = useAuthStore()
const form = reactive({
  nickname: '',
  name: '',
  bio: '',
  gender: '',
  age: 0,
})

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchMe()
  }

  if (auth.user) {
    Object.assign(form, auth.user) // 초기값 반영
  }
})

const handleUpdate = async () => {
  await auth.updateMyInfo(form)
  alert('수정 완료')
}
</script>

<style scoped>
.input {
  @apply border p-2 mb-2 w-full;
}
</style>
