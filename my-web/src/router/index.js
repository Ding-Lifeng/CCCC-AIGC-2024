import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Chat.vue'),
    name: 'Chat',
  },
  {
    path: '/HealthInfo',
    name: '',
    component: () => import('../views/HealthInfo.vue')
  },
  {
    path: '/Detail',
    name: '',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/Advice',
    name: '',
    component: () => import('../views/Advice.vue')
  },
]

// 防止连续点击多次路由报错
let routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
