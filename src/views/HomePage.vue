/**
 * 首页视图组件
 * 展示视频列表，支持不同排序方式和分页浏览
 */
<template>
  <div class="home-container">
    <!-- 排序选项区 -->
    <div class="sort-options">
      <el-radio-group v-model="sortBy">
        <el-radio-button label="latest">最新发布</el-radio-button>
        <el-radio-button label="views">最多播放</el-radio-button>
        <el-radio-button label="popularity">最受欢迎</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 加载状态 -->
    <el-skeleton :rows="10" animated v-if="isLoading" />

    <!-- 视频列表展示区 -->
    <div v-if="!isLoading && videoList.length > 0">
      <el-row :gutter="20">
        <el-col 
          v-for="video in videoList" 
          :key="video.id"
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <VideoCard :video="video" />
        </el-col>
      </el-row>

      <!-- 分页控件 -->
      <div class="pagination-container">
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

    <!-- 空状态显示 -->
    <el-empty 
      description="这里还没有任何视频" 
      v-if="!isLoading && videoList.length === 0" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getVideoList } from '../api/video'
import VideoCard from '../components/VideoCard.vue'
import { ElMessage } from 'element-plus'

/**
 * 组件状态定义
 */
// 加载状态
const isLoading = ref(true)
// 视频列表数据
const videoList = ref([])
// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(12)
const totalVideos = ref(0)
// 当前排序方式
const sortBy = ref('latest')

/**
 * 获取视频列表数据
 * 根据当前的页码和排序方式获取对应的视频列表
 */
const fetchVideos = async () => {
  isLoading.value = true
  
  try {
    const params = { 
      page: currentPage.value, 
      size: pageSize.value, 
      sortBy: sortBy.value 
    }
    
    const data = await getVideoList(params)
    videoList.value = data.list
    totalVideos.value = data.total
  } catch (error) {
    console.error("首页获取视频列表失败:", error)
    ElMessage.error("加载视频列表失败，请稍后重试")
  } finally {
    isLoading.value = false
  }
}

/**
 * 处理页码变化
 * @param {number} newPage - 新的页码
 */
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  // 滚动到页面顶部，提升用户体验
  window.scrollTo(0, 0)
  // 重新获取数据
  fetchVideos()
}

/**
 * 监听排序方式变化
 * 当排序方式改变时，重置页码并重新获取数据
 */
watch(sortBy, (newSortBy, oldSortBy) => {
  if (newSortBy !== oldSortBy) {
    currentPage.value = 1 // 重置为第一页
    fetchVideos()
  }
})

/**
 * 组件挂载时初始化数据
 */
onMounted(() => {
  fetchVideos()
})
</script>

<style scoped>
/* 首页容器样式 */
.home-container {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 10px;
}

/* 排序选项区样式 */
.sort-options {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

/* 栅格布局调整 */
.el-row {
  margin-left: -10px;
  margin-right: -10px;
}

.el-col {
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 20px;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>