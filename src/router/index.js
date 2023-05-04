import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'
import { validateRouteNotAuthentication } from '../utils/request'
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => { //from中包含跳转前的路由信息，to包含跳转到的目的路由信息
  console.log(from.path)
  console.log(to.path)
  if(validateRouteNotAuthentication(to.path))
    return true
  
  // 路由拦截中如果Token是被顶号了(后台失效掉)，存在浏览器中的Token由于还未到期，所以拦截不到Token失效，除非向服务器发送一次请求
  var valid=await store.dispatch('validateToken', store.getters['accessToken'])
  if (!valid) {
    confirmMessageBox()
    return false
  }

  const now = new Date().getTime()
  if (store.getters['expiryTime'] <= now) {
    return store.dispatch('refreshToken', { accessToken: store.getters['accessToken'], refreshToken: store.getters['refreshToken'] })
      .then(() => {
        console.log('refreshToken 成功')
        return true
      })
      .catch(() => {
        console.log('refreshToken 失败')

        confirmMessageBox()
        return false
      })
  }
  return true;//返回true表示允许跳转，返回false则不会跳转
})

const confirmMessageBox = () => {
  ElMessageBox.confirm('登录已失效，是否返回登录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('login')
  }).catch(() => {
    ElMessage.info({
      message: '已取消'
    })
  })
}
export default router
