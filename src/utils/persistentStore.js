import { Preferences } from '@capacitor/preferences'

const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LAST_MAP_VIEW_KEY = 'lastMapView'
const LANGUAGE_KEY = 'language'
const SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY = 'skipNotSignedInClickthrough'

let throttleTimer = null

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

const persistentStore = {
  initialise: async () => {
    try {
      const keys = [
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        LAST_MAP_VIEW_KEY,
        LANGUAGE_KEY,
        SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY,
      ]

      for (const key of keys) {
        const { value } = await Preferences.get({ key })
        if (value !== null) {
          localStorage.setItem(key, value)
        }
      }
    } catch (error) {
      console.error('Failed to initialize DurableAuthStore:', error)
    }
  },

  hasTokens: () => {
    const { accessToken, refreshToken } = getStorageInfo()
    return accessToken && refreshToken
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

    if (rememberMe) {
      setTimeout(async () => {
        try {
          await Preferences.set({
            key: ACCESS_TOKEN_KEY,
            value: token.access_token,
          })
          await Preferences.set({
            key: REFRESH_TOKEN_KEY,
            value: token.refresh_token,
          })
        } catch (error) {
          console.error(
            'Failed to persist tokens to Capacitor Preferences:',
            error,
          )
        }
      }, 0)
    }
  },

  renewToken: (token) => {
    const { storage, rememberMe } = getStorageInfo()
    if (storage) {
      storage.setItem(ACCESS_TOKEN_KEY, token.access_token)
      storage.setItem(REFRESH_TOKEN_KEY, token.refresh_token)

      if (rememberMe) {
        setTimeout(async () => {
          try {
            await Preferences.set({
              key: ACCESS_TOKEN_KEY,
              value: token.access_token,
            })
            await Preferences.set({
              key: REFRESH_TOKEN_KEY,
              value: token.refresh_token,
            })
          } catch (error) {
            console.error(
              'Failed to persist renewed tokens to Capacitor Preferences:',
              error,
            )
          }
        }, 0)
      }
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

  setLastMapViewImmediateSync: (mapView) => {
    const { rememberMe } = getStorageInfo()
    if (rememberMe) {
      const value = JSON.stringify(mapView)
      localStorage.setItem(LAST_MAP_VIEW_KEY, value)

      setTimeout(async () => {
        try {
          await Preferences.set({ key: LAST_MAP_VIEW_KEY, value })
        } catch (error) {
          console.error(
            'Failed to persist map view to Capacitor Preferences:',
            error,
          )
        }
      }, 0)
    }
  },

  setLastMapViewThrottledSync: (mapView) => {
    const { rememberMe } = getStorageInfo()
    if (rememberMe) {
      const value = JSON.stringify(mapView)
      localStorage.setItem(LAST_MAP_VIEW_KEY, value)

      if (throttleTimer) {
        clearTimeout(throttleTimer)
      }

      throttleTimer = setTimeout(async () => {
        try {
          await Preferences.set({ key: LAST_MAP_VIEW_KEY, value })
        } catch (error) {
          console.error(
            'Failed to persist map view to Capacitor Preferences:',
            error,
          )
        }
        throttleTimer = null
      }, 10000)
    }
  },

  getLanguage: () => localStorage.getItem(LANGUAGE_KEY),

  setLanguage: (language) => {
    localStorage.setItem(LANGUAGE_KEY, language)

    setTimeout(async () => {
      try {
        await Preferences.set({ key: LANGUAGE_KEY, value: language })
      } catch (error) {
        console.error(
          'Failed to persist language to Capacitor Preferences:',
          error,
        )
      }
    }, 0)
  },

  removeLanguage: () => {
    localStorage.removeItem(LANGUAGE_KEY)

    setTimeout(async () => {
      try {
        await Preferences.remove({ key: LANGUAGE_KEY })
      } catch (error) {
        console.error(
          'Failed to remove language from Capacitor Preferences:',
          error,
        )
      }
    }, 0)
  },

  getSkipNotSignedInClickthrough: () => localStorage.getItem(SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY) === 'true',

  setSkipNotSignedInClickthrough: (skip) => {
    const value = skip ? 'true' : 'false'
    localStorage.setItem(SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY, value)

    setTimeout(async () => {
      try {
        await Preferences.set({
          key: SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY,
          value,
        })
      } catch (error) {
        console.error(
          'Failed to persist skip clickthrough to Capacitor Preferences:',
          error,
        )
      }
    }, 0)
  },

  removeTokens: () => {
    const { rememberMe } = getStorageInfo()
    if (rememberMe) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(LAST_MAP_VIEW_KEY)
      localStorage.removeItem(LANGUAGE_KEY)
      localStorage.removeItem(SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY)
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)

      setTimeout(async () => {
        try {
          await Preferences.remove({ key: ACCESS_TOKEN_KEY })
          await Preferences.remove({ key: REFRESH_TOKEN_KEY })
          await Preferences.remove({ key: LAST_MAP_VIEW_KEY })
          await Preferences.remove({ key: LANGUAGE_KEY })
          await Preferences.remove({ key: SKIP_NOT_SIGNED_IN_CLICKTHROUGH_KEY })
        } catch (error) {
          console.error(
            'Failed to remove tokens from Capacitor Preferences:',
            error,
          )
        }
      }, 0)
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  },
}

export default persistentStore
