import { queryItems } from '../modules/api.js'
import store from '../store'
import svgSprites from '@dataforsyningen/designsystem/assets/designsystem-icons.svg'

/**
 * Web component that fetches a list of items covering a specific collection, coordinate, and orientation.
 * Enables user to select an item for view by its date.
 * @prop {string} dataset.index - `data-index` attribute used to look up state by viewport index.
 * @fires updateItemId - New item ID selected by user.
 */
export class SkraaFotoDateSelector extends HTMLElement {

  #selectElement

  constructor() {
    super()
  }

  connectedCallback() {

    this.innerHTML = this.#renderTemplate()

    this.#selectElement = this.querySelector('select')
    let isOptionClicked = false

    // When an option is clicked, set the flag to prevent focus removal
    this.#selectElement.addEventListener('mousedown', () => {
      isOptionClicked = true
    })

    // When the select element loses focus, remove focus if no option is selected
    this.#selectElement.addEventListener('blur', () => {
      if (!isOptionClicked) {
        this.#selectElement.selectedIndex = -1 // Deselect any selected option
      }
      isOptionClicked = false // Reset the flag
    })

    // Add global listener for state changes
    window.addEventListener('updateItem', this.#update.bind(this))

    // When an option is selected, update the store with the new item
    this.#selectElement.addEventListener('change', (event) => {
      store.dispatch('updateItemId', {
        index: this.dataset.index,
        itemId: event.target.value
      })
      this.#selectElement.blur() // Remove focus from the select element
    })

    this.#fetchIds(store.state.viewports[this.dataset.index])
  }

  disconnectedCallback() {
    window.removeEventListener('updateItem', this.#update)
  }

  #update(event) {
    const item = store.state.viewports[this.dataset.index]
    this.#fetchIds(item)
  }

  #fetchIds(item) {
    const center = store.state.marker.center
    queryItems(center, item.orientation, item.collection, 50).then((response) => {
      this.#selectElement.innerHTML = this.#renderOptions(response.features)
      this.#selectElement.value = store.state.viewports[this.dataset.index].itemId
    })
  }

  #renderTemplate() {
    return `
      <select class="sf-date-viewer" id="date"></select>
    `
  }

  #renderOptions(features) {
    let templateString = ''
    features.map((i, idx, arr) => {
      const datetime = new Date(i.properties.datetime)
      const seriesDate = `${datetime.toLocaleDateString()} ${idx + 1}/${arr.length}`
      templateString += `
      <option value="${i.id}">
        ${seriesDate}
      </option>
    `
    })
    return templateString
  }

}
