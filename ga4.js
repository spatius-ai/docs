/**
 * Google Analytics 4 for docs.spatius.ai, sharing the stream of the marketing
 * site and Studio so a visit that starts here is credited to its source when it
 * leads to a Studio signup.
 *
 * The docs have no cookie banner. GA4 loads only after the visitor accepted
 * analytics cookies on www.spatius.ai or in Studio, which share the
 * `spatius_analytics_consent` cookie on `.spatius.ai`. While consent is
 * undecided, links to Studio carry the visit's source in `sw_landing_*`
 * parameters; Studio reports it if consent is granted there.
 *
 * Mintlify includes this file on every page and runs it once per visit.
 */
(function () {
  const MEASUREMENT_ID = 'G-5YREV5DMW3'
  const DOCS_HOST = 'docs.spatius.ai'
  const STUDIO_ORIGIN = 'https://app.spatius.ai'
  const CONSENT_COOKIE = 'spatius_analytics_consent'
  const OWNED_ROOT_DOMAINS = ['spatius.ai', 'spatialwalk.cn']
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const SAFE_VALUE_PATTERN = /^[\w.-][\w .:/-]{0,99}$/
  // Medium `organic` puts the visit in GA4's Organic Search channel.
  const SEARCH_ENGINE_HOSTS = [
    ['google', /^(?:www\.)?google\.[a-z]{2,3}(?:\.[a-z]{2})?$/],
    ['bing', /^(?:www\.|cn\.)?bing\.com$/],
    ['duckduckgo', /^(?:www\.)?duckduckgo\.com$/],
    ['yahoo', /^(?:[a-z]+\.)?search\.yahoo\.com$/],
    ['baidu', /^(?:www\.|m\.)?baidu\.com$/],
    ['yandex', /^(?:www\.)?yandex\.[a-z]{2,3}$/],
    ['ecosia', /^(?:www\.)?ecosia\.org$/],
    ['brave', /^search\.brave\.com$/],
    ['naver', /^(?:m\.)?search\.naver\.com$/],
    ['sogou', /^(?:www\.|m\.)?sogou\.com$/],
  ]

  // Local previews and Mintlify preview deployments never report.
  if (window.location.hostname !== DOCS_HOST) return

  const landingAttribution = readLandingAttribution(window.location.href, document.referrer)
  let loaded = false
  let previousPageLocation = ''

  if (readConsent() === 'accepted') {
    loadGa4()
    trackPageView()
  }
  window.addEventListener('mintlify:navigate', () => {
    if (readConsent() !== 'accepted') {
      window[`ga-disable-${MEASUREMENT_ID}`] = true
      return
    }
    window[`ga-disable-${MEASUREMENT_ID}`] = false
    loadGa4()
    trackPageView()
  })
  document.addEventListener('click', handleStudioLinkClick, true)
  document.addEventListener('auxclick', handleStudioLinkClick, true)

  function loadGa4() {
    if (loaded) return
    loaded = true
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // gtag.js consumes the Arguments object itself, not a copied array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    // Consent covers analytics only; advertising storage and signals stay off.
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    gtag('js', new Date())
    gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Arriving from our own sites continues the visit that started there; any
      // value of ignore_referrer turns it on, so the key is omitted otherwise.
      ...(isOwnedHost(referrerHostname(document.referrer)) ? { ignore_referrer: 'true' } : {}),
    })
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(script)
  }

  function trackPageView() {
    // Query strings may carry anything; GA4 gets the path and UTM tags only.
    const url = new URL(window.location.href)
    const query = new URLSearchParams()
    for (const key of UTM_KEYS) {
      const value = url.searchParams.get(key)
      if (value && SAFE_VALUE_PATTERN.test(value)) query.set(key, value)
    }
    const pageLocation = `${url.origin}${url.pathname}${query.toString() ? `?${query}` : ''}`
    // Client-side navigation keeps the landing page's document.referrer, so
    // later views name the previous page instead of the external referrer.
    const pageReferrer = previousPageLocation || referrerOrigin(document.referrer)
    gtag('event', 'page_view', {
      page_location: pageLocation,
      page_title: document.title.slice(0, 300),
      ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    })
    previousPageLocation = pageLocation
  }

  function handleStudioLinkClick(event) {
    if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return
    if (!landingAttribution || readConsent() !== 'undecided') return
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
    if (!anchor) return
    let targetUrl
    try {
      targetUrl = new URL(anchor.href)
    } catch {
      return
    }
    if (targetUrl.origin !== STUDIO_ORIGIN || targetUrl.searchParams.has('utm_source') || targetUrl.searchParams.has('sw_landing_source')) return

    const originalHref = anchor.getAttribute('href')
    targetUrl.searchParams.set('sw_landing_source', landingAttribution.source)
    targetUrl.searchParams.set('sw_landing_medium', landingAttribution.medium)
    if (landingAttribution.campaign) targetUrl.searchParams.set('sw_landing_campaign', landingAttribution.campaign)
    // The browser follows the href in place when this handler returns; restore
    // the link afterwards so copied links do not carry the source.
    anchor.href = targetUrl.toString()
    setTimeout(() => {
      if (originalHref === null) anchor.removeAttribute('href')
      else anchor.setAttribute('href', originalHref)
    }, 0)
  }

  function readLandingAttribution(landingHref, referrer) {
    const landingUrl = new URL(landingHref)
    const utmSource = safeValue(landingUrl.searchParams.get('utm_source'))
    if (utmSource) {
      const campaign = safeValue(landingUrl.searchParams.get('utm_campaign'))
      return {
        source: utmSource,
        medium: safeValue(landingUrl.searchParams.get('utm_medium')) || 'referral',
        ...(campaign ? { campaign } : {}),
      }
    }
    const hostname = referrerHostname(referrer)
    if (!hostname || isOwnedHost(hostname)) return null
    const searchEngine = SEARCH_ENGINE_HOSTS.find(([, pattern]) => pattern.test(hostname))
    if (searchEngine) return { source: searchEngine[0], medium: 'organic' }
    const source = safeValue(hostname.replace(/^www\./, ''))
    return source ? { source, medium: 'referral' } : null
  }

  function readConsent() {
    const values = document.cookie
      .split(';')
      .map(part => part.trim())
      .filter(part => part.startsWith(`${CONSENT_COOKIE}=`))
      .map(part => part.slice(CONSENT_COOKIE.length + 1))
    if (values.length === 0) return 'undecided'
    const states = new Set(values.map((value) => {
      if (value === 'granted' || value === 'accepted' || value === 'true') return 'accepted'
      if (value === 'denied' || value === 'declined' || value === 'false') return 'declined'
      return 'undecided'
    }))
    return states.size === 1 ? states.values().next().value : 'undecided'
  }

  function safeValue(value) {
    const trimmed = (value || '').trim()
    return SAFE_VALUE_PATTERN.test(trimmed) ? trimmed : ''
  }

  function referrerHostname(referrer) {
    try {
      const url = new URL(referrer)
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.hostname.toLowerCase() : ''
    } catch {
      return ''
    }
  }

  function referrerOrigin(referrer) {
    try {
      const url = new URL(referrer)
      return url.protocol === 'http:' || url.protocol === 'https:' ? `${url.origin}/` : ''
    } catch {
      return ''
    }
  }

  function isOwnedHost(hostname) {
    return OWNED_ROOT_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))
  }

  function gtag() {
    try {
      // eslint-disable-next-line prefer-rest-params
      window.gtag?.apply(null, arguments)
    } catch {
      /* Analytics must never break the page. */
    }
  }
})()
