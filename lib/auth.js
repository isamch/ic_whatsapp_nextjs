const ACCESS_TOKEN_KEY  = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY          = 'crm_user'

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY,  accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const getAccessToken  = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) }
  catch { return null }
}

export const isAuthenticated = () => !!localStorage.getItem(ACCESS_TOKEN_KEY)
