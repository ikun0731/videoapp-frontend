/**
 * 应用根组件
 * 定义了应用的基本结构和全局样式，处理用户身份验证恢复
 */
<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
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
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--theme-color-bg);
  color: var(--theme-color-text);
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

/**
 * App 容器样式
 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  flex-grow: 1;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
}
</style>