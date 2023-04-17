import { configuration } from '../modules/configuration.js'

/**
 * State for map data
 */
const mapState = {
    terrain: {}, // the terrain GEOTIFF file
    rasters: {}, // the rasters data from the terrain
    parcels: [], // The parcels data in JSON format
    view: { center: [], zoom: configuration.DEFAULT_ZOOM + configuration.ZOOM_DIFFERENCE } // the view, consisting of the zoom level and center of the background map
  }

  
  /**
   * Actions for the map data
   */
  const mapActions = {
    updateTerrain (state, payload) {
      state.terrain = payload
      return state
    },
    updateRasters (state, payload) {
      state.rasters = payload
      return state
    },
    updateParcels (state, payload) {
      state.parcels = payload
      return state
    },
    updateView (state, payload) {
      state.view = payload
      return state
    }
  }
  
  export { mapState, mapActions }
  