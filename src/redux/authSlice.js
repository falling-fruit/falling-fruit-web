import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUser, getUserToken, instance } from '../utils/api'

const AUTH_TOKEN_KEY = 'authToken'

export const fetchToken = createAsyncThunk(
  'users/fetchToken',
  async ({ email, password, rememberMe }) => {
    const response = await getUserToken(email, password)

    if (rememberMe) {
      localStorage.setItem(AUTH_TOKEN_KEY, response)
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, response)
    }

    instance.defaults.headers.common.Authorization = `Bearer ${response.access_token}`
    const user = await getUser()

    return { token: response, user }
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
    logout: (state) => {
      state.user = null
      state.authToken = null

      localStorage.clear()
      sessionStorage.clear()
    },
    login: (state) => {
      const localAuthToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const sessionAuthToken = sessionStorage.getItem(AUTH_TOKEN_KEY)

      state.authToken = localAuthToken ?? sessionAuthToken
    },
  },
  extraReducers: {
    [fetchToken.fulfilled]: (state, { payload }) => {
      const { token, user } = payload

      state.user = user
      state.authToken = token
    },
    [fetchToken.rejected]: (state) => {
      state.failedLogin = true
    },
  },
})

export const { logout, login } = authSlice.actions
export default authSlice.reducer
