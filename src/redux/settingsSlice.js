import { createSlice } from '@reduxjs/toolkit'

import { LabelVisibility, MapType } from '../constants/settings'

const DEFAULT_SETTINGS = {
  labelVisibility: LabelVisibility.WhenZoomedIn,
  distanceUnit: 'metric',
  mapType: MapType.Roadmap,
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
