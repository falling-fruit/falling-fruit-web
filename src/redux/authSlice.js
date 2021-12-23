import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUser, getUserToken, instance } from '../utils/api'

const AUTH_TOKEN_KEY = 'authToken'

export const fetchToken = createAsyncThunk(
  'users/fetchToken',
  async ({ email, password, rememberMe }) => {
    const token = await getUserToken(email, password)

    if (rememberMe) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    }

    instance.defaults.headers.common.Authorization = `Bearer ${token.access_token}`
    const user = await getUser()

    return { token, user }
  },
)

const initialState = {
  user: null,
  authToken: null,
  rememberMe: false,
  failedLogin: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: {
      reducer: (state) => {
        state.user = null
        state.authToken = null
      },
      prepare: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        sessionStorage.removeItem(AUTH_TOKEN_KEY)
        delete instance.defaults.headers.common.Authorization

        return {}
      },
    },
    login: {
      reducer: (state, action) => {
        const { localAuthToken, sessionAuthToken } = action
        state.authToken = localAuthToken ?? sessionAuthToken
      },
      prepare: () => {
        const localAuthToken = localStorage.getItem(AUTH_TOKEN_KEY)
        const sessionAuthToken = sessionStorage.getItem(AUTH_TOKEN_KEY)

        return {
          localAuthToken,
          sessionAuthToken,
        }
      },
    },
  },
  extraReducers: {
    [fetchToken.fulfilled]: (state, { payload }) => {
      const { token, user } = payload

      state.user = user
      state.authToken = token
      state.failedLogin = false
    },
    [fetchToken.rejected]: (state) => {
      state.failedLogin = true
    },
  },
})

export const { logout, login } = authSlice.actions
export default authSlice.reducer
