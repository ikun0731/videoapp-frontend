<template>
  <div class="notification-list" :class="{ 'page-mode': props.isPageMode }">
    <div class="list-header" v-if="notifications.length > 0">
      <h3>通知中心</h3>
      <el-button 
        type="primary" 
        link 
        @click="onMarkAllAsRead"
        :disabled="notificationStore.unreadCount === 0"
      >
        全部已读
      </el-button>
    </div>

    <div v-if="notifications.length > 0" class="list-body">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification-item"
        :class="{ 'is-unread': !notification.isRead }"
        @click="handleClick(notification)"
      >
        <div class="notification-content">
          <p class="content-text">{{ notification.content }}</p>
          <span class="content-time">{{ formatTimeAgo(notification.createdAt) }}</span>
        </div>
        <div v-if="!notification.isRead" class="unread-dot"></div>
      </div>
    </div>
    <el-empty v-else description="暂无通知" :image-size="60" />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useNotificationStore } from '../store/notification';
import { useRouter } from 'vue-router';

const props = defineProps({
  isPageMode: {
    type: Boolean,
    default: false
  }
});

const notificationStore = useNotificationStore();
const router = useRouter();

const notifications = computed(() => notificationStore.notifications);

const handleClick = async (notification) => {
  // 先标记已读，并等待完成
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification.id);
  }
  // 再进行跳转
  if (notification.type === 'NEW_COMMENT' || notification.type === 'NEW_FISH') {
    if (notification.relatedEntityId) {
      router.push(`/video/${notification.relatedEntityId}`);
    }
  }
};

const onMarkAllAsRead = () => {
  notificationStore.markAllAsRead();
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
};
</script>

<style scoped>
.notification-list {
  max-height: 400px;
  display: flex;
  flex-direction: column;
}
.notification-list.page-mode {
  max-height: none;
  overflow-y: visible;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}
.list-header h3 { margin: 0; font-size: 16px; }
.list-body {
  flex-grow: 1;
  overflow-y: auto;
}
.notification-list.page-mode .list-body {
  overflow-y: visible;
}
.notification-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f2f5;
}
.notification-item:last-child { border-bottom: none; }
.notification-item:hover { background-color: #f5f7fa; }
.notification-item.is-unread { background-color: #ecf5ff; }
.notification-content {
  flex-grow: 1;
  min-width: 0; 
}
.content-text {
  margin: 0;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #f56c6c;
  border-radius: 50%;
  margin-left: 15px;
  flex-shrink: 0;
}
</style>