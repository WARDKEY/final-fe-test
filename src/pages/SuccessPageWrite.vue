<template>
  <div class="success-page-write">
    <h1>글 작성할거얏~~~~~~~~~~~~~~~~~~</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">글 제목</label>
        <input type="text" id="title" v-model="formData.title" />
      </div>
      <div class="form-group">
        <label for="content">글 내용</label>
        <textarea id="content" v-model="formData.content" rows="10"></textarea>
      </div>
      <button type="submit" class="writeBtn">글 작성하기</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { customApi } from 'src/boot/axios';

export default {
  data() {
    return {
      formData: {
        title: '',
        content: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await customApi.post('/success-case', this.formData);
        this.$router.push({ name: 'SuccessPage' });
        console.log('글 작성 성공');
      } catch (error) {
        console.error('글 작성 실패:', error);
        alert('글 작성에 실패했습니다.');
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
  margin-left: 30px;
}

.writeBtn {
  margin-left: 30px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type='submit'] {
  background-color: #7b91e2;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}

button[type='submit']:hover {
  background-color: #7b91e2;
}
</style>
