import router from './router'
import { getAccessToken } from '@/utils/auth'

router.beforeEach((to, from, next) => {
  if (getAccessToken()) { // 如果有token
    if (to.path === '/login') {
      next({ path: '/' }) // 如果是去登录页，重定向到首页
    } else {
      next()  // 正常跳转
    }
  } else { // 没有token
    if (to.path === '/rbac/user/change-info' || to.path === '/rbac/user/plan-history') {  // 无Token访问用户信息，重定向登录
      next('/login')
    }
    else{
      next()  // 正常跳转
    }
  }
})

router.afterEach(() => {
  // 这里可以添加一些在路由跳转后需要执行的代码
})
