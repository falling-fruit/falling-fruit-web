import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUser, getUserToken } from '../utils/api'
import authStore from '../utils/authStore'
import { setReducer } from './mapSlice'

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const token = authStore.getToken()

  if (token.access_token) {
    return await getUser()
  } else {
    return null
  }
})

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }) => {
    const token = await getUserToken(email, password)
    authStore.setToken(token, rememberMe)

    return await getUser()
  },
)

export const logout = createAction('auth/logout', () => {
  authStore.removeToken()
  return {}
})

const initialState = {
  user: null,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  reducers: {
    setToken: setReducer('token'),
  },
  initialState,
  extraReducers: {
    [checkAuth.fulfilled]: (state, action) => {
      state.user = action.payload
      state.error = null
    },
    [checkAuth.rejected]: (state, action) => {
      state.error = action.error
    },

    [login.fulfilled]: (state, action) => {
      state.user = action.payload
      state.error = null
    },
    [login.rejected]: (state, action) => {
      state.error = action.error
    },

    [logout]: (state) => {
      state.user = null
    },
  },
})

export const { setToken } = authSlice.actions
export default authSlice.reducer
