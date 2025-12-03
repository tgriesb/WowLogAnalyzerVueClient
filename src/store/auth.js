import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    tokenExpiry: localStorage.getItem('tokenExpiry') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.token &&
          !!state.tokenExpiry &&
          (new Date(state.tokenExpiry)) > (new Date())
    }
  },

  actions: {
    async login(email, password) {
      try {
        const res = await fetch('/api/security/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) throw new Error('Invalid credentials')
        const data = await res.json()
        await this.storeJwt(data.token, data.user, data.expireMinutes)
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async storeJwt(token, user, expireMinutes) {
      let expireDate = new Date()
      expireDate.setMinutes(expireDate.getMinutes() + (parseInt(expireMinutes) - 1));
      this.token = token
      this.user = user
      this.tokenExpiry = expireDate.toString()

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('tokenExpiry', this.tokenExpiry)
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('tokenExpiry')
    },
  },
})