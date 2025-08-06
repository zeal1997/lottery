import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import LotteryWheel from '../components/LotteryWheel.vue'
import Result from '../components/Result.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/lottery', component: LotteryWheel },
  { path: '/result', component: Result }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router