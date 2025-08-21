// src/views/ProfilePage.vue
<template>
  <el-page-header @back="goBack" class="page-header">
    <template #content>
      <div class="header-content">
        <span class="text-large font-600 mr-3"> 我的主页 </span>
        <el-button type="primary" link @click="viewPublicProfile">
          查看我的公开主页 <el-icon class="el-icon--right"><View /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="profile-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本资料" name="info">
          <el-row :gutter="40">
            <el-col :xs="24" :sm="24" :md="12">
              <el-form label-width="100px" style="max-width: 400px">
                <el-form-item label="用户名">
                  <el-input :value="userStore.userInfo.username" disabled />
                </el-form-item>
                <el-form-item label="昵称">
                  <el-input v-model="profileForm.nickname" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="profileForm.email" :disabled="true" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleUpdateProfile">保存修改</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form label-width="100px">
                <el-form-item label="我的头像">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="handleUploadAvatar"
                    :before-upload="beforeAvatarUpload"
                    accept="image/jpeg,image/png,image/gif"
                  >
                    <el-avatar :size="120" :src="fullAvatarUrl" />
                  </el-upload>
                  <div class="el-upload__tip">点击头像更换，仅支持 JPG/PNG/GIF 格式。</div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <el-tab-pane label="我的视频" name="videos">
          <div v-if="myVideos.length > 0" class="video-list">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" v-for="video in myVideos" :key="video.id" class="video-col">
                <VideoCard :video="video" />
                <el-button
                  class="delete-button"
                  type="danger"
                  :icon="Delete"
                  circle
                  @click="handleDeleteVideo(video.id)"
                />
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
          <el-empty v-else description="你还没有上传过任何视频"></el-empty>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="security">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
            style="max-width: 400px"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword(passwordFormRef)">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-page-header>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import { updateMyInfo, getUserVideos, updateUserAvatar, changeUserPassword } from '../api/user';
import { deleteVideo as deleteVideoApi } from '../api/video';
import VideoCard from '../components/VideoCard.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, View } from '@element-plus/icons-vue';

const userStore = useUserStore();
const router = useRouter();

const activeTab = ref('info');

const profileForm = reactive({
  nickname: '',
  email: '',
});

const passwordFormRef = ref(null);
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const myVideos = ref([]);
const currentPage = ref(1);
const pageSize = ref(9);
const totalVideos = ref(0);

const goBack = () => {
  router.go(-1);
};

const viewPublicProfile = () => {
  if (userStore.userInfo.username) {
    router.push(`/user/${userStore.userInfo.username}`);
  }
};

const handleUpdateProfile = async () => {
  try {
    const updatedUser = await updateMyInfo(profileForm);
    userStore.setUser(updatedUser);
    ElMessage.success('个人资料更新成功！');
  } catch (error) { console.error("更新个人资料失败:", error); }
};
const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';

const fullAvatarUrl = computed(() => {
  const avatar = userStore.userInfo?.avatarUrl;
  return avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});
const beforeAvatarUpload = (rawFile) => {
    const isAllowedType = ['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type);
    const isLt2M = rawFile.size / 1024 / 1024 < 2;
    if (!isAllowedType) { ElMessage.error('头像图片只支持 JPG/PNG/GIF 格式!'); }
    if (!isLt2M) { ElMessage.error('头像图片大小不能超过 2MB!'); }
    return isAllowedType && isLt2M;
};

const handleUploadAvatar = async (options) => {
    const formData = new FormData();
    formData.append('avatar', options.file);
    try {
        const newAvatarUrl = await updateUserAvatar(formData);
        const updatedUserInfo = { ...userStore.userInfo, avatarUrl: newAvatarUrl };
        userStore.setUser(updatedUserInfo);
        ElMessage.success('头像更新成功!');
    } catch (error) { console.error("更新头像失败:", error); }
};

const fetchMyVideos = async () => {
  if (!userStore.userInfo.id) return;
  try {
    const params = { page: currentPage.value, size: pageSize.value };
    const data = await getUserVideos(userStore.userInfo.id, params);
    myVideos.value = data.list;
    totalVideos.value = data.total;
  } catch (error) { console.error("加载我的视频列表失败:", error); }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  window.scrollTo(0, 0);
  fetchMyVideos();
};

const handleDeleteVideo = async (videoId) => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该视频。是否继续？','警告', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
      });
    await deleteVideoApi(videoId);
    ElMessage.success('视频已成功删除');
    if (myVideos.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }
    await fetchMyVideos();
  } catch (error) {
    if (error !== 'cancel') { console.error("删除视频失败:", error); }
  }
};

const validatePass = (rule, value, callback) => {
  if (value === '') { callback(new Error('请输入新密码')); }
  else if (value.length < 6) { callback(new Error('密码长度不能小于6位')); }
  else {
    if (passwordForm.confirmPassword !== '') {
      if (!passwordFormRef.value) return;
      passwordFormRef.value.validateField('confirmPassword');
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === '') { callback(new Error('请再次输入新密码')); }
  else if (value !== passwordForm.newPassword) { callback(new Error("两次输入的新密码不一致!")); }
  else { callback(); }
};

const passwordRules = reactive({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
});

const handleChangePassword = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        await changeUserPassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        });
        ElMessage.success('密码修改成功！');
        formEl.resetFields();
      } catch (error) { console.error("修改密码失败:", error); }
    }
  });
};

onMounted(() => {
  if (userStore.userInfo) {
    profileForm.nickname = userStore.userInfo.nickname;
    profileForm.email = userStore.userInfo.email;
  }
  fetchMyVideos();
});
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.page-header {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 10px;
}
.profile-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.video-list { margin-top: 20px; }
.video-col { position: relative; margin-bottom: 20px; }
.delete-button { position: absolute; top: 8px; right: 20px; z-index: 10; }
.avatar-uploader .el-avatar { cursor: pointer; position: relative; overflow: hidden; transition: var(--el-transition-duration-fast); }
.avatar-uploader .el-avatar:hover { opacity: 0.8; }
.el-upload__tip { font-size: 12px; color: #909399; margin-top: 7px; }
.pagination-container { display: flex; justify-content: center; margin-top: 40px; }
/* 【新增】为 el-col 在 xs 屏幕下增加底部边距，避免堆叠时靠得太近 */
@media (max-width: 767px) {
  .el-col:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>