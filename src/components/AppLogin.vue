<template>
  <div class="sidebar-login">
    <p>로그인 후 너겟을 마음껏 이용해보세요!</p>
    <q-input
      filled
      v-model="loginData.username"
      placeholder="아이디"
      class="q-mt-sm"
    />
    <q-input
      filled
      v-model="loginData.password"
      type="password"
      placeholder="비밀번호"
      class="q-mt-sm"
    />
    <q-btn
      label="로그인"
      color="primary"
      class="q-mt-sm full-width"
      @click="login"
    />
    <q-btn
      label="회원가입"
      flat
      class="q-mt-sm full-width signup-button"
      @click="$router.push('/signup')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

const loginData = ref({
  username: '',
  password: '',
});

const authStore = useAuthStore();
const router = useRouter();

async function login() {
  try {
    await authStore.login(loginData.value);

    if (authStore.isLoggedIn) {
      await router.push('/');
    } else {
      alert('로그인 실패: 서버에서 올바른 응답을 받지 못했습니다.');
    }
  } catch (error) {
    alert('아이디 혹은 비밀번호를 다시 확인해 주세요!');
  }
}
</script>

<style scoped>
.sidebar-login {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.sidebar-login p {
  margin-bottom: 0.5rem;
  color: #555;
}

.q-btn.primary {
  background-color: #5e9fcf;
  color: white;
}

.signup-button {
  background-color: #7bcaff;
  color: #000;
}

.full-width {
  width: 100%;
}
</style>
