import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserToken } from '../utils/api'

export const fetchAccessToken = createAsyncThunk(
  'users/fetchToken',
  async ({ email, password, isChecked }) => {
    const response = await getUserToken({
      email: email,
      password: password,
    })
    isChecked
      ? localStorage.setItem('authToken', response)
      : sessionStorage.setItem('authToken', response)

    return response
  },
)
const initialState = { authToken: undefined, isChecked: false }

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthCredentials: (state) => {
      state.authToken = null
      state.failedLogin = false
    },
    setAuthFromStorage: (state) => {
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

export const { clearAuthCredentials, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
