/**
 * 用户相关API模块
 * 包含用户注册、登录、信息获取、更新等操作
 */
import request from './request'

/**
 * 用户注册
 * @param {Object} data - 注册信息
 *   @param {string} data.username - 用户名
 *   @param {string} data.password - 密码
 *   @param {string} data.email - 邮箱
 *   @param {string} data.verificationCode - 验证码
 * @returns {Promise} 注册结果
 */
export const registerUser = (data) => {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录信息
 *   @param {string} data.username - 用户名
 *   @param {string} data.password - 密码
 * @returns {Promise} 登录结果，包含token
 */
export const loginUser = (data) => {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

/**
 * 获取当前登录用户信息
 * @returns {Promise} 用户信息
 */
export const getMyInfo = () => {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

/**
 * 领取每日奖励
 * @returns {Promise} 领取结果
 */
export const claimDailyBonus = () => {
  return request({
    url: '/users/me/claim-daily',
    method: 'post'
  })
}

/**
 * 获取指定用户的公开信息
 * @param {string} username - 用户名
 * @returns {Promise} 用户公开信息
 */
export const getUserProfile = (username) => {
  return request({
    url: `/users/${username}`,
    method: 'get'
  })
}

/**
 * 更新当前用户信息
 * @param {Object} data - 要更新的用户信息
 *   @param {string} [data.nickname] - 昵称
 *   @param {string} [data.bio] - 个人简介
 * @returns {Promise} 更新结果
 */
export const updateMyInfo = (data) => {
  return request({
    url: '/users/me',
    method: 'patch',
    data
  })
}

/**
 * 获取指定用户的视频列表
 * @param {string|number} userId - 用户ID
 * @param {Object} params - 查询参数
 *   @param {number} params.page - 页码
 *   @param {number} params.size - 每页数量
 * @returns {Promise} 视频列表
 */
export const getUserVideos = (userId, params) => {
  return request({
    url: `/users/${userId}/videos`,
    method: 'get',
    params
  })
}

/**
 * 更新用户头像
 * @param {FormData} data - 包含avatar文件的表单数据
 * @returns {Promise} 更新结果
 */
export const updateUserAvatar = (data) => {
  return request({
    url: '/users/me/avatar',
    method: 'post',
    data
  })
}

/**
 * 修改用户密码
 * @param {Object} data - 密码信息
 *   @param {string} data.oldPassword - 旧密码
 *   @param {string} data.newPassword - 新密码
 * @returns {Promise} 修改结果
 */
export const changeUserPassword = (data) => {
  return request({
    url: '/users/me/password',
    method: 'post',
    data
  })
}

/**
 * 搜索用户
 * @param {Object} params - 搜索参数
 *   @param {string} params.q - 搜索关键词
 *   @param {number} params.page - 页码
 *   @param {number} params.size - 每页数量
 * @returns {Promise} 搜索结果
 */
export const searchUsers = (params) => {
  return request({
    url: '/users/search',
    method: 'get',
    params
  })
}

/**
 * 发送注册验证码
 * @param {Object} data - 包含邮箱信息
 *   @param {string} data.email - 邮箱地址
 * @returns {Promise} 发送结果
 */
export const sendVerificationCode = (data) => {
  return request({
    url: '/users/send-verification-code',
    method: 'post',
    data
  })
}