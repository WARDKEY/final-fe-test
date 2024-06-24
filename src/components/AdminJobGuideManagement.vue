<template>
  <div class="job-guide-management">
    <q-table
      :rows="jobGuides"
      :columns="columns"
      row-key="guideId"
      @row-click="openJobGuideDialog"
    />
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">취업 가이드</div>
          <q-input v-model="selectedJobGuide.title" label="제목" outlined />
          <q-input
            v-model="selectedJobGuide.content"
            label="내용"
            type="textarea"
            outlined
          />
          <q-btn label="저장" color="primary" @click="saveJobGuide" />
          <q-btn label="삭제" color="negative" @click="deleteJobGuide" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';

const jobGuides = ref([]);
const selectedJobGuide = ref(null);
const isDialogOpen = ref(false);

const columns = [
  {
    name: 'guideId',
    required: true,
    label: '가이드 ID',
    align: 'left',
    field: row => row.guideId,
  },
  { name: 'title', label: '제목', align: 'left', field: row => row.title },
  {
    name: 'createdDate',
    label: '작성일',
    align: 'left',
    field: row => row.createdDate,
  },
];

const fetchJobGuides = async () => {
  try {
    const response = await customApi.get('/job-guide');
    jobGuides.value = response.data;
  } catch (error) {
    console.error('Failed to fetch job guides:', error);
  }
};

const openJobGuideDialog = row => {
  selectedJobGuide.value = row;
  isDialogOpen.value = true;
};

const saveJobGuide = async () => {
  try {
    if (selectedJobGuide.value) {
      await customApi.put(`/job-guide/${selectedJobGuide.value.guideId}`, {
        title: selectedJobGuide.value.title,
        content: selectedJobGuide.value.content,
      });
      alert('취업 가이드가 저장되었습니다.');
      fetchJobGuides(); // Refresh list
    }
  } catch (error) {
    console.error('Failed to save job guide:', error);
  }
};

const deleteJobGuide = async () => {
  try {
    if (selectedJobGuide.value) {
      await customApi.delete(`/job-guide/${selectedJobGuide.value.guideId}`);
      alert('취업 가이드가 삭제되었습니다.');
      fetchJobGuides(); // Refresh list
    }
  } catch (error) {
    console.error('Failed to delete job guide:', error);
  }
};

onMounted(fetchJobGuides);
</script>

<style scoped>
.job-guide-management {
  padding: 20px;
}
</style>
