<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <span class="text-large font-600 mr-3"> 上传你的视频 </span>
    </template>

    <div class="upload-container">
      <el-form :model="form" label-width="120px" style="max-width: 600px">
        <el-form-item label="视频标题">
          <el-input v-model="form.title" placeholder="给你的视频起一个吸引人的标题吧"></el-input>
        </el-form-item>
        <el-form-item label="视频简介">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="简单介绍一下你的视频内容"></el-input>
        </el-form-item>

        <el-form-item label="选择视频文件">
          <el-button type="primary" @click="chooseVideoFile">选择文件</el-button>
          <span v-if="videoFile" class="file-name">{{ videoFile.name }}</span>
          <input type="file" ref="videoInputRef" @change="handleVideoFileChange" accept="video/*" style="display: none;" />
        </el-form-item>

        <el-form-item label="选择封面(可选)">
          <el-button @click="chooseCoverFile">选择图片</el-button>
          <span v-if="coverFile" class="file-name">{{ coverFile.name }}</span>
          <input type="file" ref="coverInputRef" @change="handleCoverFileChange" accept="image/*" style="display: none;" />
        </el-form-item>

        <el-form-item v-if="isSubmitting">
            <el-progress 
              :percentage="uploadPercent" 
              :stroke-width="10" 
              striped 
              striped-flow
            />
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="handleSubmit" :loading="isSubmitting" :icon="statusIcon">
            {{ statusText }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-page-header>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { uploadVideo } from '../api/video';
import { ElMessage } from 'element-plus';
import { UploadFilled, CircleCheck } from '@element-plus/icons-vue';

const router = useRouter();
const form = reactive({ title: '', description: '' });

const videoFile = ref(null);
const coverFile = ref(null);
const isSubmitting = ref(false);
const uploadPercent = ref(0);
const uploadSuccess = ref(false); 

const videoInputRef = ref(null);
const coverInputRef = ref(null);

const chooseVideoFile = () => {
  videoInputRef.value.click();
};
const chooseCoverFile = () => {
  coverInputRef.value.click();
};
// ------------------------------------

const statusText = computed(() => {
  if (uploadSuccess.value) return '上传成功!';
  if (isSubmitting.value) {
    if (uploadPercent.value < 100) {
      return `上传中 ${uploadPercent.value}%`;
    }
    return '云端处理中...';
  }
  return '确认上传';
});

const statusIcon = computed(() => {
  return uploadSuccess.value ? CircleCheck : UploadFilled;
});

const handleVideoFileChange = (event) => {
  videoFile.value = event.target.files[0];
};
const handleCoverFileChange = (event) => {
  coverFile.value = event.target.files[0];
};

const goBack = () => router.go(-1);

const handleSubmit = async () => {
  if (!form.title.trim()) {
    ElMessage.warning('请输入视频标题');
    return;
  }
  if (!videoFile.value) {
    ElMessage.warning('请选择一个视频文件');
    return;
  }

  isSubmitting.value = true;
  uploadSuccess.value = false;
  uploadPercent.value = 0;

  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('description', form.description);
  formData.append('file', videoFile.value);
  if (coverFile.value) {
    formData.append('cover', coverFile.value);
  }

  try {
    const newVideo = await uploadVideo(formData, (progressEvent) => {
      uploadPercent.value = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
    });

    uploadSuccess.value = true;
    isSubmitting.value = false; // 停止按钮的 loading 状态
    ElMessage.success('上传成功！1.5秒后将自动跳转...');
    
    // 延迟 1.5 秒再跳转
    setTimeout(() => {
      router.push(`/video/${newVideo.id}`);
    }, 1500);

  } catch (error) {
    console.error("上传失败:", error);
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.page-header {
  max-width: 800px;
  margin: 20px auto;
}

:deep(.el-page-header__header) {
  outline: none;
}
.upload-container {
  padding: 40px 20px 20px 20px;
  background-color: #fff;
  border-radius: 8px;
}

.file-name {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px; /* 限制最大宽度 */
  vertical-align: middle;
}
</style>