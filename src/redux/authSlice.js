import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { editUser, getUser, getUserToken } from '../utils/api'
import persistentStore from '../utils/persistentStore'

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_data) => {
  await persistentStore.initialise()
  if (!persistentStore.hasTokens()) {
    return [null, null, false]
  } else {
    try {
      const user = await getUser()
      return [user, null, true]
    } catch (err) {
      if (err.response?.status === 401) {
        persistentStore.removeTokens()
      }
      return [null, err, true]
    }
  }
})

export const login = createAsyncThunk('auth/login', async (props) => {
  const { email, password, remember_me: rememberMe } = props
  const token = await getUserToken(email, password)
  persistentStore.setNewToken(token, rememberMe)
  const user = await getUser()
  return user
})

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
    isFirstLoad: null,
  },
  reducers: {
    logout: (state) => {
      persistentStore.removeTokens()
      state.user = null
    },
  },
  extraReducers: {
    [checkAuth.pending]: (state) => {
      state.isLoading = true
    },
    [checkAuth.fulfilled]: (state, action) => {
      const [user, _error, hadToken] = action.payload
      if (user) {
        state.user = user
      }
      state.isLoading = false
      state.isFirstLoad = !hadToken
    },

    [login.pending]: (state) => {
      state.isLoading = true
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload
      state.isLoading = false
    },
    [login.rejected]: (state, action) => {
      toast.error(
        i18next.t('error_message.auth.signin_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
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
        i18next.t('error_message.auth.profile_update_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
      state.isLoading = false
    },
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
