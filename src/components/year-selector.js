import { getYearFromCollection } from '../modules/utilities.js'
import store from '../store'
import svgSprites from '@dataforsyningen/designsystem/assets/designsystem-icons.svg'


/**
 * Web component that enables the user to select from a list of available years.
 * Looks up `store.state.viewports[this.dataset.index].collection` on connectedCallback to get available years.
 * @prop {string} dataset.index - `data-index` attribute used to look up state by viewport index.
 * @fires updateCollection - New collection (`skraafotos` + year) selected by user.
 */
export class SkraaFotoYearSelector extends HTMLElement {

  // private properties
  #selectElement
  #template = `
    <label hidden>Vælg en årgang</label>
    <select class="sf-date-selector" title="Vælg en årgang"></select>
  `

  constructor() {
    super()
  }

  connectedCallback() {
    this.createDOM()

    // Listen for user change
    this.#selectElement.addEventListener('change', this.selectionChangeHandler.bind(this))

    window.addEventListener('updateCollection', this.collectionUpdatedHandler.bind(this))
  }

  // methods

  createDOM() {
    this.innerHTML = this.#template

    this.#selectElement = this.querySelector('select')

    // Create the year options from the list of collections
    for (const c of store.state.collections) {
      const year = getYearFromCollection(c)
      const optionElement = document.createElement('option')
      optionElement.value = year
      optionElement.innerText = year
      this.#selectElement.appendChild(optionElement)
    }

    // Setup select element value from state
    this.#selectElement.value = getYearFromCollection(store.state.viewports[this.dataset.index].collection)
  }

  selectionChangeHandler(event) {
    store.dispatch('updateCollection', {
      index: this.dataset.index,
      collection: `skraafotos${event.target.value}`
    })
  }

  collectionUpdatedHandler(event) {
    // Only update if the right viewport state was updated
    if (event.detail.index === this.dataset.index) {
      this.#selectElement.value = getYearFromCollection(event.detail.collection)
    }
  }

  disconnectedCallback() {
    window.removeEventListener('updateCollection', this.collectionUpdatedHandler)
  }

}
