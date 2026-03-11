import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null }),
  actions: {
    setToken(t) { this.token = t; },
    clear() { this.token = null; }
  }
});

