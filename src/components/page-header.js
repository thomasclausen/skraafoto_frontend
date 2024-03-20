import { SkraaFotoAddressSearch } from './address-search.js'
import { configuration } from "../modules/configuration"
import svgSprites from '@dataforsyningen/designsystem/assets/designsystem-icons.svg'

customElements.define('skraafoto-address-search', SkraaFotoAddressSearch)

/**
 * Web component that displays a reusable webpage header
 */
export class SkraaFotoHeader extends HTMLElement {

  #styles = `
    .sf-header {
      display: flex;
      flex-flow: row nowrap;
      gap: var(--space);
      align-items: center;
      padding: 0.75rem 1rem;
      width: 100vw;
    }
    ds-logo-title {
      height: 3rem;
      width: 10rem;
      margin-left: 0.5rem;
    }
    .sf-header-fill {
      flex-grow: 1;
    }
    .sf-header nav {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      width: 20rem;
      transition: transform 0.3s;
      transform: translateX(0);
      z-index: 5;
      display: block;
    }
    .sf-header nav[hidden] {
      transform: translateX(20rem);
    }
    ds-toggle-panel.sf-nav-menu .ds-toggle-panel {
      position: fixed;
      top: 0;
      right: 0;
      left: auto;
      padding: var(--space-lg) var(--space-md);
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
    }
    ds-toggle-panel.sf-nav-menu .ds-toggle-panel[hidden] {
      transform: translate(100%, 0);
    }
    ds-toggle-panel button.ds-toggle-button {
      margin: 0;
    }
    .sf-nav-menu a {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
    .sf-nav-menu a > svg {
      height: var(--space-lg);
      width: var(--space-lg);
      margin-right: var(--space-sm);
    }
    .skat-logo {
      width: 12rem;
    }
    #headline {
      display: inline;
      margin-left: 0;
    }    
    .sf-byline-small {
      display: none;
    }
    .sf-byline-large {
      display: inline;
    }

    @media screen and (max-width: 50rem) {
      skraafoto-view-switcher {
        display: none;
      }
    }
    
    @media screen and (max-width: 79.9rem) {
      .sf-header {
        --padding: 1.5rem 3rem 2rem;
      }
      .sf-header nav {
        width: 100vw;
      }
    }

    @media screen and (min-width: 33rem) {
      ds-logo-title {
        width: 25rem;
      }
    }
  `

  constructor() {
    super()
  }

  connectedCallback() {
    this.#createDOM()
    // We use timeout to set event listener
    // because parent <ds-toggle-panel> might not be completely rendered yet.
    setTimeout(() => {
      this.querySelector('a.sf-help-link').addEventListener('click', (event) => {
        event.preventDefault()
        location.pathname = 'info.html'
      })  
    }, 500)
  }

  #createDOM() {
    // Decide what byline to use
    const byline = document.body.clientWidth < 540 ? 'SDFI' : false

    // Create elements
    const markup = document.createElement('header')
    markup.className = 'sf-header'
    markup.dataset.theme = 'dark'

    let headerContent = `<style>${ this.#styles }</style>`

    if (configuration.ENABLE_SKATLOGO) {
      headerContent += `
        <a href="/">
          <img href="/" id="vurderingsstyrelsen" class="skat-logo" src="img/logos/logo-vurderingsstyrelsen.svg" alt="logo af Vurderingsstyrelsen"/>
          <strong id="headline">Skråfoto</strong>
        </a>
      `
    } else {
      headerContent += `
        <a href="/">
          <ds-logo-title title="Skråfoto"${ byline ? ` byline="${ byline }"` : ''}>
        </a>
      `
    }

    headerContent += `
      <div class="sf-header-fill"><!-- Empty element to fill out space --></div>
      <skraafoto-address-search collapsible></skraafoto-address-search>
      <ds-toggle-panel title="Navigation" class="sf-nav-menu slide">
        <section>
          <skraafoto-view-switcher></skraafoto-view-switcher>
          <a class="sf-help-link quiet" title="Information om Skråfoto" href="info.html">
            <svg><use href="${ svgSprites }#info"/></svg> Mere information om Skråfoto
          </a>
        </section>
        <section>
          <p>
            <strong>Styrelsen for Dataforsyning og Infrastruktur</strong>
          </p>
          <hr>
          <p>
            <small>
              Sankt Kjelds Plads 11<br>
              2100 København Ø<br>
              7254 5500<br>
              sdfi@sdfi.dk
            </small>
          </p>
        </section>
      </ds-toggle-panel>
    `
    markup.innerHTML = headerContent
    this.append(markup)
  }
}
