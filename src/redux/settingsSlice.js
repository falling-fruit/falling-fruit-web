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
  mapData: '',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: DEFAULT_SETTINGS,
  reducers: {
    updateSettings: (state, action) => ({ ...state, ...action.payload }),
    updateMapData: (state, action) => {
      state.mapData += action.payload
    },
  },
})

export const { updateSettings, updateMapData } = settingsSlice.actions

export default settingsSlice.reducer
