// src/views/VideoEditPage.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 编辑视频信息 </span>
    </template>

    <div class="edit-container" v-if="!isLoading">
      <el-form :model="form" label-width="120px" style="max-width: 600px">
        <el-form-item label="视频标题">
          <el-input v-model="form.title" placeholder="给你的视频起一个吸引人的标题吧"></el-input>
        </el-form-item>
        <el-form-item label="视频简介">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="简单介绍一下你的视频内容"></el-input>
        </el-form-item>
        
        <el-form-item label="当前封面">
          <img :src="currentCoverUrl" class="current-cover" v-if="currentCoverUrl" />
        </el-form-item>
        
        <el-form-item label="更换封面(可选)">
          <el-upload
            v-model:file-list="newCoverFileList"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :on-change="handleCoverChange"
          >
            <template #trigger>
              <el-button>选择新图片</el-button>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdate" :loading="isSubmitting">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-skeleton :rows="5" animated v-if="isLoading" />
  </el-page-header>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getVideoDetail, updateVideo } from '../api/video';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const videoId = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const currentCoverUrl = ref('');
// 【新增】定义 baseURL
const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';
const form = reactive({
  title: '',
  description: '',
});
const newCoverFileList = ref([]);

const goBack = () => router.go(-1);

const handleCoverChange = (file) => {
  // el-upload v-model 会自动处理文件列表，我们只需要确保列表长度为1
  if (newCoverFileList.value.length > 1) {
    newCoverFileList.value.shift();
  }
};

const handleUpdate = async () => {
  if (!videoId.value) return;

  isSubmitting.value = true;
  const formData = new FormData();

  // 只有当字段不为空时才添加到 FormData，以支持PATCH部分更新
  if (form.title) formData.append('title', form.title);
  if (form.description) formData.append('description', form.description);
  
  if (newCoverFileList.value.length > 0) {
    formData.append('cover', newCoverFileList.value[0].raw);
  }

  try {
    await updateVideo(videoId.value, formData);
    ElMessage.success('视频信息更新成功！');
    router.push(`/video/${videoId.value}`); // 更新成功后，返回详情页
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '更新失败');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  const id = route.params.id;
  videoId.value = id;
  try {
    const data = await getVideoDetail(id);
    form.title = data.title;
    form.description = data.description;

    // 【核心修正】应用我们新的、更健壮的 URL 处理逻辑
    if (data.coverUrl) {
      if (data.coverUrl.startsWith('http')) {
        currentCoverUrl.value = data.coverUrl;
      } else {
        currentCoverUrl.value = `${baseURL}${data.coverUrl}`;
      }
    }
    
  } catch (error) {
    ElMessage.error('加载视频信息失败');
    router.push('/');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.page-header { max-width: 800px; margin: 20px auto; }
.edit-container { padding: 40px 20px 20px 20px; background-color: #fff; border-radius: 8px; }
.current-cover { width: 320px; height: 180px; object-fit: cover; border-radius: 4px; }
</style>