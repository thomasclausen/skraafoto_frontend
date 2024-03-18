import svgSprites from '@dataforsyningen/designsystem/assets/designsystem-icons.svg'

/**
 * Web component that a set of buttons to switch between kinds of views
 */
export class SkraaFotoViewSwitcher extends HTMLElement {


  // Properties

  markup
  
  template = `
    <a class="switch-view-5 quiet switch-button" href="/">
      <svg><use href="${ svgSprites }#frame-multi"/></svg>
      Vis 1 stort og 5 små billeder
    </a>
    <hr>
    <a class="switch-view-2 quiet switch-button" href="twinview.html">
      <svg><use href="${ svgSprites }#frame-dual"/></svg>
      Vis 2 store billeder
    </a>
    <hr>
    <a class="switch-view-1 quiet switch-button" href="singleview.html">
      <svg><use href="${ svgSprites }#frame-single"/></svg>
      Vis ét stort billede
    </a>
    <hr>
  `


  constructor() {
    super()
    this.createDOM()
  }


  // Methods

  createDOM() {
    // Create elements
    this.innerHTML = this.template
  }

  // Lifecycle

  connectedCallback() {
    this.querySelector('.switch-view-5').addEventListener('click', (event) => {
      event.preventDefault()
      location.pathname = '/'
    })
    this.querySelector('.switch-view-2').addEventListener('click', (event) => {
      event.preventDefault()
      location.pathname = 'twinview.html'
    })
    this.querySelector('.switch-view-1').addEventListener('click', (event) => {
      event.preventDefault()
      location.pathname = 'singleview.html'
    })
  }

}
