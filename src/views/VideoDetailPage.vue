// src/views/VideoDetailPage.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 视频详情 </span>
    </template>

    <div class="detail-container">
      <div v-if="videoData" class="video-layout">
        <div class="video-player-section">
          <video :src="fullVideoUrl" controls autoplay class="video-player"></video>
          <h1 class="video-title">{{ videoData.title }}</h1>
          <div class="meta-info">
            <div class="uploader-info">
              <router-link :to="`/user/${videoData.uploader.username}`" class="uploader-link" v-if="videoData.uploader">
                <el-avatar :size="40" :src="fullUploaderAvatarUrl" />
                <span>{{ videoData.uploader.nickname }}</span>
              </router-link>
              <span v-else>由 匿名用户 上传</span>
            </div>
            <div class="video-stats">
              <span>发布于 {{ new Date(videoData.createdAt).toLocaleDateString() }}</span>
              <span>{{ formatViewCount(videoData.viewCount) }} 播放</span>
              <span>🐟 {{ videoData.fishCount }}</span>
            </div>
          </div>
          <div class="actions-bar">
            <el-button 
              type="primary"
              size="large"
              :icon="Star"
              @click="handleFeedFish"
              :disabled="videoData.isFishFed || !userStore.isLoggedIn"
            >
              {{ videoData.isFishFed ? '已投喂' : '喂鱼支持' }}
            </el-button>
            <el-button
              v-if="isOwner"
              type="default"
              size="large"
              :icon="Edit"
              @click="goToEditPage"
            >
              编辑视频
            </el-button>
          </div>
          <p class="video-description">{{ videoData.description }}</p>
        </div>
        <div class="comment-section-wrapper">
          <CommentSection v-if="videoId" :video-id="videoId" />
        </div>
      </div>
      <el-skeleton :rows="5" animated v-else />
    </div>
  </el-page-header>
</template>

// views/VideoDetailPage.vue
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { getVideoDetail, feedFishToVideo } from '../api/video';
import CommentSection from '../components/CommentSection.vue';
import { ElMessage } from 'element-plus';
import { Star, Edit } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const videoData = ref(null);
const videoId = computed(() => route.params.id);

const fetchVideoData = async (id) => {
  if (!id) return;
  try {
    videoData.value = null;
    const data = await getVideoDetail(id);
    videoData.value = data;
  } catch (error) { console.error("获取视频详情失败:", error); }
};

watch(videoId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchVideoData(newId);
    window.scrollTo(0, 0);
  }
}, { immediate: true }); 

const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';
const isOwner = computed(() => userStore.isLoggedIn && videoData.value?.uploader?.username === userStore.userInfo.username);
const fullVideoUrl = computed(() => {
    return videoData.value?.videoUrl || '';
});

const fullUploaderAvatarUrl = computed(() => {
    const url = videoData.value?.uploader?.avatarUrl;
    return url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});
const formatViewCount = (count) => { if (!count) return 0; if (count > 10000) return (count / 10000).toFixed(1) + '万'; return count; };
const goBack = () => router.go(-1);
const goToEditPage = () => router.push(`/video/${videoId.value}/edit`);
const handleFeedFish = async () => {
  try {
    await feedFishToVideo(videoId.value);
    ElMessage.success('投喂成功！感谢您的支持');
    if (videoData.value) {
      videoData.value.isFishFed = true;
      videoData.value.fishCount++;
    }
    userStore.decrementFishBalance(1);
  } catch (error) { console.error("喂鱼失败:", error); }
};
</script>

<style scoped>
.page-header { max-width: 1200px; margin: 20px auto; padding: 0 10px; }
.detail-container { padding-top: 20px; }
.video-layout { display: flex; gap: 40px; }
.video-player-section { flex: 3; min-width: 0; }
.comment-section-wrapper { flex: 1; min-width: 300px; }
.video-player { width: 100%; border-radius: 8px; background-color: #000; }
.video-title { margin-top: 16px; font-size: 24px; color: var(--theme-color-text); }
.meta-info { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #909399; font-size: 14px; flex-wrap: wrap; gap: 10px;}
.uploader-info { display: flex; align-items: center; gap: 10px; }
.uploader-link { text-decoration: none; color: inherit; display: flex; align-items: center; gap: 10px; font-weight: 500;}
.uploader-link:hover { color: var(--theme-color-primary); }
.video-stats { display: flex; align-items: center; gap: 20px; }
.actions-bar { margin: 20px 0; border-top: 1px solid var(--theme-color-border); border-bottom: 1px solid var(--theme-color-border); padding: 15px 0; display: flex; gap: 10px; }
.video-description { color: #606266; line-height: 1.8; white-space: pre-wrap; margin-top: 20px; }

@media (max-width: 992px) {
  .video-layout {
    flex-direction: column;
    gap: 20px;
  }
  .comment-section-wrapper {
    min-width: unset;
  }
}
</style>