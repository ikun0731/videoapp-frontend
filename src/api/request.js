/**
 * API请求封装模块
 * 封装了基于axios的HTTP请求工具，处理请求/响应拦截、错误处理和认证
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store/user'

/**
 * 创建axios实例，设置基础配置
 */
const request = axios.create({
  baseURL: '/api',     // API基础路径
  timeout: 5000,       // 请求超时时间（5秒）
  headers: {
    'Content-Type': 'application/json'  // 默认请求头
  }
})

/**
 * 请求拦截器
 * 在请求发送前，统一处理认证令牌等前置工作
 */
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // 如果存在token，则在请求头中添加认证信息
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  }, 
  error => {
    // 请求错误处理
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应数据和错误情况
 */
request.interceptors.response.use(
  /**
   * 处理成功响应 (HTTP状态码为2xx)
   * 后端数据结构: { code: number, message: string, data: any }
   * @param {Object} response - axios响应对象
   * @returns {any} 处理后的响应数据
   */
  response => {
    const res = response.data
    
    // 判断业务状态码
    if (res.code !== 200) {
      // 业务逻辑错误处理
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      // 业务成功，只返回核心数据data给业务逻辑
      return res.data
    }
  },

  /**
   * 处理失败响应 (HTTP状态码为4xx, 5xx等)
   * @param {Object} error - axios错误对象
   * @returns {Promise} rejected的Promise
   */
  error => {
    console.error('API请求失败:', error)

    // 提取错误信息
    let message = '发生未知错误'
    
    if (error.response && error.response.data && error.response.data.message) {
      // 优先使用后端返回的具体业务错误信息
      message = error.response.data.message
    } else if (error.message) {
      // 使用axios提供的通用HTTP错误信息
      message = error.message
      
      // 对特定错误进行更友好的提示
      if (message.includes('timeout')) {
        message = '请求超时，请检查网络连接'
      } else if (message.includes('Network Error')) {
        message = '网络错误，请检查您的网络连接'
      }
    }

    // 统一错误提示
    ElMessage({
      message: message,
      type: 'error',
      duration: 5000
    })
    
    return Promise.reject(error)
  }
)

export default request