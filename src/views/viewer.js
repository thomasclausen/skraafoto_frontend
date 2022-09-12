import { queryItems, queryItem } from '../modules/api.js'
import { SkraaFotoViewport } from '../components/viewport.js'
import { SkraaFotoAdvancedViewport } from '../components/advanced-viewport.js'
import { SkraaFotoMap } from '../components/map.js'
import { SkraaFotoAddressSearch } from '../components/address-search.js'
import { SkraaFotoDirectionPicker } from '../components/direction-picker.js'
import { SkraaFotoDateSelector } from '../components/date-selector.js'
import { SkraaFotoDownloadTool } from '../components/map-tool-download.js'
import { SkraaFotoInfoBox } from '../components/info-box.js'
// import { SkraaFotoMeasureTool } from '../components/map-tool-measure.js'


// Initialize web components

customElements.define('skraafoto-viewport', SkraaFotoViewport)
customElements.define('skraafoto-advanced-viewport', SkraaFotoAdvancedViewport)
customElements.define('skraafoto-map', SkraaFotoMap)
customElements.define('skraafoto-address-search', SkraaFotoAddressSearch)
customElements.define('skraafoto-direction-picker', SkraaFotoDirectionPicker)
customElements.define('skraafoto-date-selector', SkraaFotoDateSelector)
// customElements.define('skraafoto-measure-tool', SkraaFotoMeasureTool)
customElements.define('skraafoto-download-tool', SkraaFotoDownloadTool)
customElements.define('skraafoto-info-box', SkraaFotoInfoBox)


// Variables and state

let state = {
  coordinate: null, // EPSG:25832 coordinate [longitude,latitude]
  item: null,
  map: false
}
let url_params = (new URL(document.location)).searchParams

const big_map_element = document.getElementById('map-main')
const main_viewport_element = document.getElementById('viewport-main')
const direction_picker_element = document.querySelector('skraafoto-direction-picker')


// Methods

function updateMainViewport(state) {
  if (state.item) {
    main_viewport_element.setItem = state.item
  }
  if (state.coordinate) {
    main_viewport_element.setCenter = state.coordinate
  }    
}

function updateViews(state) {

  // If no coordinate is given, center mid-image
  if (!state.coordinate && state.item) {
    state.coordinate = [
      (state.item.bbox[0] + state.item.bbox[2]) / 2,
      (state.item.bbox[1] + state.item.bbox[3]) / 2
    ]
  }

  if (state.map) {
    openMap()
  } else {
    updateMainViewport(state)
  }
  
  // Update the other viewports
  direction_picker_element.setView = {
    collection: state.item.collection,
    center: state.coordinate
  }

  updateUrl(state)
}

function parseUrlState(params, state) {
  let new_state = Object.assign({}, state)
  
  // Parse center param from URL
  const param_center = params.get('center')
  if (param_center) {
    new_state.coordinate = param_center.split(',').map(function(coord) {
      return Number(coord)
    })
  }

  // Parse map status from URL
  const param_map = params.get('map')
  if (param_map === '1') {
    new_state.map = true
  } else {
    new_state.map = false
  }

  // Parse item param from URL
  const param_item = params.get('item')
  if (param_item) {
    return queryItem(param_item).then((item) => {

      new_state.item = item
      return new_state
    })
  } else { 
    return queryItems(new_state.coordinate, 'north').then((response) => {
      new_state.item = response.features[0]
      return new_state
    })
  }
}

function updateUrl(state) {
  const url = new URL(window.location)
  if (state.item) {
    url.searchParams.set('item', state.item.id)
  }
  if (state.coordinate) {
    url.searchParams.set('center', state.coordinate[0] + ',' + state.coordinate[1])
  }
  if (state.map) {
    url.searchParams.set('map', 1)
  }
  window.history.pushState({}, '', url)
}

function openMap() {
  main_viewport_element.setAttribute('hidden', true)
  big_map_element.removeAttribute('hidden')
  big_map_element.setView = {
    center: state.coordinate
  }
}


// Set up event listeners

// When a coordinate input is given, update viewports
document.addEventListener('coordinatechange', async function(event) {
  state.coordinate = event.detail
  updateViews(state)
})

// On a new address input, update viewports
document.addEventListener('addresschange', function(event) {
  state.coordinate = event.detail
  queryItems(event.detail, 'north').then((response) => {
    state.item = response.features[0]
    updateViews(state)
  })
})

// When a viewport is clicked in the direction picker, update the main viewport and the URL
direction_picker_element.addEventListener('directionchange', function(event) {
  big_map_element.setAttribute('hidden', true)
  main_viewport_element.removeAttribute('hidden')
  main_viewport_element.setItem = event.detail
  main_viewport_element.setCenter = state.coordinate
  state.item = event.detail
  updateUrl(state)
})

// When the tiny map in direction picker is clicked, hide the main viewport and display a big map instead.
direction_picker_element.addEventListener('mapchange', function(event) {
  state.map = true
  updateUrl(state)
  openMap()
})

// When a differently dated image is selected, update the URL and check to see if direction picker needs an update
main_viewport_element.shadowRoot.addEventListener('imagechange', function(event) {
  if (event.detail.collection !== state.item.collection) {
    direction_picker_element.setView = {
      collection: event.detail.collection,
      center: state.coordinate
    }
  }
  state.item = event.detail
  updateUrl(state)
})

// Catch load errors and display to user
window.addEventListener('offline', function() {
  alert('Du er ikke længere online. Prøv igen senere.')
})
document.addEventListener('loaderror', function(event) {
  console.error('Network error: ', event.details)
  alert('Der var et problem med at hente data fra serveren')
})


// Initialize
parseUrlState(url_params, state).then((new_state) => {
  state = new_state
  updateViews(state)
})
