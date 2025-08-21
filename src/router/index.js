/**
 * 路由配置文件
 * 定义应用的所有路由及相关守卫
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

/**
 * 需要登录才能访问的路由的通用前置守卫
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 * @param {Function} next - 路由解析函数
 */
const requireAuth = (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
}

/**
 * 路由配置数组
 */
const routes = [
  // 公开路由 - 不需要登录即可访问
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('../views/HomePage.vue'),
    meta: { title: '首页' }
  },
  { 
    path: '/search', 
    name: 'Search', 
    component: () => import('../views/SearchView.vue'),
    meta: { title: '搜索结果' }
  },
  { 
    path: '/video/:id', 
    name: 'VideoDetail', 
    component: () => import('../views/VideoDetailPage.vue'),
    meta: { title: '视频详情' }
  },
  { 
    path: '/user/:username', 
    name: 'UserPage', 
    component: () => import('../views/UserPage.vue'),
    meta: { title: '用户主页' }
  },
  
  // 受保护路由 - 需要登录才能访问
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/UploadPage.vue'),
    beforeEnter: requireAuth,
    meta: { title: '上传视频', requiresAuth: true }
  },
  {
    path: '/profile', 
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    beforeEnter: requireAuth,
    meta: { title: '个人资料', requiresAuth: true }
  },
  {
    path: '/video/:id/edit',
    name: 'VideoEdit',
    component: () => import('../views/VideoEditPage.vue'),
    beforeEnter: requireAuth,
    meta: { title: '编辑视频', requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/NotificationPage.vue'),
    beforeEnter: requireAuth,
    meta: { title: '通知中心', requiresAuth: true }
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局前置守卫 - 可用于设置页面标题
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 渔鱼网`
  }
  next()
})

export default router