import { DEFAULT_GEOLOCATION_ZOOM } from './map'

export const LabelVisibility = {
  AlwaysOn: 'always_on',
  WhenZoomedIn: 'when_zoomed_in',
  Off: 'off',

  fromUrlParam(param) {
    if (param === 'true') {
      return this.AlwaysOn
    }
    if (param === 'false') {
      return this.Off
    }
    return null
  },

  toUrlParam(value) {
    if (value === this.AlwaysOn) {
      return 'true'
    }
    if (value === this.Off) {
      return 'false'
    }
    return null
  },

  shouldShowLabels(value, currentZoom) {
    return (
      value === this.AlwaysOn ||
      (value === this.WhenZoomedIn && currentZoom >= DEFAULT_GEOLOCATION_ZOOM)
    )
  },
}

export const MapType = {
  Roadmap: 'roadmap',
  Terrain: 'terrain',
  Hybrid: 'hybrid',
  OsmStandard: 'osm-standard',
  OsmTonerLite: 'osm-toner-lite',

  isValid(value) {
    const validValues = [
      this.Roadmap,
      this.Terrain,
      this.Hybrid,
      this.OsmStandard,
      this.OsmTonerLite,
    ]
    return validValues.includes(value)
  },

  fromLegacyParam(param) {
    if (!param) {
      return null
    }
    const normalized = param.toLowerCase()
    if (normalized === 'toner-lite') {
      return this.OsmTonerLite
    }
    if (normalized === 'osm') {
      return this.OsmStandard
    }
    if (this.isValid(normalized)) {
      return normalized
    }
    return null
  },

  getMaxZoom(value) {
    if (value === this.Roadmap) {
      return 22
    }
    return 21
  },
}

export const OverlayType = {
  Bicycle: 'bicycle',
  Transit: 'transit',

  isValid(value) {
    return value === this.Bicycle || value === this.Transit
  },

  toLayerType(value) {
    if (value === this.Bicycle) {
      return 'BicyclingLayer'
    }
    if (value === this.Transit) {
      return 'TransitLayer'
    }
    return null
  },
}
