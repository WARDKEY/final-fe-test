<template>
  <q-page>
    <div class="mypage-container">
      <div class="mypage-header">
        <q-btn @click="selectTab('info')" :outline="selectedTab !== 'info'"
          >내 정보</q-btn
        >
        <q-btn
          @click="selectTab('history')"
          :outline="selectedTab !== 'history'"
          >상담 내역</q-btn
        >
        <q-btn @click="selectTab('cases')" :outline="selectedTab !== 'cases'"
          >취업 성공사례 내역</q-btn
        >
        <q-btn
          @click="selectTab('bookmarks')"
          :outline="selectedTab !== 'bookmarks'"
          >북마크</q-btn
        >
      </div>

      <q-card v-if="selectedTab === 'info'" class="mypage-card">
        <q-card-section>
          <div class="text-h5">나의 정보 변경</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="updateInfo">
            <q-input
              v-model="formData.username"
              label="아이디"
              dense
              outlined
              readonly
            />
            <q-input
              v-model="formData.password"
              label="비밀번호"
              type="password"
              dense
              outlined
              class="q-mt-md"
            />
            <q-input
              v-model="formData.passwordConfirm"
              label="비밀번호 확인"
              type="password"
              dense
              outlined
              class="q-mt-md"
            />
            <q-select
              v-model="formData.location"
              :options="locationOptions"
              label="근무 희망 지역"
              dense
              outlined
              class="q-mt-md"
            />
            <q-select
              v-model="formData.job"
              :options="jobOptions"
              label="희망 직종"
              dense
              outlined
              class="q-mt-md"
            />
            <q-btn
              label="변경 사항 저장"
              type="submit"
              color="primary"
              class="q-mt-md full-width"
            />
          </q-form>
        </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'history'" class="mypage-card">
        <q-card-section> 상담 내역 </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'cases'" class="mypage-card">
        <q-card-section> 취업 성공사례 내역 </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'bookmarks'" class="mypage-card">
        <q-card-section> 북마크 내용 </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/authStore';
import { customApi } from 'boot/axios';

const authStore = useAuthStore();
const selectedTab = ref('info');

const formData = ref({
  username: '',
  password: '',
  passwordConfirm: '',
  location: '',
  job: '',
});

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

const jobOptions = [
  { label: '행정 및 사무', value: '0' },
  { label: '마케팅 및 기획', value: '1' },
  { label: '교육, 연구 및 개발', value: '2' },
  { label: '건설 및 시설 관리', value: '3' },
  { label: '보안, 안전 및 재난', value: '4' },
  { label: '의료, 복지 및 지원 서비스', value: '5' },
  { label: '창작 및 미용', value: '6' },
  { label: '요식업, 조리 및 제과', value: '7' },
  { label: '운송, 영업 및 판매', value: '8' },
  { label: '제조 및 기술', value: '9' },
];

//커스텀 api 로 마이페이지에 기존 선택값 가져옴. 이렇게 쓰는거겠지?
async function fetchUserData() {
  try {
    if (authStore.isLoggedIn) {
      const response = await customApi.get('/mypage');

      //하..한번 더 매핑. 이 방법 밖에 없나 ? 바보윾진.
      //이건 보여주기식 매핑입니다. 사용자에게 보여주기 위해.
      const jobMapping = {
        0: '행정 및 사무',
        1: '마케팅 및 기획',
        2: '교육, 연구 및 개발',
        3: '건설 및 시설 관리',
        4: '보안, 안전 및 재난',
        5: '의료, 복지 및 지원 서비스',
        6: '창작 및 미용',
        7: '요식업, 조리 및 제과',
        8: '운송, 영업 및 판매',
        9: '제조 및 기술',
      };

      formData.value.username = response.data.username;
      formData.value.location = response.data.prefLocation;
      formData.value.job =
        jobMapping[response.data.prefJob] || response.data.prefJob;
    }
  } catch (error) {
    console.error('사용자 정보를 가져오는데 실패했습니다:', error);
  }
}

async function updateInfo() {
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  /* 이거 response로 받는거 이제 쓸모없어서 일단 주석 처리 해둠!!

  try {
    const response = await customApi.patch('/mypage/pref-location', {
      location: formData.value.location.value,
    });
  } catch (error) {
    console.error('근무 희망 지역 수정 실패:', error);
  }

  try {
    const response = await customApi.patch('/mypage/pref-job', {
      job:
        jobOptions.find(option => option.label === formData.value.job.value)
          ?.value || formData.value.job.value,
    });
  } catch (error) {
    console.error('희망 직종 수정 실패:', error);
  }



  if (formData.value.password) {
    try {
      const response = await customApi.patch('/mypage/password', {
        password: formData.value.password,
      });
    } catch (error) {
      console.error('비밀번호 수정 실패:', error);
    }
  }

  alert('변경 사항이 저장되었습니다.');
}


*/

  //지역 수정요 customAPI 로 저장
  try {
    await customApi.patch('/mypage/pref-location', {
      location: formData.value.location.value,
    });
  } catch (error) {
    console.error('근무 희망 지역 수정 실패:', error);
  }

  //직종 수정요  customAPI 로 저장
  try {
    await customApi.patch('/mypage/pref-job', {
      job:
        jobOptions.find(option => option.label === formData.value.job.value)
          ?.value || formData.value.job.value,
    });
  } catch (error) {
    console.error('희망 직종 수정 실패:', error);
  }

  //비번 수정요  customAPI 로 저장
  if (formData.value.password) {
    try {
      await customApi.patch('/mypage/password', {
        password: formData.value.password,
      });
    } catch (error) {
      console.error('비밀번호 수정 실패:', error);
    }
  }

  alert('변경 사항이 저장되었습니다.');
}

onMounted(() => {
  authStore.initializeAuth();
  fetchUserData();
});

function selectTab(tab) {
  selectedTab.value = tab;
}
</script>

<style scoped>
.mypage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.mypage-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.mypage-card {
  width: 100%;
  max-width: 800px;
}
</style>
