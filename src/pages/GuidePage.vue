<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">취업 가이드</div>
            <p>
              당신이 다시 일어설 수 있게 너겟이 함께해요.<br />
              구직 활동에 도움이 되는 내용들을 알려드릴게요.
            </p>
          </div>
          <div class="search-container">
            <q-input
              v-model="searchKeyword"
              placeholder="제목 검색"
              clearable
              dense
              outlined
              class="search-input"
              @input="handleSearch"
              @blur="validateSearch"
              @keyup.enter="validateSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <transition name="shake">
              <div v-if="searchWarning" class="search-warning">
                두 글자 이상 검색해주세요.
              </div>
            </transition>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="guides-container">
          <q-card
            v-for="guide in paginatedGuides"
            :key="guide.guideId"
            class="guide-card"
            @click="viewDetails(guide)"
            flat
            bordered
          >
            <q-card-section>
              <div class="guide-header">
                <div class="guide-title" :title="guide.title">
                  {{ guide.title }}
                </div>
                <div class="guide-meta">
                  <div class="guide-date">
                    {{ formatDate(guide.createdDate) }}
                  </div>
                  <div class="guide-author">작성자: 관리자</div>
                </div>
              </div>
              <div class="guide-content">
                {{ truncatedContent(guide.content) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="pagination-container">
          <PaginationControl
            :totalPages="pageCount"
            v-model="page"
            class="q-mt-md"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from 'boot/axios';
import { date } from 'quasar';
import { useRouter } from 'vue-router';
import PaginationControl from 'components/PaginationControl.vue';

const guides = ref([]);
const searchKeyword = ref('');
const searchWarning = ref(false);
const page = ref(1);
const itemsPerPage = 6;

const router = useRouter();

const fetchGuides = async () => {
  try {
    const response = await api.get('/job-guide');
    guides.value = response.data
      .map(guide => ({
        ...guide,
        contentSnippet: guide.content.slice(0, 100) + '...',
        username: '관리자',
      }))
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  } catch (error) {
    console.error('Failed to fetch job guides:', error);
  }
};

const filteredGuides = computed(() => {
  return guides.value.filter(guide => {
    if (searchKeyword.value.length < 2) return true;
    return guide.title.includes(searchKeyword.value);
  });
});

const paginatedGuides = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredGuides.value.slice(start, end).map((guide, index) => ({
    ...guide,
    index: start + index + 1,
  }));
});

const pageCount = computed(() =>
  Math.ceil(filteredGuides.value.length / itemsPerPage),
);

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

const truncatedContent = content => {
  const maxLength = 100;
  return content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;
};

const validateSearch = () => {
  if (searchKeyword.value.length > 0 && searchKeyword.value.length < 2) {
    searchWarning.value = true;
    setTimeout(() => {
      searchWarning.value = false;
    }, 2000);
  }
};

const handleSearch = () => {
  page.value = 1;
};

const viewDetails = guide => {
  router.push(`/guide/${guide.guideId}`);
};

onMounted(() => {
  fetchGuides();
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
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  max-width: 300px;
  margin-left: auto;
}

.search-input {
  max-width: 300px;
}

.search-warning {
  color: red;
  font-size: 0.75rem;
  margin-top: 5px;
  animation: shake 0.5s;
}

.guides-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.guide-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 200px;
  padding: 15px;
}

.guide-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
  background-color: rgba(230, 230, 230, 0.685);
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guide-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  max-width: 65%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.guide-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.guide-date {
  font-size: 0.85rem;
  color: gray;
}

.guide-author {
  margin-top: 5px;
  font-size: 0.75rem;
  color: gray;
}

.guide-content {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #555;
  max-height: 4.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}
</style>
