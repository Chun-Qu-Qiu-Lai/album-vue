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
          title: '仪表盘'
        }
      }, {
        path: 'albumAdmin/albumList',
        name: 'albumList',
        component: () => import('@/views/albumList/index.vue'),
        meta: {
          title: '相册列表'
        }
      }, {
        path: 'albumAdmin/depot',
        name: 'depot',
        component: () => import('@/views/depot/index.vue'),
        meta: {
          title: '我的图库'
        }
      }, {
        path: 'albumAdmin/apiuse',
        name: 'apiuse',
        component: () => import('@/views/apiuse/index.vue'),
        meta: {
          title: '接口使用'
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
  document.title = to.meta.title ? to.meta.title : '管理平台'
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
