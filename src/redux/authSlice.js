import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { LANGUAGE_CACHE_KEY } from '../i18n'
import { editUser, getUser, getUserToken, refreshUserToken } from '../utils/api'
import authStore from '../utils/authStore'

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_data) => {
  const token = authStore.initFromStorage()

  if (!token?.access_token || !token?.refresh_token) {
    return null
  }

  try {
    const user = await getUser(token.access_token)
    authStore.setToken(token)
    return user
  } catch (error) {
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'Expired access token'
    ) {
      let newToken
      try {
        newToken = await refreshUserToken(token.refresh_token)
      } catch (refreshError) {
        authStore.removeToken()
        throw refreshError
      }
      const user = await getUser(newToken.access_token)
      authStore.setToken(newToken)
      return user
    } else if (error.response?.status === 401) {
      // We failed to log in with our token but can't fix the error based on response
      authStore.removeToken()
    }
    throw error
  }
})

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }) => {
    const token = await getUserToken(email, password)
    const user = await getUser(token.access_token)
    authStore.setRememberMe(rememberMe)
    authStore.setToken(token)
    return user
  },
)

export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (userData, { getState }) => {
    const currentUser = getState().auth.user
    const isEmailChanged = userData.email !== currentUser.email
    const response = await editUser({ ...userData, range: currentUser.range })
    return { response, isEmailChanged }
  },
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: true,
  },
  reducers: {
    logout: (state) => {
      authStore.removeToken()
      state.user = null
      localStorage.removeItem(LANGUAGE_CACHE_KEY)
    },
  },
  extraReducers: {
    [checkAuth.pending]: (state) => {
      state.isLoading = true
    },
    [checkAuth.fulfilled]: (state, action) => {
      state.user = action.payload
      state.isLoading = false
    },
    [checkAuth.rejected]: (state, action) => {
      toast.error(
        `Authentication check failed: ${
          action.error.message || 'Unknown error'
        }`,
      )
      state.isLoading = false
    },

    [login.pending]: (state) => {
      state.isLoading = true
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload
      state.isLoading = false
      localStorage.setItem(LANGUAGE_CACHE_KEY, i18next.language)
    },
    [login.rejected]: (state, action) => {
      toast.error(
        `Sign in failed: ${action.error.message || 'Unknown error'}`,
        { autoClose: 5000 },
      )
      state.isLoading = false
    },

    [editProfile.pending]: (state) => {
      state.isLoading = true
    },
    [editProfile.fulfilled]: (state, action) => {
      const { response, isEmailChanged } = action.payload
      state.user = response
      state.isLoading = false

      if (isEmailChanged && response.unconfirmed_email) {
        toast.success(
          i18next.t('devise.registrations.update_needs_confirmation'),
        )
      } else {
        toast.success(i18next.t('devise.registrations.updated'))
      }
    },
    [editProfile.rejected]: (state, action) => {
      toast.error(
        `Profile update failed: ${action.error.message || 'Unknown error'}`,
      )
      state.isLoading = false
    },
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
