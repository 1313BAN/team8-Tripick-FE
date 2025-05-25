<template>
  <Navbar />
  <router-view />
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/authStore'
import Navbar from '@/components/layout/Navbar.vue'

const authStore = useAuthStore()

// 앱 시작 시 사용자 정보 초기화
onMounted(async () => {
  await authStore.initialize()
})

</script>

<style></style>
