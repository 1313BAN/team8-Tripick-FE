<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">회원가입</h2>

    <label class="block mb-1 font-semibold">이메일</label>
    <input v-model="form.email" placeholder="이메일 입력" class="border p-2 mb-2 w-full" />

    <label class="block mb-1 font-semibold">비밀번호</label>
    <input
      v-model="form.password"
      type="password"
      placeholder="비밀번호 입력"
      class="border p-2 mb-2 w-full"
    />

    <label class="block mb-1 font-semibold">닉네임</label>
    <input v-model="form.nickname" placeholder="닉네임 입력" class="border p-2 mb-2 w-full" />

    <label class="block mb-1 font-semibold">이름</label>
    <input v-model="form.name" placeholder="이름 입력" class="border p-2 mb-2 w-full" />

    <label class="block mb-1 font-semibold">성별</label>
    <select v-model="form.gender" class="border p-2 mb-2 w-full">
      <option disabled value="">성별 선택</option>
      <option value="MALE">남성</option>
      <option value="FEMALE">여성</option>
    </select>

    <label class="block mb-1 font-semibold">나이</label>
    <input
      v-model.number="form.age"
      type="number"
      placeholder="나이 입력"
      class="border p-2 mb-2 w-full"
    />

    <label class="block mb-1 font-semibold">자기소개</label>
    <textarea
      v-model="form.bio"
      placeholder="자기소개를 입력하세요"
      class="border p-2 mb-2 w-full"
      rows="3"
    ></textarea>

    <label class="block mb-1 font-semibold">동행 유형</label>
    <select v-model.number="form.accompanyCode" class="border p-2 mb-2 w-full">
      <option disabled value="">동행 유형 선택</option>
      <option v-for="(label, code) in accompanyOptions" :key="code" :value="code">
        {{ label }}
      </option>
    </select>

    <label class="block mb-1 font-semibold">거주 지역</label>
    <select v-model.number="form.residenceSidoCode" class="border p-2 mb-2 w-full">
      <option disabled value="">거주 지역 선택</option>
      <option v-for="(name, code) in sidoOptions" :key="code" :value="code">
        {{ name }}
      </option>
    </select>

    <div class="mb-4">
      <label class="block font-semibold mb-1">여행 동기 선택</label>
      <div v-for="(name, code) in motiveOptions" :key="code" class="mb-1">
        <label>
          <input type="checkbox" :value="code" v-model="form.motiveCodes" /> {{ name }}
        </label>
      </div>
    </div>

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
  bio: '',
  accompanyCode: 0,
  residenceSidoCode: 0,
  motiveCodes: [] as number[],
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

const auth = useAuthStore()
const router = useRouter()

const handleSignup = async () => {
  try {
    await auth.signup(form)
    alert('회원가입 성공!')
    router.push('/login')
  } catch {
    alert('회원가입 실패')
  }
}
</script>
