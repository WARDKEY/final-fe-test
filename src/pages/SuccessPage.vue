<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">성공 사례</div>
            <p>성공 사례를 확인하세요.</p>
          </div>
          <q-btn label="글쓰기" color="primary" @click="navigateToWritePage" />
        </div>
      </q-card-section>
      <q-card-section>
        <div
          v-for="sc in paginatedSuccessCases"
          :key="sc.caseId"
          class="q-my-md"
        >
          <q-card @click="navigateToDetails(sc.caseId)">
            <q-card-section>
              <div class="CaseCard">{{ sc.title }}</div>
              <div>작성자: {{ sc.username }}</div>
              <div>게시글 번호: {{ sc.caseId }}</div>
              <div>
                게시 일자: {{ new Date(sc.createdDate).toLocaleDateString() }}
              </div>
              <div v-if="sc.username === authStore.username">
                <q-btn
                  color="primary"
                  label="삭제"
                  @click="deleteCase(sc.caseId)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <pagination-control
          :total-pages="totalPages"
          v-model="page"
          @update:model-value="updatePagination"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api, customApi } from 'boot/axios';
import PaginationControl from 'components/PaginationControl.vue';
import { useAuthStore } from 'stores/authStore';

const successCases = ref([]);
const page = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() =>
  Math.ceil(successCases.value.length / itemsPerPage),
);
const router = useRouter();
const authStore = useAuthStore();

const navigateToWritePage = () => {
  router.push({ name: 'SuccessPageWrite' });
};

const deleteCase = async caseId => {
  try {
    const response = await customApi.delete(`/success-case/${caseId}`);
    console.log('성공 사례 삭제 성공', response.data.message);
  } catch (error) {
    console.error('성공 사례 삭제 에러', error);
  }
};

const fetchSuccessCases = async () => {
  try {
    const response = await api.get('/success-case');
    successCases.value = response.data.filter(
      successCase => successCase.isApproved === 1,
    );
  } catch (error) {
    console.error('성공사례 fetch 에러', error);
  }
};

onMounted(fetchSuccessCases);

const updatePagination = newPage => {
  page.value = newPage;
  fetchSuccessCases();
};

const paginatedSuccessCases = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return successCases.value.slice(start, start + itemsPerPage);
});

const navigateToDetails = caseId => {
  router.push({ name: 'SuccessPageDetails', params: { caseId: caseId } });
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
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
</style>
