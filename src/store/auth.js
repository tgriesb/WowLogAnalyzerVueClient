import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoaded: false 
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async login(email, password) {
      const res = await fetch('/api/security/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        return false;
      }

      const meRes = await fetch('/api/security/me', {
        credentials: 'include'
      });

      if (!meRes.ok) {
        return false;
      }

      this.user = await meRes.json();
      return true;
    },
    
    async loadUser() {
      try {
        const res = await fetch('/api/security/me', { credentials: 'include' });
        if (res.ok) {
          this.user = await res.json();
        }
      } finally {
        this.isLoaded = true; 
      }
    },

    async logout() {
      await fetch('/api/security/logout', {
        method: 'POST',
        credentials: 'include'
      });

      this.user = null;
    }
  }
});