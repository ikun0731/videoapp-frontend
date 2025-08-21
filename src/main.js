/**
 * 应用入口文件
 * 负责初始化Vue应用、配置插件和挂载应用
 */

// 导入Vue核心模块
import { createApp } from 'vue'
import App from './App.vue'

// 导入路由和状态管理
import router from './router'
import { createPinia } from 'pinia'

// 导入UI组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入全局样式（如果有）
// import './style.css'

// 创建应用实例和状态管理实例
const app = createApp(App)
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 挂载应用到DOM
app.mount('#app')