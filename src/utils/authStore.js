const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LAST_MAP_VIEW_KEY = 'lastMapView'

const getStorageInfo = () => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return {
      storage: localStorage,
      rememberMe: true,
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    }
  } else if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    return {
      storage: sessionStorage,
      rememberMe: false,
      accessToken: sessionStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: sessionStorage.getItem(REFRESH_TOKEN_KEY),
    }
  } else {
    return {
      storage: null,
      rememberMe: false,
      accessToken: null,
      refreshToken: null,
    }
  }
}

const authStore = {
  getToken: () => {
    const { accessToken, refreshToken } = getStorageInfo()
    if (accessToken && refreshToken) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      }
    }
    return null
  },

  getAccessToken: () => {
    const { accessToken } = getStorageInfo()
    return accessToken
  },

  getRefreshToken: () => {
    const { refreshToken } = getStorageInfo()
    return refreshToken
  },

  setNewToken: (token, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage

    storage.setItem(ACCESS_TOKEN_KEY, token.access_token)
    storage.setItem(REFRESH_TOKEN_KEY, token.refresh_token)
  },

  renewToken: (token) => {
    const { storage } = getStorageInfo()
    if (storage) {
      storage.setItem(ACCESS_TOKEN_KEY, token.access_token)
      storage.setItem(REFRESH_TOKEN_KEY, token.refresh_token)
    }
  },

  getLastMapView: () => {
    const { rememberMe } = getStorageInfo()
    if (rememberMe) {
      const stored = localStorage.getItem(LAST_MAP_VIEW_KEY)
      return stored ? JSON.parse(stored) : null
    }
    return null
  },

  setLastMapView: (mapView) => {
    const { rememberMe } = getStorageInfo()
    if (rememberMe) {
      localStorage.setItem(LAST_MAP_VIEW_KEY, JSON.stringify(mapView))
    }
  },

  removeToken: () => {
    const { rememberMe } = getStorageInfo()
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
  },
}

export default authStore
