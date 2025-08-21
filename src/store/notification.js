/**
 * 通知状态管理模块
 * 管理用户通知的获取、更新、轮询和标记已读
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api/notification'
import { ElMessage } from 'element-plus'

/**
 * 通知信息接口
 * @typedef {Object} Notification
 * @property {string} id - 通知ID
 * @property {string} type - 通知类型
 * @property {string} content - 通知内容
 * @property {boolean} isRead - 是否已读
 * @property {string} createdAt - 创建时间
 * @property {Object} metadata - 通知相关元数据
 */

/**
 * 通知状态管理存储
 */
export const useNotificationStore = defineStore('notification', () => {
  /**
   * 通知列表
   * @type {import('vue').Ref<Notification[]>}
   */
  const notifications = ref([])
  
  /**
   * 轮询定时器
   * @type {import('vue').Ref<number|null>}
   */
  const pollingTimer = ref(null)

  /**
   * 未读通知数量
   */
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  /**
   * 获取用户通知
   * 优化了通知数据的合并策略，保持响应式
   */
  async function fetchNotifications() {
    try {
      const newNotifications = await getMyNotifications()
      
      // 智能合并方式，保持通知列表的响应式
      if (notifications.value.length === 0) {
        notifications.value = newNotifications
      } else {
        // 更新现有通知并添加新通知到列表顶部
        newNotifications.forEach(newNotif => {
          const existingNotif = notifications.value.find(n => n.id === newNotif.id)
          if (existingNotif) {
            // 更新已存在通知的状态
            existingNotif.isRead = newNotif.isRead
          } else {
            // 添加新通知到列表顶部
            notifications.value.unshift(newNotif)
          }
        })
      }
    } catch (error) {
      console.error("获取通知列表失败:", error)
    }
  }

  /**
   * 启动通知轮询
   * 设置每30秒获取一次最新通知
   */
  function startPolling() {
    if (pollingTimer.value) return // 防止重复启动轮询
    
    // 立即获取一次通知
    fetchNotifications()
    
    // 设置轮询定时器（30秒间隔）
    pollingTimer.value = setInterval(fetchNotifications, 30000)
  }

  /**
   * 停止通知轮询
   */
  function stopPolling() {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
      pollingTimer.value = null
    }
  }

  /**
   * 清空通知列表并停止轮询
   * 用于用户登出等情况
   */
  function clearNotifications() {
    notifications.value = []
    stopPolling()
  }

  /**
   * 标记单个通知为已读
   * @param {string} notificationId - 通知ID
   */
  async function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (!notification || notification.isRead) return
    
    try {
      await markNotificationAsRead(notificationId)
      notification.isRead = true
    } catch (error) {
      console.error("标记通知已读失败:", error)
      ElMessage.error("操作失败，请稍后重试")
    }
  }

  /**
   * 标记所有通知为已读
   */
  async function markAllAsRead() {
    if (unreadCount.value === 0) return
    
    try {
      await markAllNotificationsAsRead()
      
      // 更新本地状态
      notifications.value.forEach(n => {
        if (!n.isRead) {
          n.isRead = true
        }
      })
    } catch (error) {
      console.error("全部标记已读失败:", error)
      ElMessage.error("操作失败，请稍后重试")
    }
  }

  // 导出状态和方法
  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
    clearNotifications
  }
})