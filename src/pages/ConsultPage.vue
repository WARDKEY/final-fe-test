<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">상담하기</div>
        <p>상담 서비스를 이용해보세요.</p>
      </q-card-section>
      <q-card-section>
        <div class="consultation-form">
          <div class="type-selector">
            <q-btn-toggle
              v-model="selectedType"
              :options="typeOptions"
              color="light-blue-14"
              unelevated
              size="md"
            />
          </div>
          <div class="consultation-content">
            <p class="consultation-description">
              {{ descriptionText }}
            </p>
            <q-input
              v-model="consultationContent"
              type="textarea"
              placeholder="상담 내용을 자유롭게 적어주세요."
              filled
              class="content-input"
              rows="12"
            />
          </div>
          <div class="submit-button">
            <q-btn
              label="상담 신청"
              color="primary"
              @click="submitConsultation"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

// 상담 유형 및 내용
const selectedType = ref('일자리');
const consultationContent = ref('');

// 상담 유형 옵션
const typeOptions = [
  { label: '일자리', value: '일자리' },
  { label: '이력서 및 서류 작성', value: '이력서 및 서류 작성' },
  { label: '교육 신청', value: '교육 신청' },
  { label: '기타', value: '기타' },
];

// 상담 유형에 따른 설명 텍스트
const descriptionText = computed(() => {
  switch (selectedType.value) {
    case '일자리':
      return '일자리 상담을 선택 하셨군요! 너겟에게 원하는 구직 관련 서비스나 구직 시 어려움 등에 대해 상담해보세요!';
    case '이력서 및 서류 작성':
      return '이력서 및 서류 작성 관련 상담을 선택 하셨군요! 작성 팁, 문서 형식 등에 대해 도움을 받을 수 있습니다.';
    case '교육 신청':
      return '교육 신청 상담을 선택 하셨군요! 원하는 교육 과정이나 신청 절차 등에 대해 도움을 받을 수 있습니다.';
    case '기타':
      return '기타 상담을 선택 하셨군요! 기타 궁금한 사항이나 어려움을 상담해보세요. 너겟 서비스에 대한 솔직한 평가도 환영합니다.';
    default:
      return '';
  }
});

// 상담 신청 함수
const submitConsultation = () => {
  alert(
    `상담 유형: ${selectedType.value}\n상담 내용: ${consultationContent.value}`,
  );
};
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
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.consultation-form {
  display: flex;
  flex-direction: column;
}

.type-selector {
  margin-bottom: 20px;
}

.consultation-content {
  margin-bottom: 20px;
}

.consultation-description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
}

.content-input {
  width: 100%;
  min-height: 300px;
}

.submit-button {
  display: flex;
  justify-content: center;
}
</style>
