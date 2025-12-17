export function useApi() {
  async function request(url, options = {}) {
    let response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json'
      }
    })

    // If access token is expired → backend returns 401
    if (response.status === 401) {

      // Try to refresh
      const refreshRes = await fetch('/api/security/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (refreshRes.ok) {
        // Refresh succeeded → retry original request
        response = await fetch(url, {
          ...options,
          credentials: 'include'
        })
      } else {
        // Refresh failed → user must log in again
        auth.logout()
        throw new Error("Unauthorized")
      }
    } else if (response.status === 204) {
      // No content
      return;
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    // Return data for successful requests
    return response.json()
  }

  return { request }
}