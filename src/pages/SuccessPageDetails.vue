<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header" v-if="successCase"></q-header>

    <q-page-container>
      <q-page class="page-wrapper">
        <q-card class="page-card" v-if="successCase">
          <q-card-section>
            <div class="header">
              <div class="sc-title">{{ successCase.title }}</div>
              <div class="text-caption">작성자: {{ successCase.username }}</div>
              <div class="text-caption">
                게시 일자:
                {{ new Date(successCase.createdDate).toLocaleDateString() }}
              </div>
            </div>
            <q-separator spaced />

            <q-card class="content-card">
              <q-card-section class="content-section">
                <p>{{ successCase.content }}</p>
              </q-card-section>

              <div class="comment-form">
                <q-input
                  filled
                  outlined
                  dense
                  v-model="newComment"
                  placeholder="댓글을 작성해주세요..."
                  clearable
                  @keydown.enter="submitComment"
                />
                <q-btn color="primary" label="확인" @click="submitComment" />
              </div>

              <div class="comments-section" v-if="comments.values">
                <br />
                <div
                  class="comment"
                  v-for="comment in comments"
                  :key="comment.commentId"
                >
                  <div class="comment-writer">
                    작성자 {{ comment.username }}
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>
                  <div class="comment-date">
                    작성 시각
                    {{ new Date(comment.createdDate).toLocaleDateString() }}
                    <div v-if="comment.username === authStore.username">
                      <q-btn
                        color="primary"
                        label="수정"
                        @click="editComment(comment.commentId)"
                      />
                      <q-btn
                        color="primary"
                        label="삭제"
                        @click="deleteComment(comment.commentId)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api, customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const successCase = ref(null);
const comments = ref([]);
const newComment = ref('');
const router = useRouter();
const caseId = router.currentRoute.value.params.caseId;
const authStore = useAuthStore();

const fetchSuccessCase = async () => {
  try {
    const response = await api.get(`/success-case/${caseId}`);
    successCase.value = response.data;
    fetchComments();
  } catch (error) {
    console.error('성공사례 fetch failed', error);
  }
};

const editComment = async commentId => {
  const newContent = prompt('댓글을 수정하세요:');

  try {
    const response = await customApi.patch(
      `/success-case/${caseId}/comment/${commentId}`,
      {
        content: newContent,
      },
    );
    console.log('댓글 수정 성공: ', response.data);

    const commentIndex = comments.value.findIndex(
      comment => comment.commentId === commentId,
    );
    if (commentIndex !== -1) {
      comments.value[commentIndex].content = newContent.trim();
    }
  } catch (error) {
    console.error('댓글 수정 에러', error);
  }
};

const deleteComment = async commentId => {
  try {
    const response = await customApi.delete(
      `/success-case/${caseId}/comment/${commentId}`,
    );
    console.log('댓글 삭제 성공:', response.data.message);
  } catch (error) {
    console.error('댓글 삭제 에러', error);
  }
};

const fetchComments = async () => {
  try {
    const response = await customApi.get(`/success-case/${caseId}/comments`);
    console.log(response.data);
    if (Array.isArray(response.data)) {
      comments.value = response.data;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('댓글 fetch 에러', error);
  }
};

onMounted(fetchSuccessCase);

const submitComment = async () => {
  if (newComment.value.length === 0) {
    console.log('댓글 내용을 최소 1 자 이상 입력해주세요');
    return;
  }
  try {
    const response = await customApi.post(`/success-case/${caseId}/comment`, {
      caseId: caseId,
      content: newComment.value,
    });
    console.log('댓글 작성 성공:', response.data.message);
    newComment.value = '';
  } catch (error) {
    console.error('댓글 작성 에러', error);
  }
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-caption {
  font-size: 14px;
  color: #666;
}

.content-card {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section {
  padding: 20px;
}

.comment {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.comment-section {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.comment-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.comment-form {
  margin-top: 20px;
  margin-left: 20px;
  width: 120%;
  display: flex;
  align-items: center;
}
.comment-date {
  font-size: 12px;
  justify-content: space-between;
  color: #666;
}
</style>
