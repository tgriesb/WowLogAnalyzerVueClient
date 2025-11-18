import { useAuthStore } from '../store/auth'

export function useApi() {
  const auth = useAuthStore()

  async function request(url, options = {}) {
    const headers = new Headers(options.headers || {})
    if (!auth.isAuthenticated) {
      console.log("Not authenticated")
      //auth.logout();
    }

    if (auth.token) {
      headers.set('Authorization', `Bearer ${auth.token}`)
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return response.json()
  }

  return { request }
}