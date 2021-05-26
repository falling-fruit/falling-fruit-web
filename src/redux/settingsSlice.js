import { createSlice } from '@reduxjs/toolkit'

/**
 * Default settings.
 * @constant {Object}
 * @property {boolean} showLabels - Determines if labels appear under locations
 */
const DEFAULT_SETTINGS = {
  showLabels: false,
  showScientificNames: true,
  mapType: 'roadmap',
  mapLayers: [],
  overrideDataLanguage: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: DEFAULT_SETTINGS,
  reducers: {
    update: (state, action) => ({ ...state, ...action.payload }),
  },
})

// Action creators are generated for each case reducer function
export const { update: updateSettings } = settingsSlice.actions

export default settingsSlice.reducer
