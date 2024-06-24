<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="detail-header">
          <div class="detail-title">{{ guide.title }}</div>
          <div class="detail-meta">
            <span>등록 날짜: {{ formatDate(guide.createdDate) }}</span>
            <span v-if="guide.updatedDate"
              >| 수정 날짜: {{ formatDate(guide.updatedDate) }}</span
            >
            <div class="detail-author">작성자: 관리자</div>
          </div>
        </div>
        <q-separator spaced />
        <div class="detail-content-container">
          <div class="detail-content" v-html="guide.content"></div>
        </div>
        <q-separator spaced />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { date } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import GuidePage from './GuidePage.vue';

const guide = ref({});
const previousGuide = ref(null);
const route = useRoute();
const router = useRouter();

const fetchGuideDetails = async id => {
  try {
    const response = await api.get(`/job-guide/${id}`);
    guide.value = response.data;

    const allGuides = await api.get('/job-guide');
    const guideIndex = allGuides.data.findIndex(g => g.guideId === id);

    previousGuide.value = allGuides.data[guideIndex - 1] || null;
  } catch (error) {
    console.error('Failed to fetch guide details:', error);
  }
};

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

const viewDetails = guide => {
  router.push(`/guide/${guide.guideId}`);
};

const goToList = () => {
  router.push('/');
};

watch(
  () => route.params.id,
  newId => {
    fetchGuideDetails(newId);
  },
);

onMounted(() => {
  fetchGuideDetails(route.params.id);
});
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
  flex: 1;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.85rem;
  color: gray;
}

.detail-author {
  font-size: 0.85rem;
  color: gray;
  text-align: right;
  margin-top: 5px;
}

.detail-content-container {
  height: 550px; /* Fixed height */
  overflow-y: auto;
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
}

.detail-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
}

.navigation-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.nav-btn {
  text-transform: none;
  font-weight: bold;
  color: #1976d2;
}

.back-btn {
  align-self: flex-start;
}

.previous-btn {
  align-self: flex-end;
}
</style>
