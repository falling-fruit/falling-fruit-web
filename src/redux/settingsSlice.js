import { createSlice } from '@reduxjs/toolkit'

/**
 * Default settings.
 * @constant {Object}
 * @property {string} labelVisibility - Determines when labels appear under locations ('always_on', 'when_zoomed_in', 'off')
 */
const DEFAULT_SETTINGS = {
  labelVisibility: 'when_zoomed_in',
  distanceUnit: 'metric',
  mapType: 'roadmap',
  overlay: null,
  showBusinesses: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: DEFAULT_SETTINGS,
  reducers: {
    updateSettings: (state, action) => ({ ...state, ...action.payload }),
  },
})

export const { updateSettings } = settingsSlice.actions

export default settingsSlice.reducer
