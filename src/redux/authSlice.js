import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { editUser, getUser, getUserToken } from '../utils/api'
import authStore from '../utils/authStore'

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_data, { rejectWithValue }) => {
    let token
    try {
      token = authStore.getToken()
    } catch (err) {
      return rejectWithValue(err)
    }

    if (token?.access_token) {
      return await getUser()
    } else {
      return null
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    let token
    try {
      token = await getUserToken(email, password)
    } catch (err) {
      return rejectWithValue(err)
    }
    authStore.setToken(token, rememberMe)

    return await getUser()
  },
)

export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const currentUser = getState().auth.user
      const isEmailChanged = userData.email !== currentUser.email
      const response = await editUser({ ...userData, range: currentUser.range })
      return { response, isEmailChanged }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message)
    }
  },
)

export const logout = createAction('auth/logout', () => {
  authStore.removeToken()
  return {}
})

const initialState = {
  user: null,
  error: null,
  isLoading: true,
  token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
  initialState,
  extraReducers: {
    [checkAuth.pending]: (state) => {
      state.isLoading = true
    },
    [checkAuth.fulfilled]: (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
    },
    [checkAuth.rejected]: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },

    [login.pending]: (state) => {
      state.isLoading = true
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
    },
    [login.rejected]: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },

    [logout]: (state) => {
      state.user = null
    },

    [editProfile.pending]: (state) => {
      state.isLoading = true
    },
    [editProfile.fulfilled]: (state, action) => {
      const { response, isEmailChanged } = action.payload
      state.user = response
      state.error = null
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
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setToken } = authSlice.actions
export default authSlice.reducer
