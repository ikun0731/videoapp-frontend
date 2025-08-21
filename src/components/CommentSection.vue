// src/components/CommentSection.vue
<template>
  <div class="comment-section">
    <h2>评论 ({{ comments.length }})</h2>

    <div class="comment-form">
      <div v-if="userStore.isLoggedIn">
        <el-input
          v-model="newCommentContent"
          :rows="3"
          type="textarea"
          placeholder="请输入友善的评论..."
        />
        <div class="form-actions">
          <el-button type="primary" @click="handlePostComment">发表评论</el-button>
        </div>
      </div>
      <el-alert
        v-else
        title="请登录后发表评论"
        type="info"
        :closable="false"
        show-icon
      />
    </div>

    <div class="comment-list">
      <div v-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          
          <router-link :to="`/user/${comment.commenter.username}`" class="commenter-link" v-if="comment.commenter">
            <div class="comment-header">
              <el-avatar :size="32" :src="fullAvatarUrl(comment.commenter?.avatarUrl)" />
              <span class="commenter-nickname">{{ comment.commenter?.nickname || '匿名用户' }}</span>
            </div>
          </router-link>
          
          <p class="comment-content">{{ comment.content }}</p>
          
          <div class="comment-meta">
            <span>{{ new Date(comment.createdAt).toLocaleString() }}</span>
            
            <el-button
              v-if="userStore.isLoggedIn && userStore.userInfo.id === comment.commenter?.id"
              type="danger"
              link
              @click="handleDeleteComment(comment.id)"
            >
              删除
            </el-button>
          </div>

        </div>
      </div>
      <el-empty v-else description="还没有评论，快来抢沙发吧！" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getCommentsForVideo, postComment, deleteComment } from '../api/comment';
import { useUserStore } from '../store/user';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
  videoId: {
    type: [String, Number],
    required: true
  }
});

const userStore = useUserStore();
const comments = ref([]);
const newCommentContent = ref('');

const fetchComments = async () => {
  if (props.videoId) {
    try {
      const data = await getCommentsForVideo(props.videoId);
      comments.value = data;
      // 【新增诊断代码】如果评论不为空，打印第一个评论的 commenter 对象
      if (data && data.length > 0) {
        console.log('评论者 (commenter) 对象:', data[0].commenter);
      }
    } catch (error) {
    // 只保留 console.error
    console.error("获取评论列表失败:", error);
}
  }
};

const handlePostComment = async () => {
  if (!newCommentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空！');
    return;
  }
  try {
    await postComment(props.videoId, { content: newCommentContent.value });
    ElMessage.success('评论发表成功！');
    newCommentContent.value = '';
    await fetchComments();
  } catch (error) {
    console.error("发表评论失败:", error);
}
};

const handleDeleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm(
      '你确定要删除这条评论吗？此操作不可撤销。',
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    await deleteComment(commentId);
    ElMessage.success('评论已删除');
    await fetchComments();

  } catch (error) {
    if (error !== 'cancel') {
        console.error('删除评论失败:', error);
    }
}
};


const fullAvatarUrl = (avatarUrl) => {
  return avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
};
onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.comment-section { margin-top: 20px; }
.comment-form { margin-top: 20px; }
.form-actions { margin-top: 10px; text-align: right; }
.comment-list { margin-top: 20px; }
.comment-item { display: flex; flex-direction: column; padding: 16px 0; border-top: 1px solid #f0f2f5; }
.comment-item:first-child { padding-top: 0; border-top: none; }
/* 【新增】router-link 的样式 */
.commenter-link { text-decoration: none; color: inherit; }
.comment-header { display: flex; align-items: center; margin-bottom: 8px; }
.commenter-nickname { margin-left: 10px; font-weight: 600; font-size: 14px; color: #303133; }
.commenter-nickname:hover { color: #409EFF; }
.comment-content { font-size: 14px; color: #606266; line-height: 1.7; padding-left: 42px; margin: 0 0 8px 0; white-space: pre-wrap; }
.comment-meta { font-size: 12px; color: #909399; padding-left: 42px; }
</style>