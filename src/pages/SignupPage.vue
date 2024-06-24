<template>
  <q-page>
    <div class="signup-container">
      <q-card class="signup-card">
        <q-card-section>
          <div class="text-h5">회원 가입</div>
          <br />
          <p class="subtext">
            당신이 다시 일어설 수 있게 너겟이 함께해요.
            <br />손쉬운 회원가입 후 너겟의 서비스를 이용해 보세요.
          </p>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="register">
            <q-input
              v-model="form.username"
              label="아이디"
              outlined
              dense
              :rules="[val => !!val || '아이디를 입력해주세요']"
              autocomplete="username"
            />
            <q-input
              v-model="form.password"
              label="비밀번호"
              type="password"
              outlined
              dense
              class="q-mt-md"
              :rules="[val => !!val || '비밀번호를 입력해주세요']"
              autocomplete="new-password"
            />
            <q-input
              v-model="form.passwordConfirm"
              label="비밀번호 확인"
              type="password"
              outlined
              dense
              class="q-mt-md"
              :rules="[
                val => !!val || '비밀번호 확인을 입력해주세요',
                val => val === form.password || '비밀번호가 일치하지 않습니다.',
              ]"
              autocomplete="new-password"
            />
            <p class="subtext">
              구직 시 희망 직종과 희망 근무지를 선택해주세요.
              <br />선택지를 고려해서 적합한 일자리를 추천해드려요.
            </p>
            <q-select
              v-model="form.prefJob"
              label="희망 직종"
              :options="jobOptions"
              outlined
              dense
              class="q-mt-md"
              :rules="[val => !!val || '희망 직종을 선택해주세요']"
            />
            <q-select
              v-model="form.prefLocation"
              label="희망 근무지"
              :options="locationOptions"
              outlined
              dense
              class="q-mt-md"
              :rules="[val => !!val || '희망 근무지를 선택해주세요']"
            />
            <p class="subtext">
              걱정마세요 ! <br />
              선택지는 언제든지 마이페이지에서 변경이 가능해요.
            </p>
            <q-btn
              label="가입하기"
              type="submit"
              color="primary"
              class="full-width q-mt-md"
            />
          </q-form>
        </q-card-section>
      </q-card>
      <q-btn label="뒤로가기" flat class="full-width q-mt-sm" @click="goBack" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

const form = ref({
  username: '',
  password: '',
  prefJob: null,
  prefLocation: '',
});

const router = useRouter();

const jobOptions = [
  { label: '행정 및 사무', value: '0' },
  { label: '마켓팅 및 기획', value: '1' },
  { label: '교육, 연구 및 개발', value: '2' },
  { label: '건설 및 시설 관리', value: '3' },
  { label: '보안, 안전 및 재난', value: '4' },
  { label: '의료, 복지 및 지원 서비스', value: '5' },
  { label: '창작 및 미용', value: '6' },
  { label: '요식, 조리 및 제과', value: '7' },
  { label: '운송, 영업 및 판매', value: '8' },
  { label: '제조 및 기술', value: '9' },
];

const locationOptions = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
].map(location => ({ label: location, value: location }));

const register = async () => {
  try {
    const response = await api.post(
      '/user/register',
      {
        username: form.value.username,
        password: form.value.password,
        prefJob: form.value.prefJob.value,
        prefLocation: form.value.prefLocation.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data.message) {
      alert(response.data.message);
      router.push('/');
    }
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error.response.data);
    alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
};

// 뒤로 가기
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 70px auto auto auto;
}

.full-width {
  width: 100%;
}

.q-mt-md {
  margin-top: 0.5rem;
}

.q-mt-sm {
  margin-top: 0.75rem;
}
</style>
