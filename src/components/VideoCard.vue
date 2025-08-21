/**
 * 视频卡片组件
 * 用于在首页、搜索结果等页面展示视频预览信息
 */
<template>
  <el-card 
    :body-style="{ padding: '0px' }" 
    shadow="hover" 
    class="video-card" 
    @click="navigateToDetail"
  >
    <!-- 视频封面容器 -->
    <div class="cover-container">
      <img :src="fullCoverUrl" class="cover-image" alt="视频封面" />
      
      <!-- 视频统计信息覆盖层 -->
      <div class="cover-overlay-stats">
        <span class="stat-item">
          <el-icon><View /></el-icon>
          <span>{{ formatViewCount(video.viewCount) }}</span>
        </span>
        <span class="stat-item">
          <span>🐟</span>
          <span>{{ video.fishCount || 0 }}</span>
        </span>
      </div>
    </div>
    
    <!-- 视频信息区域 -->
    <div class="info-container">
      <h3 class="title">{{ video.title }}</h3>
      <p class="description">{{ video.description }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { View } from '@element-plus/icons-vue'
import placeholderImage from '../assets/placeholder.png'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 视频对象
   * @type {Object}
   * @property {string} id - 视频ID
   * @property {string} title - 视频标题
   * @property {string} description - 视频描述
   * @property {string} [coverUrl] - 视频封面URL
   * @property {number} [viewCount] - 播放次数
   * @property {number} [fishCount] - 获得的鱼数量
   */
  video: {
    type: Object,
    required: true
  }
})

const router = useRouter()

/**
 * 完整的封面URL
 * 如果视频没有封面，则使用默认占位图
 */
const fullCoverUrl = computed(() => {
  return props.video?.coverUrl || placeholderImage
})

/**
 * 格式化播放次数，对大数值进行单位转换
 * @param {number} count - 原始播放次数
 * @returns {string|number} - 格式化后的播放次数
 */
const formatViewCount = (count) => {
  if (!count) return 0
  if (count > 100000000) {
    return (count / 100000000).toFixed(1) + '亿'
  }
  if (count > 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

/**
 * 跳转到视频详情页
 */
const navigateToDetail = () => {
  router.push(`/video/${props.video.id}`)
}
</script>

<style scoped>
/* 卡片基础样式 */
.video-card {
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid var(--theme-color-border); 
  transition: all 0.2s ease-in-out;
}

/* 卡片悬停效果 */
.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--theme-color-primary);
}

/* 封面容器，保持16:9的宽高比 */
.cover-container {
  width: 100%;
  padding-top: 56.25%; /* 16:9的宽高比 */
  position: relative;
  overflow: hidden;
}

/* 封面上的统计信息覆盖层 */
.cover-overlay-stats {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 4px 8px;
  background-image: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
}

/* 统计项样式 */
.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item span:first-child {
  font-size: 14px;
  line-height: 1;
}

/* 封面图片样式 */
.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

/* 信息容器 */
.info-container {
  padding: 14px;
}

/* 视频标题样式 */
.title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--theme-color-text);
}

/* 视频描述样式，限制为2行 */
.description {
  font-size: 13px;
  color: #909399;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 36px;
}
</style>