import { configuration } from '../modules/configuration.js'
import { queryItems, queryItem } from '../modules/api.js'

/**
 * Default state for STAC item data in viewports
 */
const itemState = {
  'viewport-1': {
    item: null,
    itemId: null,
    orientation: null,
    collection: null
  },
  'viewport-2': {
    item: null,
    itemId: null,
    orientation: null,
    collection: null
  },
  items: {
    'north': null,
    'south': null,
    'east': null,
    'west': null,
    'nadir': null
  }
}

/**
 * Actions for STAC item data in viewports
 */
const itemActions = {

  updateItem: function(state, {id, item}) {
    // Update only if values are different
    if (state[id].item.id !== item.id) {
      // Make a new state item and set state to dispatch update event
      const newItem = structuredClone(state[id])
      newItem.item = item
      newItem.itemId = item.id
      newItem.orientation = item.properties.direction
      newItem.collection = item.collection
      state[id] = newItem
    }
    return state
  },

  updateItemId: async function(state, {id, itemId}) {
    // Update only if values are different
    if (state[id].itemId !== itemId) {
      // Fetch new item and update state (including udpating collection)
      const feature = await queryItem(itemId)
      this.updateItem(state, {id: id, item: feature})
      window.dispatchEvent(new CustomEvent('updateItem'))
    }
    return state
  },

  updateCollection: async function(state, {id, collection}) {
    // Update only if values are different
    if (state[id].collection !== collection) {
      // Fetch new item and update state (including udpating collection)
      const featureCollection = await queryItems(state.view.center, state[id].orientation, collection, 1)
      this.updateItem(state, {id: id, item: featureCollection.features[0]})
      window.dispatchEvent(new CustomEvent('updateItem'))
    }
    return state
  },

  updateOrientation: function(state, orientation) {
    state.orientation = orientation
    return state
  }

}

export { itemState, itemActions }