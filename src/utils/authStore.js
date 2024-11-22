const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

let accessToken = null
let refreshToken = null
let rememberMe = null

const authStore = {
  initFromStorage: () => {
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
      rememberMe = true
      return {
        access_token: localStorage.getItem(ACCESS_TOKEN_KEY),
        refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
      }
    } else if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
      rememberMe = false
      return {
        access_token: sessionStorage.getItem(ACCESS_TOKEN_KEY),
        refresh_token: sessionStorage.getItem(REFRESH_TOKEN_KEY),
      }
    } else {
      return null
    }
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

  removeToken: () => {
    if (rememberMe) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
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
