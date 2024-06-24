<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">교육 찾기</div>
            <p>교육 정보를 확인하세요.</p>
          </div>
          <div class="search-container">
            <q-input
              v-model="searchKeyword"
              placeholder="강의명 검색"
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
          <div class="filters-container">
            <q-btn-toggle
              v-model="selectedFilter"
              :options="filterOptions"
              color="light-blue-14"
              size="md"
              unelevated
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-expansion-item
            v-for="course in paginatedCourses"
            :key="course.courseNm"
            class="q-mb-sm"
          >
            <template v-slot:header>
              <div class="course-header">
                <div>
                  <strong>{{ course.courseNm }}</strong>
                  <q-item-label caption class="dept-gu">
                    {{ course.deptNm }} - {{ course.gu }}
                  </q-item-label>
                </div>
                <q-chip
                  :color="getStatusColor(course.courseRequestEndDt)"
                  outline
                  class="status-chip"
                >
                  {{ getStatus(course.courseRequestEndDt) }}
                </q-chip>
              </div>
            </template>
            <q-item-section>
              <q-item-label caption>
                신청 기간: {{ formatDate(course.courseRequestStrDt) }} ~
                {{ formatDate(course.courseRequestEndDt) }}
              </q-item-label>
              <q-item-label caption>
                교육 기간: {{ formatDate(course.courseStrDt) }} ~
                {{ formatDate(course.courseEndDt) }}
              </q-item-label>
              <q-item-label caption>정원: {{ course.capacity }}</q-item-label>
              <q-btn
                :href="course.courseApplyUrl"
                label="더 알아보고 신청하기"
                target="_blank"
                color="blue-grey-6"
                class="q-mt-sm full-width"
              />
            </q-item-section>
          </q-expansion-item>
        </q-list>
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
import { ref, computed, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { date } from 'quasar';
import PaginationControl from 'components/PaginationControl.vue';

const courses = ref([]);
const searchKeyword = ref('');
const selectedFilter = ref('모집 중');
const page = ref(1);
const itemsPerPage = 10;
const searchWarning = ref(false);

const filterOptions = [
  { label: '모집 중', value: '모집 중' },
  { label: '모집 마감', value: '모집 마감' },
  { label: '모집 마감 임박 순', value: '모집 마감 임박 순' },
];

const fetchCourses = async () => {
  try {
    const response = await api.get('/education');
    courses.value = response.data;
  } catch (error) {
    console.error('Failed to fetch education data:', error);
  }
};

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCoursesByStatus.value.slice(start, end);
});

const filteredCoursesByStatus = computed(() => {
  return courses.value
    .filter(course => {
      if (selectedFilter.value === '모집 중') {
        return getStatus(course.courseRequestEndDt) === '모집 중';
      }
      if (selectedFilter.value === '모집 마감') {
        return getStatus(course.courseRequestEndDt) === '모집 마감';
      }
      if (selectedFilter.value === '모집 마감 임박 순') {
        return getStatus(course.courseRequestEndDt) === '모집 중';
      }
      return true;
    })
    .filter(course => {
      if (searchKeyword.value.length < 2) return true;
      return course.courseNm.includes(searchKeyword.value);
    })
    .sort((a, b) => {
      if (selectedFilter.value === '모집 마감 임박 순') {
        const dateA = date.extractDate(a.courseRequestEndDt, 'YYYYMMDD');
        const dateB = date.extractDate(b.courseRequestEndDt, 'YYYYMMDD');
        return dateA - dateB;
      }
      return 0;
    });
});

const pageCount = computed(() =>
  Math.ceil(filteredCoursesByStatus.value.length / itemsPerPage),
);

const formatDate = dateString => {
  if (!dateString) return '';
  const dateObj = date.extractDate(dateString, 'YYYYMMDD');
  return date.formatDate(dateObj, 'YYYY-MM-DD');
};

const getStatus = endDate => {
  const today = new Date();
  const end = date.extractDate(endDate, 'YYYYMMDD');
  return today > end ? '모집 마감' : '모집 중';
};

const getStatusColor = endDate => {
  return getStatus(endDate) === '모집 마감' ? 'grey' : 'green';
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

onMounted(() => {
  fetchCourses();
});

watch(searchKeyword, newKeyword => {
  if (newKeyword.length >= 2) {
    page.value = 1;
  }
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
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.filters-container {
  display: flex;
  align-items: center;
}

.search-container {
  position: relative;
  max-width: 300px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.dept-gu {
  font-size: 0.85rem;
}

.status-chip {
  font-size: 0.85rem;
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
