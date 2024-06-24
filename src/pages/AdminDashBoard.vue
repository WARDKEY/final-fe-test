<template>
  <q-page class="admin-dashboard">
    <q-tabs v-model="selectedTab" dense>
      <q-tab name="userManagement" label="사용자 관리" />
      <q-tab name="userStatistics" label="이용자 통계" />
      <q-tab name="counselingManagement" label="상담 관리" />
      <q-tab name="jobGuideManagement" label="취업 가이드 관리" />
    </q-tabs>

    <div v-if="selectedTab === 'userManagement'">
      <AdminUserManagement />
    </div>
    <div v-if="selectedTab === 'userStatistics'">
      <AdminUserStatistics />
    </div>
    <div v-if="selectedTab === 'counselingManagement'">
      <AdminCounselingManagement />
    </div>
    <div v-if="selectedTab === 'jobGuideManagement'">
      <AdminJobGuideManagement />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import AdminUserManagement from 'components/AdminUserManagement.vue';
import AdminUserStatistics from 'components/AdminUserStatistics.vue';
import AdminCounselingManagement from 'components/AdminCounselingManagement.vue';
import AdminJobGuideManagement from 'components/AdminJobGuideManagement.vue';

const selectedTab = ref('userManagement');
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
</style>
