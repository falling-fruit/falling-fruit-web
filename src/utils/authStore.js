const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LAST_MAP_VIEW_KEY = 'lastMapView'

let accessToken = null
let refreshToken = null
let rememberMe = null

const initFromStorage = () => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
    rememberMe = true
    accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  } else if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    rememberMe = false
    accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
  } else {
    rememberMe = false
  }
}

const authStore = {
  getToken: () => {
    if (rememberMe === null) {
      initFromStorage()
    }
    if (accessToken && refreshToken) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      }
    }
    return null
  },

  getAccessToken: () => accessToken,

  getRefreshToken: () => refreshToken,

  setRememberMe: (remember) => {
    rememberMe = remember
  },

  setToken: (token) => {
    const storage = rememberMe ? localStorage : sessionStorage

    accessToken = token.access_token
    refreshToken = token.refresh_token

    storage.setItem(ACCESS_TOKEN_KEY, token.access_token)
    storage.setItem(REFRESH_TOKEN_KEY, token.refresh_token)
  },

  getLastMapView: () => {
    if (rememberMe === null) {
      initFromStorage()
    }
    if (rememberMe) {
      const stored = localStorage.getItem(LAST_MAP_VIEW_KEY)
      return stored ? JSON.parse(stored) : null
    }
    return null
  },

  setLastMapView: (mapView) => {
    if (rememberMe) {
      localStorage.setItem(LAST_MAP_VIEW_KEY, JSON.stringify(mapView))
    }
  },

  removeToken: () => {
    if (rememberMe) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(LAST_MAP_VIEW_KEY)
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    }

    accessToken = null
    refreshToken = null
    rememberMe = null
  },
}

export default authStore
