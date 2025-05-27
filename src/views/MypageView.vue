<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-6">마이페이지</h2>

    <div v-if="user">
      <label class="block font-semibold mb-1">닉네임</label>
      <input v-model="user.nickname" class="border p-2 mb-4 w-full" />

      <label class="block font-semibold mb-1">이름</label>
      <input v-model="user.name" class="border p-2 mb-4 w-full" />

      <label class="block font-semibold mb-1">자기소개</label>
      <input v-model="user.bio" class="border p-2 mb-4 w-full" placeholder="자기소개 입력" />

      <label class="block font-semibold mb-1">성별</label>
      <select v-model="user.gender" class="border p-2 mb-4 w-full">
        <option disabled value="">성별 선택</option>
        <option value="MALE">남성</option>
        <option value="FEMALE">여성</option>
      </select>

      <label class="block font-semibold mb-1">나이</label>
      <input
        v-model.number="user.age"
        type="number"
        class="border p-2 mb-4 w-full"
        placeholder="나이 입력"
      />

      <label class="block font-semibold mb-1">동행 유형</label>
      <select v-model.number="user.accompanyCode" class="border p-2 mb-4 w-full">
        <option disabled value="">동행 유형 선택</option>
        <option v-for="(label, code) in accompanyOptions" :key="code" :value="code">
          {{ label }}
        </option>
      </select>

      <label class="block font-semibold mb-1">거주 지역</label>
      <select v-model.number="user.residenceSidoCode" class="border p-2 mb-4 w-full">
        <option disabled value="">거주 지역 선택</option>
        <option v-for="(name, code) in sidoOptions" :key="code" :value="code">
          {{ name }}
        </option>
      </select>

      <div class="mb-4">
        <label class="block font-semibold mb-1">여행 동기 선택</label>
        <div v-for="(name, code) in motiveOptions" :key="code" class="mb-1">
          <label class="inline-flex items-center space-x-2">
            <input type="checkbox" :value="code" v-model="user.motiveCodes" />
            <span>{{ name }}</span>
          </label>
        </div>

        <!-- 선택된 동기 리스트 -->
        <div v-if="user">
          <!-- 예시: motiveCodes 표시 -->
          <p class="text-sm text-gray-600 mt-2">
            선택됨:
            <span v-if="user.motiveCodes && user.motiveCodes.length">
              {{ user.motiveCodes.map((code) => motiveOptions[code]).join(', ') }}
            </span>
            <span v-else class="text-red-400">없음</span>
          </p>
        </div>
      </div>

      <button @click="handleUpdate" class="bg-blue-500 text-white font-semibold p-2 w-full">
        정보 수정
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/authStore'
import { ref, onMounted } from 'vue'
import type { UserDetailDto } from '@/types/UserDetailDto'

const auth = useAuthStore()
const user = ref<UserDetailDto | null>(null)

onMounted(async () => {
  await auth.fetchMyDetail()
  user.value = { ...auth.userDetail! } // !는 fetchMyDetail 이후에는 존재함을 의미
})

const accompanyOptions: Record<number, string> = {
  1: '나홀로 여행',
  2: '2인 여행(가족 외)',
  3: '3인 이상 여행(가족 외)',
  4: '2인 가족 여행',
  5: '자녀 동반 여행',
  6: '부모 동반 여행',
  7: '3대 동반 여행(친척 포함)',
}

const sidoOptions: Record<number, string> = {
  11: '서울특별시',
  26: '부산광역시',
  27: '대구광역시',
  28: '인천광역시',
  29: '광주광역시',
  30: '대전광역시',
  31: '울산광역시',
  36: '세종특별자치시',
  41: '경기도',
  42: '강원도',
  43: '충청북도',
  44: '충청남도',
  45: '전라북도',
  46: '전라남도',
  47: '경상북도',
  48: '경상남도',
  50: '제주특별자치도',
}

const motiveOptions: Record<number, string> = {
  1: '일상적인 환경 탈출',
  2: '휴식과 회복',
  3: '유대감 증진',
  4: '자아 찾기',
  5: 'SNS 명소',
  6: '건강 증진',
  7: '새로운 경험',
  8: '교육적 동기',
  9: '특별한 목적',
  10: '기타',
}

const handleUpdate = async () => {
  if (!user.value) return
  await auth.updateMyInfo(user.value)
  alert('수정 완료')
}
</script>
