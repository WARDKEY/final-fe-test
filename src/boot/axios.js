import {boot} from 'quasar/wrappers';
import axios from 'axios';
import {useAuthStore} from "stores/authStore";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({baseURL: 'http://localhost:8080/api/v1'});

const customApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

customApi.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

customApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // 토큰 만료 오류 처리
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh Token으로 새로운 Access Token 발급 요청
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/user/refresh-token', {
          'refreshToken': refreshToken
        });

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          customApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return customApi(originalRequest);
        }
      } catch (error) {
        authStore.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export {api, customApi};
