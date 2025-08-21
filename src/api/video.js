/**
 * 视频相关API模块
 * 包含视频的获取、上传、搜索、删除等操作
 */
import request from './request'

/**
 * 上传视频和封面
 * @param {FormData} data - 包含视频信息的表单数据
 *   @param {string} data.title - 视频标题
 *   @param {string} data.description - 视频描述
 *   @param {File} data.file - 视频文件
 *   @param {File} data.cover - 视频封面图片
 * @param {Function} onUploadProgress - 上传进度回调函数
 * @returns {Promise} 上传结果
 */
export const uploadVideo = (data, onUploadProgress) => {
  return request({
    url: '/videos/upload',
    method: 'post',
    data,
    timeout: 300000, // 上传视频需要更长的超时时间（5分钟）
    onUploadProgress
  })
}

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 *   @param {number} params.page - 页码
 *   @param {number} params.size - 每页数量
 *   @param {string} params.sortBy - 排序方式，支持：latest, views, popularity
 * @returns {Promise} 分页的视频列表
 */
export const getVideoList = (params) => {
  return request({ 
    url: '/videos', 
    method: 'get', 
    params 
  })
}

/**
 * 获取视频详情
 * @param {string|number} videoId - 视频ID
 * @returns {Promise} 视频详情信息
 */
export const getVideoDetail = (videoId) => {
  return request({ 
    url: `/videos/${videoId}`, 
    method: 'get' 
  })
}

/**
 * 搜索视频
 * @param {Object} params - 搜索参数
 *   @param {string} params.q - 搜索关键词
 *   @param {number} params.page - 页码
 *   @param {number} params.size - 每页数量
 * @returns {Promise} 搜索结果
 */
export const searchVideos = (params) => {
  return request({ 
    url: '/videos/search', 
    method: 'get', 
    params 
  })
}

/**
 * 删除视频
 * @param {string|number} videoId - 要删除的视频ID
 * @returns {Promise} 删除结果
 */
export const deleteVideo = (videoId) => {
  return request({ 
    url: `/videos/${videoId}`, 
    method: 'delete' 
  })
}

/**
 * 给视频喂鱼（打赏）
 * @param {string|number} videoId - 视频ID
 * @returns {Promise} 打赏结果
 */
export const feedFishToVideo = (videoId) => {
  return request({ 
    url: `/videos/${videoId}/feed`, 
    method: 'post' 
  })
}

/**
 * 更新视频信息
 * @param {string|number} videoId - 视频ID
 * @param {Object} data - 要更新的视频信息
 *   @param {string} [data.title] - 视频标题
 *   @param {string} [data.description] - 视频描述
 * @returns {Promise} 更新结果
 */
export const updateVideo = (videoId, data) => {
  return request({ 
    url: `/videos/${videoId}`, 
    method: 'patch', 
    data 
  })
}