<template>
  <div class="counseling-management">
    <q-table
      :rows="counselings"
      :columns="columns"
      row-key="counselingId"
      @row-click="openCounselingDialog"
    />
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">상담 내용</div>
          <q-input
            v-model="selectedCounseling.content"
            type="textarea"
            outlined
            readonly
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h6">답변 작성</div>
          <q-input v-model="answerContent" type="textarea" outlined />
          <q-btn label="저장" color="primary" @click="saveAnswer" />
          <q-btn label="삭제" color="negative" @click="deleteAnswer" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';

const counselings = ref([]);
const selectedCounseling = ref(null);
const answerContent = ref('');
const isDialogOpen = ref(false);

const columns = [
  {
    name: 'counselingId',
    required: true,
    label: '상담 ID',
    align: 'left',
    field: row => row.counselingId,
  },
  { name: 'user', label: '사용자', align: 'left', field: row => row.user },
  {
    name: 'category',
    label: '카테고리',
    align: 'left',
    field: row => row.category,
  },
  { name: 'content', label: '내용', align: 'left', field: row => row.content },
  {
    name: 'sentDate',
    label: '날짜',
    align: 'left',
    field: row => row.sentDate,
  },
];

const fetchCounselings = async () => {
  try {
    const response = await customApi.get('/counseling');
    counselings.value = response.data;
  } catch (error) {
    console.error('Failed to fetch counseling data:', error);
  }
};

const openCounselingDialog = row => {
  selectedCounseling.value = row;
  isDialogOpen.value = true;
  fetchAnswer(row.counselingId);
};

const fetchAnswer = async counselingId => {
  try {
    const response = await customApi.get(`/answer/${counselingId}`);
    answerContent.value = response.data.content;
  } catch (error) {
    answerContent.value = ''; // Reset if no answer
  }
};

const saveAnswer = async () => {
  try {
    if (selectedCounseling.value) {
      await customApi.post('/answer', {
        counselingId: selectedCounseling.value.counselingId,
        content: answerContent.value,
      });
      alert('답변이 저장되었습니다.');
    }
  } catch (error) {
    console.error('Failed to save answer:', error);
  }
};

const deleteAnswer = async () => {
  try {
    if (selectedCounseling.value) {
      await customApi.delete(
        `/answer/${selectedCounseling.value.counselingId}`,
      );
      alert('답변이 삭제되었습니다.');
      answerContent.value = '';
    }
  } catch (error) {
    console.error('Failed to delete answer:', error);
  }
};

onMounted(fetchCounselings);
</script>

<style scoped>
.counseling-management {
  padding: 20px;
}
</style>
