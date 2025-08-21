/**
 * 用户状态管理模块
 * 管理用户的认证状态、个人信息和相关操作
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户信息接口
 * @typedef {Object} UserInfo
 * @property {string} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} [nickname] - 昵称
 * @property {string} [avatarUrl] - 头像URL
 * @property {number} fishBalance - 鱼币余额
 * @property {boolean} canClaimDaily - 是否可以领取每日奖励
 * @property {string} [email] - 邮箱
 * @property {string} [bio] - 个人简介
 */

/**
 * 用户状态管理存储
 */
export const useUserStore = defineStore('user', () => {
  /**
   * JWT令牌，从localStorage中恢复
   */
  const token = ref(localStorage.getItem('jwt-token'))
  
  /**
   * 用户信息，默认提供空的基础结构
   */
  const userInfo = ref({
    fishBalance: 0,
    canClaimDaily: false
  })

  /**
   * 用户是否已登录
   */
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 设置JWT令牌并保存到本地存储
   * @param {string} newToken - 新的JWT令牌
   */
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('jwt-token', newToken)
  }

  /**
   * 设置用户信息
   * @param {UserInfo} newUser - 用户信息对象
   */
  function setUser(newUser) {
    userInfo.value = newUser
  }

  /**
   * 用户领取每日奖励后更新状态
   * @param {number} newBalance - 新的鱼币余额
   */
  function updateAfterClaim(newBalance) {
    if (userInfo.value) {
      userInfo.value.fishBalance = newBalance
      userInfo.value.canClaimDaily = false
    }
  }
  
  /**
   * 用户喂鱼（打赏）后减少余额
   * @param {number} amount - 打赏数量
   */
  function decrementFishBalance(amount) {
    if (userInfo.value && userInfo.value.fishBalance >= amount) {
      userInfo.value.fishBalance -= amount
    }
  }

  /**
   * 用户登出，清除认证信息和用户数据
   */
  function logout() {
    token.value = null
    userInfo.value = {
      fishBalance: 0,
      canClaimDaily: false
    }
    localStorage.removeItem('jwt-token')
  }

  // 导出状态和方法
  return { 
    token, 
    userInfo, 
    isLoggedIn, 
    setToken, 
    setUser, 
    logout, 
    updateAfterClaim,
    decrementFishBalance
  }
})