<!-- <template>
  <div class="user-statistics">
    <q-tabs v-model="selectedTab" dense>
      <q-tab name="signups" label="회원가입 통계" />
      <q-tab name="logins" label="로그인 통계" />
    </q-tabs>

    <div v-if="selectedTab === 'signups'">
      <LineChart :chart-data="signupChartData" :options="chartOptions" />
    </div>
    <div v-if="selectedTab === 'logins'">
      <LineChart :chart-data="loginChartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue';
import { customApi } from 'boot/axios';
import { Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Define and rename Line component to avoid conflict
const LineChart = defineComponent({
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  template: `
    <Line :data="chartData" :options="options" />
  `,
});

export default {
  name: 'AdminUserStatistics',
  components: { LineChart },
  setup() {
    const selectedTab = ref('signups');
    const signupChartData = ref({});
    const loginChartData = ref({});
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    const fetchStatistics = async () => {
      try {
        const [signupResponse, loginResponse] = await Promise.all([
          customApi.get('/statistics/signups'),
          customApi.get('/statistics/logins'),
        ]);

        signupChartData.value = {
          labels: signupResponse.data.map(entry => entry.date),
          datasets: [
            {
              label: '회원가입 수',
              backgroundColor: '#42A5F5',
              data: signupResponse.data.map(entry => entry.count),
            },
          ],
        };

        loginChartData.value = {
          labels: loginResponse.data.map(entry => entry.date),
          datasets: [
            {
              label: '로그인 수',
              backgroundColor: '#66BB6A',
              data: loginResponse.data.map(entry => entry.count),
            },
          ],
        };
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    onMounted(fetchStatistics);

    return {
      selectedTab,
      signupChartData,
      loginChartData,
      chartOptions,
    };
  },
};
</script>

<style scoped>
.user-statistics {
  padding: 20px;
}
</style> -->
