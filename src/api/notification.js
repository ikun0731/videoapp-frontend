import request from './request';

/**
 * 获取当前用户的通知列表
 * GET /api/notifications
 */
export const getMyNotifications = () => {
  return request({
    url: '/notifications',
    method: 'get'
  });
};
/**
 * 将单条通知标记为已读
 * POST /api/notifications/{notificationId}/read
 * @param {number} notificationId 
 */
export const markNotificationAsRead = (notificationId) => {
  return request({
    url: `/notifications/${notificationId}/read`,
    method: 'post'
  });
};
// 【新增】
export const markAllNotificationsAsRead = () => {
  return request({
    url: '/notifications/read-all',
    method: 'post'
  });
};