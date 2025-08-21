// src/views/UserPage.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 用户主页 </span>
    </template>
    
    <div class="user-page-container" v-if="!isLoading && userData">
      <div class="user-header">
        <el-avatar :size="100" :src="fullAvatarUrl" />
        <div class="user-info">
          <h1>{{ userData.nickname }}</h1>
          <p>@{{ userData.username }}</p>
        </div>
      </div>
      
      <el-divider />

      <h2>TA的视频</h2>
      <div v-if="userVideos.length > 0" class="video-list">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="video in userVideos" :key="video.id">
            <VideoCard :video="video" />
          </el-col>
        </el-row>
        <div class="pagination-container" v-if="totalVideos > pageSize">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalVideos"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <el-empty v-else description="这位用户还没有上传过任何视频"></el-empty>
    </div>

    <el-skeleton :rows="5" animated v-else-if="isLoading" />
    <el-empty v-else description="找不到该用户或加载失败"></el-empty>

  </el-page-header>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserProfile, getUserVideos } from '../api/user';
import VideoCard from '../components/VideoCard.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const userData = ref(null);
const userVideos = ref([]);
const currentPage = ref(1);
const pageSize = ref(12);
const totalVideos = ref(0);


const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';

const fullAvatarUrl = computed(() => {
  const avatar = userData.value?.avatarUrl;
  return avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});

const goBack = () => router.go(-1);

const fetchUserData = async (username) => {
  if (!username || username === 'undefined') {
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  userData.value = null;
  
  try {
    const profile = await getUserProfile(username);
    userData.value = profile;
    if (profile.id) {
      await fetchUserVideos(profile.id);
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "加载用户信息失败");
  } finally {
    isLoading.value = false;
  }
};

const fetchUserVideos = async (userId) => {
  try {
    const params = { page: currentPage.value, size: pageSize.value };
    const videoData = await getUserVideos(userId, params);
    userVideos.value = videoData.list;
    totalVideos.value = videoData.total;
  } catch (error) {
    ElMessage.error("加载用户视频失败");
    userVideos.value = [];
    totalVideos.value = 0;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  window.scrollTo(0, 0);
  if (userData.value?.id) {
    fetchUserVideos(userData.value.id);
  }
};

watch(() => route.params.username, (newUsername) => {
  currentPage.value = 1;
  fetchUserData(newUsername);
}, { immediate: true });
</script>

<style scoped>
.page-header { max-width: 1400px; margin: 20px auto; }
.user-page-container { padding-top: 20px; padding-left:10px; padding-right:10px;}
.user-header { display: flex; align-items: center; margin-bottom: 20px; }
.user-info { margin-left: 20px; }
.user-info h1 { margin: 0; font-size: 24px; }
.user-info p { margin: 5px 0 0; color: #909399; }
.video-list { margin-top: 20px; }
.el-col { margin-bottom: 20px; }
.pagination-container { display: flex; justify-content: center; margin-top: 40px; }
</style>