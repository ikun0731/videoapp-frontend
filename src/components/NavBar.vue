// src/components/NavBar.vue
<template>
  <el-header class="navbar">
    <div class="logo-container" @click="goToHome">
      渔鱼网
    </div>

    <div class="search-container hide-on-mobile">
      <el-input v-model="searchKeyword" placeholder="搜索感兴趣的视频..." @keyup.enter="handleSearch">
        <template #append><el-button :icon="Search" @click="handleSearch" /></template>
      </el-input>
    </div>
    
    <div class="menu-container hide-on-mobile">
      <div v-if="userStore.isLoggedIn" class="user-menu">
        <div class="notification-bell">
          <el-popover placement="bottom-end" :width="320" trigger="click" popper-class="notification-popper">
            <template #reference>
              <el-badge :value="notificationStore.unreadCount" :max="99" :hidden="notificationStore.unreadCount === 0">
                <el-icon :size="22" color="#303133"><Bell /></el-icon>
              </el-badge>
            </template>
            <template #default>
              <NotificationDropdown />
            </template>
          </el-popover>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="30" :src="fullAvatarUrl" />
            <div class="fish-balance">
              <span>🐟</span>
              <span>{{ userStore.userInfo.fishBalance || 0 }}</span>
            </div>
            <span class="nickname">{{ userStore.userInfo.nickname || '用户' }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleClaimDaily" :disabled="!userStore.userInfo.canClaimDaily">
                {{ userStore.userInfo.canClaimDaily ? '每日签到 (送10条鱼)' : '今日已签到' }}
              </el-dropdown-item>
              <el-dropdown-item @click="router.push('/profile')">我的主页</el-dropdown-item>
              <el-dropdown-item @click="router.push('/upload')">上传视频</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-else class="guest-menu">
        <el-button type="primary" plain @click="loginDialogVisible = true">登录</el-button>
        <el-button plain @click="registerDialogVisible = true">注册</el-button>
      </div>
    </div>

    <el-icon class="mobile-hamburger show-on-mobile" @click="isDrawerOpen = true" :size="24"><Menu /></el-icon>
  </el-header>

  <el-drawer v-model="isDrawerOpen" title="菜单" direction="rtl" size="80%" class="custom-drawer">
    <div class="drawer-content">
      <div class="drawer-search-container">
        <el-input v-model="searchKeyword" placeholder="搜索..." @keyup.enter="handleSearch">
          <template #append><el-button :icon="Search" @click="handleSearch" /></template>
        </el-input>
      </div>
      <div v-if="userStore.isLoggedIn" class="drawer-user-menu">
        <div class="drawer-user-card" @click="navigateTo(`/user/${userStore.userInfo.username}`)">
          <el-avatar :size="50" :src="fullAvatarUrl" />
          <div class="info-text">
            <span class="nickname">{{ userStore.userInfo.nickname || '用户' }}</span>
            <div class="fish-balance">
              <span>🐟 {{ userStore.userInfo.fishBalance || 0 }}</span>
            </div>
          </div>
        </div>
        <div class="drawer-menu-links">
          <div class="drawer-link-item" @click="navigateTo('/profile')">
            <el-icon><House /></el-icon>
            <span>我的主页</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="drawer-link-item" @click="navigateTo('/notifications')">
            <el-icon><MessageBox /></el-icon>
            <span>通知中心</span>
            <el-badge class="drawer-badge" :value="notificationStore.unreadCount" :max="99" :hidden="notificationStore.unreadCount === 0" />
          </div>
          <div class="drawer-link-item" @click="navigateTo('/upload')">
            <el-icon><Upload /></el-icon>
            <span>上传视频</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="drawer-link-item" @click="handleClaimDaily" :class="{ 'is-disabled': !userStore.userInfo.canClaimDaily }">
            <el-icon><Pointer /></el-icon>
            <span>{{ userStore.userInfo.canClaimDaily ? '每日签到' : '今日已签到' }}</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
        <el-button type="danger" plain @click="handleLogout" class="logout-button">退出登录</el-button>
      </div>
      <div v-else class="drawer-guest-menu">
        <el-button type="primary" @click="loginDialogVisible = true; isDrawerOpen = false">登录</el-button>
        <el-button @click="registerDialogVisible = true; isDrawerOpen = false">注册</el-button>
      </div>
    </div>
  </el-drawer>
  
  <el-dialog v-model="loginDialogVisible" title="登录" width="85%" :style="{ maxWidth: '400px' }">
    <el-form :model="loginForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">确认</el-button>
      </span>
    </template>
  </el-dialog>
  
  <el-dialog v-model="registerDialogVisible" title="注册" width="85%" :style="{ maxWidth: '400px' }">
  <el-form :model="registerForm" label-width="80px">
    <el-form-item label="用户名">
      <el-input v-model="registerForm.username"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="registerForm.email" placeholder="用于接收验证码">
        <template #append>
          <el-button 
            @click="handleSendCode" 
            :disabled="isCodeSending || countdown > 0"
          >
            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <el-input v-model="registerForm.verificationCode" placeholder="请输入6位验证码"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="registerForm.password" show-password></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="registerDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleRegister">确认注册</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../store/user';
import { useNotificationStore } from '../store/notification';
import { useRouter } from 'vue-router';
import { registerUser, loginUser, getMyInfo, claimDailyBonus, sendVerificationCode } from '../api/user';
import { ElMessage } from 'element-plus';
import NotificationDropdown from './NotificationDropdown.vue';
import { 
  Search, Menu, Bell, ArrowRight,
  House, Upload, MessageBox, Pointer
} from '@element-plus/icons-vue';

// --- 核心状态 ---
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

// --- 组件UI状态 ---
const isDrawerOpen = ref(false);
const searchKeyword = ref('');
const loginDialogVisible = ref(false);
const registerDialogVisible = ref(false);

// --- 表单数据 ---
const loginForm = reactive({ username: '', password: '' });
const registerForm = reactive({ username: '', email: '', password: '', verificationCode: '' });

// --- 验证码相关状态 ---
const isCodeSending = ref(false);
const countdown = ref(0);
let timer = null;

// --- 生命周期钩子 ---
onMounted(() => {
  if (userStore.isLoggedIn) {
    notificationStore.startPolling();
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  notificationStore.stopPolling();
});


// --- 计算属性 ---
const baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8081';
const fullAvatarUrl = computed(() => {
  const avatar = userStore.userInfo?.avatarUrl;
  return avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});


// --- 方法 / 事件处理器 ---
const handleLogin = async () => {
  try {
    const tokenData = await loginUser(loginForm);
    userStore.setToken(tokenData.token);
    loginDialogVisible.value = false;
    ElMessage.success('登录成功！');

    // 在后台继续获取用户数据和通知
    getMyInfo().then(userInfo => {
      userStore.setUser(userInfo);
    }).catch(err => console.error("登录后获取用户信息失败:", err));
    
    notificationStore.startPolling();
  } catch (error) {
    console.error("在 handleLogin 中捕获到错误:", error);
  }
};

const handleLogout = () => {
    isDrawerOpen.value = false;
    userStore.logout();
    notificationStore.clearNotifications();
    router.push('/');
    ElMessage.success('已退出登录');
};

const handleSendCode = async () => {
  if (!registerForm.email || !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(registerForm.email)) {
    ElMessage.warning('请输入有效的邮箱地址！');
    return;
  }
  isCodeSending.value = true;
  try {
    await sendVerificationCode({ email: registerForm.email });
    ElMessage.success('验证码已发送，请注意查收！');
    countdown.value = 60;
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  } catch (error) {
    console.error("发送验证码失败:", error);
  } finally {
    isCodeSending.value = false;
  }
};

const handleRegister = async () => {
    if (!registerForm.username || !registerForm.password || !registerForm.email || !registerForm.verificationCode) {
        ElMessage.warning('请填写所有注册信息！');
        return;
    }
    try {
        await registerUser(registerForm);
        registerDialogVisible.value = false;
        ElMessage.success('注册成功，请登录！');
    } catch (error) {
        console.error("注册失败:", error);
    }
};

// 【核心修正】恢复被我不小心删除的函数
const handleClaimDaily = async () => {
    if (!userStore.userInfo.canClaimDaily) { return ElMessage.info('您今天已经签到过了哦'); }
    try {
        await claimDailyBonus();
        ElMessage.success('签到成功！获得10条小鱼');
        const newBalance = (userStore.userInfo.fishBalance || 0) + 10;
        userStore.updateAfterClaim(newBalance);
    } catch (error) { console.error("签到失败:", error); }
};

const handleSearch = () => {
    if (!searchKeyword.value.trim()) { return ElMessage.warning('请输入搜索关键词'); }
    isDrawerOpen.value = false;
    router.push({ path: '/search', query: { q: searchKeyword.value } });
};

const goToHome = () => { 
    router.push('/'); 
};

const navigateTo = (path) => {
    isDrawerOpen.value = false;
    router.push(path);
};
</script>

<style scoped>
.navbar {
  position: relative; display: flex; justify-content: center; align-items: center;
  padding: 0 20px; border-bottom: 1px solid #E9ECEF; background-color: #FFFFFF;
  height: 60px;
}
.logo-container {
  position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
  font-size: 22px; font-weight: 700; cursor: pointer; color: #007BFF;
}
.search-container { width: 100%; max-width: 400px; }
.menu-container {
  position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center;
}
.user-menu { display: flex; align-items: center; }
.notification-bell {
  margin-right: 20px; cursor: pointer; display: flex; align-items: center;
  height: 60px;
}
:deep(.notification-popper) {
  padding: 0 !important;
}
.el-dropdown-link { display: flex; align-items: center; cursor: pointer; outline: none; }
.nickname { margin-left: 10px; }
.fish-balance { display: flex; align-items: center; margin: 0 15px; font-size: 14px; color: #606266; }
.show-on-mobile { display: none; }

@media (max-width: 768px) {
  .navbar { justify-content: space-between; }
  .logo-container, .menu-container { position: static; transform: none; }
  .hide-on-mobile { display: none; }
  .show-on-mobile { display: block; cursor: pointer; }
}

.drawer-content { display: flex; flex-direction: column; height: 100%; }
.drawer-search-container { padding: 0 10px; margin-bottom: 25px; }
.drawer-user-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
  border-radius: 12px; padding: 16px; display: flex; align-items: center;
  cursor: pointer; transition: transform 0.2s ease-in-out;
}
.drawer-user-card:active { transform: scale(0.98); }
.drawer-user-card .info-text { margin-left: 15px; }
.drawer-user-card .nickname { font-size: 18px; font-weight: 600; }
.drawer-user-card .fish-balance { font-size: 14px; color: #606266; margin-top: 5px; }
.drawer-menu-links { margin-top: 15px; flex-grow: 1; }
.drawer-link-item {
  display: flex; align-items: center; padding: 15px 10px; cursor: pointer;
  border-radius: 8px; transition: background-color 0.2s; font-size: 16px; color: #303133;
}
.drawer-link-item:active { background-color: #f0f2f5; }
.drawer-link-item .el-icon { font-size: 20px; margin-right: 15px; }
.drawer-link-item span { flex-grow: 1; }
.drawer-link-item .arrow-icon { margin-right: 0; color: #c0c4cc; }
.drawer-link-item.is-disabled { color: #a8abb2; cursor: not-allowed; }
.drawer-link-item.is-disabled:active { background-color: transparent; }
.drawer-badge { position: relative; top: 0; }
.logout-button { margin-top: auto; height: 45px; font-size: 16px; }
.drawer-guest-menu { display: flex; flex-direction: column; gap: 10px; }
.drawer-guest-menu .el-button { width: 100%; margin-left: 0; }
</style>