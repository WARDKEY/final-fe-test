<template>
  <q-page class="upload-page">
    <div class="upload-container">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-center">이미지 업로드</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="uploadImage" class="upload-form">
            <!-- 기본 파일 입력 필드 (보이지 않음) -->
            <input
              type="file"
              ref="fileInput"
              class="file-input"
              @change="previewImage"
            />
            <!-- 파일 선택 버튼 -->
            <q-btn
              color="primary"
              label="이미지 파일 선택"
              @click="openFilePicker"
              icon="attach_file"
              class="q-mb-md"
            />
            <!-- 미리보기 이미지 -->
            <img
              :src="imagePreview"
              v-if="imagePreview"
              class="image-preview q-mt-md"
            />
            <q-btn
              type="submit"
              label="이미지 업로드"
              color="primary"
              class="q-mt-md full-width"
            />
          </q-form>
        </q-card-section>
      </q-card>

      <q-card v-if="uploadedImages.length" class="q-mt-md">
        <q-card-section>
          <div class="text-h5 text-center">업로드된 이미지</div>
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="uploaded-image-container"
          >
            <img :src="image" class="uploaded-image q-mt-md" />
            <q-btn
              color="negative"
              label="삭제"
              icon="delete"
              class="q-mt-sm"
              @click="deleteImage(index)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 이미지 업로드 및 미리보기 상태
const fileInput = ref(null);
const imagePreview = ref(null);
const uploadedImages = ref([]);

// 파일 선택 다이얼로그 열기
const openFilePicker = () => {
  fileInput.value.click();
};

// 이미지 미리보기
const previewImage = () => {
  const file = fileInput.value.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = null;
  }
};

// 이미지 업로드
const uploadImage = () => {
  const file = fileInput.value.files[0];
  if (!file) {
    alert('이미지 파일을 선택해주세요.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    // 로컬 스토리지에 저장
    uploadedImages.value.push(base64String);
    localStorage.setItem(
      'uploadedImages',
      JSON.stringify(uploadedImages.value),
    );
    imagePreview.value = null;
    fileInput.value.value = null; // 파일 입력 필드 초기화
    alert('이미지가 성공적으로 업로드되었습니다.');
  };
  reader.readAsDataURL(file);
};

// 이미지 삭제
const deleteImage = index => {
  uploadedImages.value.splice(index, 1);
  localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages.value));
};

// 페이지 로드 시 로컬 스토리지에서 이미지 로드
onMounted(() => {
  const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
  uploadedImages.value = storedImages;
});
</script>

<style scoped>
.upload-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f8f9fa;
}

.upload-container {
  width: 100%;
  max-width: 500px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input {
  display: none;
}

.image-preview {
  margin-top: 10px;
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.uploaded-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.uploaded-image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.uploaded-image-container img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.uploaded-image-container .q-btn {
  margin-top: 5px;
}
</style>
