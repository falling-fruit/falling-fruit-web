import { createSlice } from '@reduxjs/toolkit'

/**
 * Default settings.
 * @constant {Object}
 * @property {boolean} showLabels - Determines if labels appear under locations
 */
const DEFAULT_SETTINGS = {
  showLabels: false,
  showScientificNames: true,
  distanceUnit: 'metric',
  mapType: 'roadmap',
  mapLayers: [],
  overrideDataLanguage: false,
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
