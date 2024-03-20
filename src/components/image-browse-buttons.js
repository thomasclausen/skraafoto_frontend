import svgSprites from '@dataforsyningen/designsystem/assets/designsystem-icons.svg'
import store from '../store'

/** 
 * Places a button that shifts current image direction 
 * (from east to south, from south to west, and so on). 
 * @prop {String} direction - The direction to shift. "1" for west/south/east/north or "-1" for south/west/north/east.
 */
export class ShiftImageOrientationControl extends HTMLElement {

  #direction
  #lookup = {
    counterclockwise: {
      north: 'west',
      south: 'east',
      east: 'north',
      west: 'south',
      nadir: 'north'
    },
    clockwise: {
      north: 'east',
      south: 'west',
      east: 'south',
      west: 'north',
      nadir: 'north'
    }
  }

  constructor() {
    super()
    this.#direction = this.getAttribute('direction') === '1' ? true : false
  }

  connectedCallback() {
    this.#render()
    this.querySelector('button').addEventListener('click', this.shiftItemHandler.bind(this))
  }

  #render() {
    this.innerHTML = `
      <button title="Skift retning">
        <svg><use href="${ svgSprites }#arrow-single-${ this.#direction ? 'left' : 'right' }"/></svg>
      </button>
    `
  }

  shiftItemHandler(event) {
    const newOrientation = this.#direction
    ? this.#lookup.counterclockwise[store.state.viewports[0].orientation]
    : this.#lookup.clockwise[store.state.viewports[0].orientation]

    store.dispatch('updateOrientation', newOrientation)
  }

}


export class ShiftImageVariantControl extends HTMLElement {

  #shiftDirection
  shiftEventUp = new CustomEvent('imageshift', {details: {direction: 1}})
  shiftEventDown = new CustomEvent('imageshift', {details: {direction: -1}})
  
  constructor() {
    super()
    this.#shiftDirection = this.getAttribute('direction') === 'up' ? true : false
  }

  connectedCallback() {
    this.#render()
    this.querySelector(`button.${ this.getAttribute('direction') }`).addEventListener('click', this.shiftItemUp.bind(this))
  }

  #render() {
    this.innerHTML = `
      <button class="${ this.getAttribute('direction') }">
        <svg><use href="${ svgSprites }#arrow-single-${ this.getAttribute('direction') }"/></svg>
      </button>
    `
  }

  shiftItemUp(event) {
    console.log('shifting up')
    this.dispatchEvent(this.shiftEventUp)
  }

  shiftItemDown(event) {
    console.log('shifting down')
    this.dispatchEvent(this.shiftEventDown)

    /*
    const selectedIndex = this.#selectElement.selectedIndex
      const lastIndex = this.#selectElement.options.length - 1
      const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1
      this.#selectElement.selectedIndex = nextIndex
      this.#selectElement.dispatchEvent(new Event('change')) // Trigger change event manually
      */
  }
}
