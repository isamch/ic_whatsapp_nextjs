import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth'
import { refreshApi } from './auth-api'

const BASE_URL = '/api'

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  const data = await refreshApi(refreshToken)
  saveTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.accessToken
}

function redirectToLogin() {
  clearTokens()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

async function request(method, path, body) {
  let token = getAccessToken()

  let res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  })

  if (res.status === 401) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise

      res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        ...(body && { body: JSON.stringify(body) }),
      })

    } catch (err) {
      redirectToLogin()
      throw new Error('Session expired')
    }
  }

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed')
    err.status = res.status
    throw err
  }

  return data
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}

export default api