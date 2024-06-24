import {defineStore} from 'pinia';
import {api} from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    role: '',
    accessToken: '',
    refreshToken: '',
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          this.setAuthData(response.data);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.clearAuthData();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    setAuthData({username, role, accessToken, refreshToken}) {
      this.isLoggedIn = true;
      this.username = username;
      this.role = role;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },

    clearAuthData() {
      this.isLoggedIn = false;
      this.username = '';
      this.role = '';
      this.accessToken = '';
      this.refreshToken = '';
    },

    initializeAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (isLoggedIn && username && role && accessToken && refreshToken) {
        this.setAuthData({
          username, // 초기화 필요
          role, // 초기화 필요
          accessToken,
          refreshToken
          // isActive: '', // 초기화 필요
        });
      } else {
        this.clearAuthData();
      }
    },
  },
});
