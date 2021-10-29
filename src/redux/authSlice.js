import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserToken } from '../utils/api'

const authToken = 'authToken'

export const fetchAccessToken = createAsyncThunk(
  'users/fetchToken',
  async ({ email, password, isChecked }) => {
    const response = await getUserToken({
      email: email,
      password: password,
    })
    if (isChecked) {
      localStorage.setItem(authToken, response)
    } else {
      sessionStorage.setItem(authToken, response)
    }

    return response
  },
)
const initialState = { authToken: null, isChecked: false, failedLogin: false }

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authToken = null
      localStorage.clear()
      sessionStorage.clear()
    },
    login: (state) => {
      const localAuthToken = localStorage.getItem('authToken')
      const sessionAuthToken = sessionStorage.getItem('authToken')
      state.authToken = localAuthToken ?? sessionAuthToken
    },
  },
  extraReducers: {
    [fetchAccessToken.fulfilled]: (state, { payload }) => {
      state.authToken = payload
    },
    [fetchAccessToken.rejected]: (state) => {
      state.failedLogin = true
    },
  },
})

export const { logout, login } = authSlice.actions
export default authSlice.reducer
