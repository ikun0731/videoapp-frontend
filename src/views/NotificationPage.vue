// src/views/NotificationPage.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 通知中心 </span>
    </template>
  </el-page-header>
  
  <div class="notification-page-container">
    <NotificationDropdown :is-page-mode="true" /> 
  </div>
</template>

<script setup>
import NotificationDropdown from '../components/NotificationDropdown.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.page-header {
  max-width: 800px;
  margin: 0 auto 20px auto;
}
.notification-page-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden; /* 让内部的列表也继承圆角效果 */
}
</style>