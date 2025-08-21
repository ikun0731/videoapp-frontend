/**
 * 应用根组件
 * 定义了应用的基本结构和全局样式，处理用户身份验证恢复
 */
<template>
  <el-container class="app-container">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 主内容区域 -->
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { useUserStore } from './store/user'
import { getMyInfo } from './api/user'

const userStore = useUserStore()

/**
 * 组件挂载时，如果用户已登录（有token）
 * 则从服务器获取最新的用户信息
 * 如果获取失败，则登出用户
 */
onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const userInfo = await getMyInfo()
      userStore.setUser(userInfo)
    } catch (error) {
      console.error("刷新时获取用户信息失败:", error)
      userStore.logout() // 出错时登出用户，清除无效token
    }
  }
})
</script>

<style>
/**
 * 全局样式
 */
:root {
  /* 定义主题变量，便于统一修改 */
  --theme-color-primary: #409EFF;
  --theme-color-border: #EBEEF5;
  --theme-color-text: #303133;
  --theme-color-bg: #f4f5f7;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--theme-color-bg);
  color: var(--theme-color-text);
}

/**
 * App 容器样式
 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container .el-header {
  flex-shrink: 0;
  z-index: 100;
}

.app-container .el-main {
  flex-grow: 1;
  padding: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-container .el-main {
    padding: 15px 10px;
  }
}
</style>