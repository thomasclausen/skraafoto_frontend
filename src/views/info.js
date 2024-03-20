import { setupAnalytics } from '../modules/tracking.js'
import { SkraaFotoHeader } from '../components/page-header.js'
import { DSLogoTitle, DSTogglePanel } from '@dataforsyningen/designsystem'

customElements.define('ds-toggle-panel', DSTogglePanel)
customElements.define('skraafoto-header', SkraaFotoHeader)
customElements.define('ds-logo-title', DSLogoTitle)

document.querySelectorAll('.sf-link-back').forEach(function(link) {
  link.href = `/${ location.search }`
})

setupAnalytics()
