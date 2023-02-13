import { getToken } from '@/utils/token'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => import('@/views/index/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '主页'
        }
      }, {
        path: 'albumAdmin/albumList',
        name: 'albumList',
        component: () => import('@/views/albumList/index.vue'),
        meta: {
          title: '文件管理'
        }
      }, {
        path: 'userAdmin/updatePsw',
        name: 'updataPsw',
        component: () => import('@/views/updatePsw/index.vue'),
        meta: {
          title: '密码修改'
        }
      }]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const token = getToken()
  if (token === null && to.name !== 'login') {
    next({ name: 'login' })
  } else if (token !== null && to.name === 'login') {
    next({ name: from.name })
  } else {
    next()
  }
})
export default router
