import { createSlice } from '@reduxjs/toolkit'

/**
 * Default view state of the map.
 * @constant {Object}
 * @property {number[]} center - The latitude and longitude of the map's center
 * @property {number} zoom - The map's zoom level
 * @property {Object} bounds - The latitude and longitude of the map's NE, NW, SE, and SW corners
 */
const DEFAULT_VIEW_STATE = {
  center: { lat: 40.1125785, lng: -88.2287926 },
  zoom: 1,
}

const setReducer = (key) => (state, action) => ({
  ...state,
  [key]: action.payload,
})

const updateReducer = (key) => (state, action) => ({
  ...state,
  [key]: { ...state[key], ...action.payload },
})

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    typesById: null,
    filterTreeData: null,
    isDesktop: null,
    view: DEFAULT_VIEW_STATE,
    listLocations: [],
    mapLocations: [],
    mapClusters: [],
    hoveredLocationId: null,
    filters: {},
  },
  reducers: {
    setTypesById: setReducer('typesById'),
    updateFilterTreeData: updateReducer('filterTreeData'),
    setIsDesktop: setReducer('isDesktop'),
    setView: setReducer('setView'),
    setHoveredLocationId: setReducer('hoveredLocationId'),
    updateFilters: updateReducer('filters'),
  },
})

export const {
  setTypesById,
  setFilterTreeData,
  setIsDesktop,
  setView,
  setHoveredLocationId,
  updateFilters,
} = mapSlice.actions

export default mapSlice.reducer
