import { makeObservable, observable, action, computed, autorun } from 'mobx'
import { configuration } from '../modules/configuration.js'
import { queryItem, queryItems } from '../modules/api.js'
import { sanitizeCoords } from '../modules/url-sanitize.js'

class SkraafotoState {

  // Marker
  marker = {
    position: configuration.DEFAULT_WORLD_COORDINATE
  }
  setMarkerPosition(point) {
    this.marker.position = point
  }

  // View
  view = {
    position: configuration.DEFAULT_WORLD_COORDINATE,
    zoom: configuration.DEFAULT_ZOOM,
    kote: 0
  }
  setView(payload) {
    const newView = structuredClone(this.view)
    if (payload.point) {
      newView.position = payload.point
    }
    if (payload.kote) {
      newView.kote = payload.kote
    }
    if (payload.zoom) {
      newView.zoom = payload.zoom
    }
    this.view = newView
  }

  // Items
  items = {
    item: null,
    item2: null,
    nadir: null,
    north: null,
    south: null,
    west: null,
    east: null
  }
  get item() {
    return this.items['item']
  }
  setItem(item, key = 'item') {
    if (this.items[key] !== item) {
      this.items[key] = item
    }
  }
  
  // Map
  mapVisible = false
  setMapVisible(visibility) {
    this.mapVisible = visibility
  }

  // Collection
  collection = 'skraafotos2023'
  collections = []
  setCollections(collections) {
    this.collections = collections.map((c) => c.id)
  }
  setCurrentCollection(collection) {
    // Sync main image with collection
    if (this.items.item.collection !== collection) {
      queryItems(this.marker.position, this.items.item.properties.direction, collection, 1).then((data) => {
        this.items.item = data.features[0]
        this.collection = collection
      })
    } else {
      this.collection = collection
    }
  }

  // Parcels
  parcels = []
  setParcels(parcels) {
    this.parcels = parcels
  }

  // URL
  async setSyncFromURL(urlParams) {

    if (urlParams.get('orientation') === 'map') {
      this.mapVisible = true
    }

    if (urlParams.has('center')) {
      const center = urlParams.get('center').split(',').map((c) => Number(c))
      this.marker.position = center
      this.view.position = center
    }

    if (urlParams.has('item')) {
      this.items.item = await queryItem(urlParams.get('item'))
    } else {
      // Load default item
      this.items.item = await queryItem(configuration.DEFAULT_ITEM_ID)
    }
    if (urlParams.has('item-2')) {
      this.items.item2 = await queryItem(urlParams.get('item-2'))
    }

    if (configuration.ENABLE_PARCEL && urlParams.has('parcels')) {
      const parcels = await fetchParcels(urlParams.get('parcels'))
      this.parcels = parcels
    }
  }

  constructor() {

    makeObservable(this, {
      marker: observable,
      setMarkerPosition: action,
      view: observable,
      setView: action,
      items: observable,
      item: computed,
      setItem: action,
      mapVisible: observable,
      setMapVisible: action,
      collection: observable,
      collections: observable,
      setCollections: action,
      setCurrentCollection: action,
      parcels: observable,
      setParcels: action,
      setSyncFromURL: action
    })

    // Initialize state using URL search parameters
    this.setSyncFromURL(sanitizeCoords(new URL(window.location)))
  }
}

function syncToUrl(marker, item1, item2, mapVisible) {
  let url = new URL(window.location)

  if (marker) {
    url.searchParams.set('center', marker.position.join(','))
  }

  // Update parameters for viewport-1
  if (item1) {
    url.searchParams.set('item', item1.id)
    url.searchParams.set('year', item1.collection.match(/\d{4}/g)[0])
  }
  
  // Update parameters for viewport-2
  if (item2) {
    url.searchParams.set('item-2', item2.id)
    url.searchParams.set('year-2', item2.collection.match(/\d{4}/g)[0])
  }

  if (mapVisible) {
    url.searchParams.set('orientation', 'map')
  } else if (item1) {
    url.searchParams.set('orientation', item1.properties.direction)
  }

  history.pushState({}, '', url)
}

// Initialize state
const state = new SkraafotoState()

// Update URL on state change
autorun(() => {
  syncToUrl(state.marker, state.items.item, state.items.item2, state.mapVisible)
})

// Exports
export {
  state,
  autorun
}