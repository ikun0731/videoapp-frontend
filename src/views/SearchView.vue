// src/views/SearchView.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 搜索结果: “{{ currentKeyword }}” </span>
    </template>
    
    <div class="search-result-container">
      <el-skeleton :rows="5" animated v-if="isLoading" />

      <div v-if="!isLoading">
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="`视频 (${videoTotal})`" name="videos">
            <div class="sort-options">
              <el-radio-group v-model="videoSortBy">
                <el-radio-button label="latest">相关度/最新</el-radio-button>
                <el-radio-button label="views">最多播放</el-radio-button>
                <el-radio-button label="popularity">最受欢迎</el-radio-button>
              </el-radio-group>
            </div>
            <div v-if="videoList.length > 0">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="video in videoList" :key="video.id">
                  <VideoCard :video="video" />
                </el-col>
              </el-row>
              <div class="pagination-container" v-if="videoTotal > videoPageSize">
                <el-pagination background layout="prev, pager, next" :total="videoTotal"
                  :page-size="videoPageSize" v-model:current-page="videoCurrentPage"
                  @current-change="handleVideoPageChange" />
              </div>
            </div>
            <el-empty v-else description="抱歉，没有找到相关的视频"></el-empty>
          </el-tab-pane>

          <el-tab-pane :label="`用户 (${userTotal})`" name="users">
            <div v-if="userList.length > 0">
              <div class="user-list-container">
                <router-link :to="`/user/${user.username}`" class="user-link" v-for="user in userList" :key="user.id">
                  <div class="user-card">
                    <el-avatar :size="50" :src="fullAvatarUrl(user.avatarUrl)" />
                    <div class="user-info">
                      <span class="nickname">{{ user.nickname }}</span>
                      <span class="username">@{{ user.username }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="pagination-container" v-if="userTotal > userPageSize">
                <el-pagination background layout="prev, pager, next" :total="userTotal"
                  :page-size="userPageSize" v-model:current-page="userCurrentPage"
                  @current-change="handleUserPageChange" />
              </div>
            </div>
            <el-empty v-else description="抱歉，没有找到相关的用户"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-page-header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchVideos } from '../api/video';
import { searchUsers } from '../api/user';
import VideoCard from '../components/VideoCard.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const currentKeyword = ref(route.query.q || '');
const activeTab = ref('videos');
const videoList = ref([]);
const videoTotal = ref(0);
const videoCurrentPage = ref(1);
const videoPageSize = ref(12);
const videoSortBy = ref('latest');
const userList = ref([]);
const userTotal = ref(0);
const userCurrentPage = ref(1);
const userPageSize = ref(10);

// 【核心修正】在这里补上 baseURL 的定义
const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';

const performSearch = async (searchType = 'all') => {
  const keyword = route.query.q;
  if (!keyword) { 
    isLoading.value = false;
    // 清空旧数据
    videoList.value = [];
    userList.value = [];
    videoTotal.value = 0;
    userTotal.value = 0;
    return; 
  }

  if (searchType === 'all') {
    isLoading.value = true;
    currentKeyword.value = keyword;
  }

  try {
    if (searchType === 'all' || searchType === 'videos') {
      const videoParams = { keyword, page: videoCurrentPage.value, size: videoPageSize.value, sortBy: videoSortBy.value };
      const videoResult = await searchVideos(videoParams);
      videoList.value = videoResult.list;
      videoTotal.value = videoResult.total;
    }
    if (searchType === 'all' || searchType === 'users') {
      const userParams = { keyword, page: userCurrentPage.value, size: userPageSize.value };
      const userResult = await searchUsers(userParams);
      userList.value = userResult.list;
      userTotal.value = userResult.total;
    }
  } catch (error) {
    console.error("搜索失败:", error);
    ElMessage.error("搜索失败，请稍后重试");
  } finally {
    if (searchType === 'all') {
      isLoading.value = false;
    }
  }
};

const handleVideoPageChange = (newPage) => {
  videoCurrentPage.value = newPage;
  window.scrollTo(0, 0);
  performSearch('videos');
};

const handleUserPageChange = (newPage) => {
  userCurrentPage.value = newPage;
  window.scrollTo(0, 0);
  performSearch('users');
};

const goBack = () => router.go(-1);

const fullAvatarUrl = (avatarUrl) => {
  return avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
};

watch(videoSortBy, (newSortBy, oldSortBy) => {
  if (newSortBy !== oldSortBy) {
    videoCurrentPage.value = 1;
    performSearch('videos');
  }
});

watch(() => route.query.q, (newKeyword) => {
  if (newKeyword !== undefined) { // 监听query变化，包括空字符串
    videoCurrentPage.value = 1;
    userCurrentPage.value = 1;
    performSearch('all');
  }
}, { immediate: true });
</script>

<style scoped>
.page-header { max-width: 1400px; margin: 20px auto; }
.search-result-container { padding-top: 20px; padding-left:10px; padding-right:10px; }
.sort-options { margin-bottom: 20px; }
.el-col { margin-bottom: 20px; }
.user-list-container { display: flex; flex-direction: column; gap: 5px; }
.user-link { text-decoration: none; color: inherit; border-radius: 4px; transition: background-color 0.2s; }
.user-link:hover { background-color: #f5f7fa; }
.user-card { display: flex; align-items: center; padding: 10px; }
.user-info { margin-left: 15px; display: flex; flex-direction: column; }
.user-info .nickname { font-size: 16px; font-weight: 500; }
.user-info .username { font-size: 14px; color: #909399; }
.pagination-container { display: flex; justify-content: center; margin-top: 40px; }
</style>