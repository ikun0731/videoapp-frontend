// src/api/comment.js
import request from './request'

// GET /api/videos/{videoId}/comments
export const getCommentsForVideo = (videoId) => {
  return request({
    url: `/videos/${videoId}/comments`,
    method: 'get'
  })
}

// POST /api/videos/{videoId}/comments
export const postComment = (videoId, data) => {
  return request({
    url: `/videos/${videoId}/comments`,
    method: 'post',
    data
  })
}

//删除评论的接口函数
// DELETE /api/comments/{commentId}
export const deleteComment = (commentId) => {
  return request({
    url: `/comments/${commentId}`,
    method: 'delete'
  })
}