const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const authStore = {
  getToken: () => {
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
      return {
        access_token: localStorage.getItem(ACCESS_TOKEN_KEY),
        refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
        rememberMe: true,
      }
    } else if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
      return {
        access_token: sessionStorage.getItem(ACCESS_TOKEN_KEY),
        refresh_token: sessionStorage.getItem(REFRESH_TOKEN_KEY),
        rememberMe: false,
      }
    } else {
      return null
    }
  },

  setToken: (token, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage

    storage.setItem(ACCESS_TOKEN_KEY, token.access_token)
    storage.setItem(REFRESH_TOKEN_KEY, token.refresh_token)
  },

  removeToken: () => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem(ACCESS_TOKEN_KEY)
      storage.removeItem(REFRESH_TOKEN_KEY)
    }
  },
}

export default authStore
