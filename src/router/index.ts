import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import MypageView from '@/views/MypageView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  { path: '/', name: 'Main', component: MainView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/mypage', component: MypageView },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/map/spot/:spotId(\\d+)', // 숫자만 허용
    name: 'MapWithSpot',
    component: MapView,
    props: true // spotId를 props로 전달
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
