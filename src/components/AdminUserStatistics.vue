<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">사용자 통계</div>
        <canvas ref="chartCanvas" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios'; // API 인스턴스 불러오기
import { useAuthStore } from 'stores/authStore'; // 인증 스토어 불러오기
import { Chart } from 'chart.js/auto'; // Chart.js import
import 'chartjs-adapter-date-fns'; // Date-fns 어댑터
const chartCanvas = ref(null); // 차트 캔버스 참조
const chartInstance = ref(null); // 차트 인스턴스 참조
const fetchAndDisplayChart = async () => {
  const authStore = useAuthStore(); // 인증 스토어 사용
  try {
    if (!authStore.isLoggedIn) {
      console.error('User is not logged in.');
      return;
    }
    const response = await customApi.get('/admin/users');
    const users = response.data;
    // 날짜별 회원 가입 수 집계
    const signUpCounts = {};
    users.forEach(user => {
      if (!user.createdDate) return; // createdDate가 없으면 건너뜁니다.
      const date = user.createdDate.split('T')[0]; // 날짜 부분만 추출
      if (signUpCounts[date]) {
        signUpCounts[date]++;
      } else {
        signUpCounts[date] = 1;
      }
    });
    // 라벨과 데이터 생성
    const labels = Object.keys(signUpCounts).sort();
    const data = labels.map(label => signUpCounts[label]);
    // 기존 차트가 있으면 파괴합니다.
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
    // 새로운 차트를 생성합니다.
    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '일일 회원 가입 수',
            backgroundColor: 'rgba(66, 165, 245, 0.6)',
            borderColor: 'rgba(66, 165, 245, 1)',
            borderWidth: 1,
            data,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: '일일 회원 가입 수',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'yyyy-MM-dd',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
  }
};
onMounted(fetchAndDisplayChart);
</script>
<style scoped>
.user-statistics {
  padding: 20px;
}
</style>
