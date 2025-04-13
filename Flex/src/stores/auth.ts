import { defineStore } from 'pinia';
import { loginToFrappe, logoutFromFrappe, getFrappeAuth } from '../utils/frappe';

interface User {
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        await loginToFrappe(username, password);
        const user = await getFrappeAuth();
        if (user) {
          this.user = user;
          this.isAuthenticated = true;
        }
      } catch (error) {
        throw new Error('Authentication failed');
      }
    },

    async logout() {
      try {
        await logoutFromFrappe();
        this.user = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    async checkAuth() {
      try {
        const user = await getFrappeAuth();
        if (user) {
          this.user = user;
          this.isAuthenticated = true;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }
  }
});