<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">일자리 찾기</div>
            <p>일자리 공고를 확인하세요.</p>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="filters">
          <!-- 직종 필터 버튼 -->
          <q-btn-dropdown
            :label="jobFilterLabel"
            class="filter-btn"
            ref="jobDropdown"
          >
            <q-list>
              <q-item clickable @click="applyJobFilter(null)">
                <q-item-section>전체</q-item-section>
              </q-item>
              <q-item
                clickable
                v-for="(name, code) in jobCategories"
                :key="code"
                @click="applyJobFilter(code)"
              >
                <q-item-section>{{ name }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 위치 필터 버튼 -->
          <q-btn-dropdown
            :label="locationFilterLabel"
            class="filter-btn"
            ref="locationDropdown"
          >
            <q-list>
              <q-item clickable @click="applyLocationFilter(null)">
                <q-item-section>전체</q-item-section>
              </q-item>
              <q-item
                clickable
                v-for="location in locationFilters"
                :key="location"
                @click="applyLocationFilter(location)"
              >
                <q-item-section>{{ location }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 구인 상태 필터 버튼 -->
          <q-btn-dropdown
            :label="statusFilterLabel"
            class="filter-btn"
            ref="statusDropdown"
          >
            <q-list>
              <q-item clickable @click="applyStatusFilter('전체')">
                <q-item-section>전체</q-item-section>
              </q-item>
              <q-item clickable @click="applyStatusFilter('구인 중')">
                <q-item-section>구인 중</q-item-section>
              </q-item>
              <q-item clickable @click="applyStatusFilter('구인 마감')">
                <q-item-section>구인 마감</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="job-listings">
          <template v-if="paginatedPosts.length > 0">
            <q-card
              v-for="post in paginatedPosts"
              :key="post.postId"
              class="job-card"
              clickable
              @click="viewDetails(post)"
            >
              <q-card-section class="job-card-section">
                <q-img src="/images/job-placeholder.jpg" class="job-image"/>
                <div class="job-info">
                  <q-item-label class="job-title">{{ post.joSj }}</q-item-label>
                  <q-item-label caption>{{ post.cmpnyNm }}</q-item-label>
                  <div class="job-details">
                    <q-item-label caption>
                      <q-icon name="place"/>
                      {{ post.gu }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-icon name="work"/>
                      {{ post.careerCndNm }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-icon name="school"/>
                      {{ post.acdmcrNm }}
                    </q-item-label>
                  </div>
                </div>
                <div class="job-actions">
                  <q-icon
                    :name="post.isBookmarked ? 'bookmark' : 'bookmark_border'"
                    :color="post.isBookmarked ? 'red-5' : 'grey'"
                    @click.stop="toggleBookmark(post)"
                    class="bookmark-icon"
                  />
                  <q-badge
                    :color="getStatusColor(post.rceptClosNm)"
                    outline
                    class="status-badge"
                  >
                    <q-item-label>{{
                        getRecruitmentStatus(post.rceptClosNm)
                      }}
                    </q-item-label>
                  </q-badge>
                </div>
              </q-card-section>
            </q-card>
          </template>
          <div v-else class="no-results">
            원하시는 조건에 맞는 공고가 없습니다. 다른 조건을 선택해보세요.
          </div>
        </div>
        <pagination-control
          v-if="totalPages > 0"
          :total-pages="totalPages"
          v-model="page"
          @update:model-value="updatePagination"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useQuasar} from 'quasar';
import {api, customApi} from 'boot/axios';
import {useAuthStore} from 'stores/authStore';
import {isAfter, parseISO} from 'date-fns';
import PaginationControl from 'components/PaginationControl.vue';

export default {
  components: {
    PaginationControl,
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const posts = ref([]);
    const filteredData = ref([]);
    const page = ref(parseInt(route.query.page) || 1);
    const itemsPerPage = 12;
    const totalPages = computed(() =>
      Math.ceil(filteredData.value.length / itemsPerPage),
    );
    const authStore = useAuthStore();

    const jobCategories = ref({
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
    });

    const locationFilters = ref([
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
    ]);

    const statusFilters = ref(['전체', '구인 중', '구인 마감']);

    const selectedJobCategory = ref(null);
    const selectedLocation = ref(null);
    const selectedStatus = ref('전체');

    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        if (Array.isArray(response.data)) {
          posts.value = response.data;
          filterPosts(); // 데이터를 가져온 후 필터링
          await checkBookmarks();
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to fetch job listings',
        });
      }
    };

    const checkBookmarks = async () => {
      if (!authStore.isLoggedIn) {
        posts.value.forEach(post => post.isBookmarked = false)
        return
      }

      for (const post of posts.value) {
        if (!authStore.isLoggedIn) {
          // 로그인 상태가 아니라면 중지
          post.isBookmarked = false;
          continue;
        }

        try {
          const response = await customApi.get(`/bookmark/${post.postId}`);
          post.isBookmarked = response.data;
        } catch (error) {
          post.isBookmarked = false;
        }
      }
    };

    const getRecruitmentStatus = rceptClosNm => {
      const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/);
      if (!dateMatch) return '확인 필요';
      const closeDate = parseISO(dateMatch[0]);
      return isAfter(closeDate, new Date()) ? '구인 중' : '구인 마감';
    };

    const getStatusColor = rceptClosNm => {
      return getRecruitmentStatus(rceptClosNm) === '구인 마감'
        ? 'grey'
        : 'green';
    };

    const filterPosts = () => {
      // 전체 데이터를 기준으로 필터링 적용
      filteredData.value = posts.value.filter(post => {
        const matchesJob =
          selectedJobCategory.value === null ||
          String(post.jobCode) === String(selectedJobCategory.value);
        const matchesLocation =
          selectedLocation.value === null || post.gu === selectedLocation.value;
        const matchesStatus =
          selectedStatus.value === '전체' ||
          getRecruitmentStatus(post.rceptClosNm) === selectedStatus.value;
        return matchesJob && matchesLocation && matchesStatus;
      });
    };

    const paginatedPosts = computed(() => {
      // 필터링된 데이터를 기준으로 페이지네이션 적용
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredData.value.slice(start, end);
    });

    const viewDetails = post => {
      router.push({
        name: 'JobPostDetails',
        params: {postId: post.postId},
        query: {page: page.value},
      });
    };

    const toggleBookmark = async post => {
      if (!authStore.isLoggedIn) {
        $q.notify('로그인이 필요합니다');
        return;
      }
      try {
        await customApi.post(`/bookmark/${post.postId}`);
        post.isBookmarked = !post.isBookmarked;
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        $q.notify({
          type: 'negative',
          message: '북마크를 토글하는 중 오류가 발생했습니다.',
        });
      }
    };

    const applyJobFilter = code => {
      selectedJobCategory.value = code;
      page.value = 1; // 필터 선택하면 1페이지로 이동함요
      filterPosts();
      $refs.jobDropdown.hide();
    };

    const applyLocationFilter = location => {
      selectedLocation.value = location;
      page.value = 1;
      filterPosts();
      $refs.locationDropdown.hide();
    };

    const applyStatusFilter = status => {
      selectedStatus.value = status;
      page.value = 1;
      filterPosts();
      $refs.statusDropdown.hide();
    };

    watch(page, (newPage) => {
      router.push({query: {...route.query, page: newPage}}).catch(() => {
      });
      if (posts.value.length) {
        filterPosts(); // 페이지가 변경될 때도 필터링 업데이트
      } else {
        fetchPosts(); // 처음 데이터를 가져올 때
      }
    });

    // 로그인 상태가 변경될 때 체크하기 위한 watch
    watch(
      () => authStore.isLoggedIn,
      async newVal => {
        if (newVal) {
          await checkBookmarks();
        } else {
          posts.value.forEach(post => (post.isBookmarked = false));
        }
      },
    );

    onMounted(fetchPosts);

    return {
      posts,
      page,
      totalPages,
      paginatedPosts,
      fetchPosts,
      viewDetails,
      toggleBookmark,
      getRecruitmentStatus,
      getStatusColor,
      applyJobFilter,
      applyLocationFilter,
      applyStatusFilter,
      jobCategories,
      locationFilters,
      statusFilters,
      updatePagination: fetchPosts, // 페이지네이션 컨트롤에서 페이지 변경 시 fetchPosts 호출
      jobFilterLabel: computed(() =>
        selectedJobCategory.value !== null
          ? jobCategories.value[selectedJobCategory.value]
          : '직군 선택',
      ),
      locationFilterLabel: computed(() =>
        selectedLocation.value !== null ? selectedLocation.value : '위치 선택',
      ),
      statusFilterLabel: computed(() =>
        selectedStatus.value !== '전체' ? selectedStatus.value : '구인 상태',
      ),
    };
  },
  // 페이지가 로드되기 전과 업데이트 될 때 쿼리 파라미터를 이용해 상태를 복원
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.page) {
        vm.page = parseInt(to.query.page);
      }
      vm.fetchPosts();
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.page) {
      this.page = parseInt(to.query.page);
    }
    this.fetchPosts();
    next();
  },
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
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  flex: 1;
}

.job-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.job-card {
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  cursor: pointer;
  overflow: hidden;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.job-card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.job-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.job-info {
  padding: 10px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.job-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.job-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bookmark-icon {
  cursor: pointer;
  font-size: 1.5rem;
}

.status-badge {
  margin-top: 10px;
}

.job-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.2rem;
  color: #999;
  padding: 20px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .job-card {
    width: 100%;
  }

  .job-title {
    font-size: 0.9rem;
  }
}
</style>
