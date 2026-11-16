/**
 * Google Analytics 4 for docs.spatius.ai, sharing the stream of the marketing
 * site and Studio so a visit that starts here is credited to its source when it
 * leads to a Studio signup.
 *
 * Cookie UI, regional defaults, GPC and persistence come from the shared
 * versioned component maintained in spatius-site. This file only adapts its
 * effective permission to GA4 and preserves attribution while undecided.
 *
 * Mintlify includes this file on every page and runs it once per visit.
 */
(function () {
  const MEASUREMENT_ID = 'G-5YREV5DMW3'
  const DOCS_HOST = 'docs.spatius.ai'
  const STUDIO_ORIGIN = 'https://app.spatius.ai'
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
  if (window.location.hostname !== DOCS_HOST || window.__spatiusDocsAnalyticsStarted) return
  window.__spatiusDocsAnalyticsStarted = true

  const landingAttribution = readLandingAttribution(window.location.href, document.referrer)
  let loaded = false
  let previousPageLocation = ''

  // Nothing is collected until the shared runtime resolves effective permission.
  loadConsentComponent()
  window.addEventListener('mintlify:navigate', () => {
    window.SpatiusConsent?.mount({ settingsLink: true })
    syncAnalytics()
  })
  window.addEventListener('focus', syncAnalytics)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncAnalytics()
  })

  function loadConsentComponent() {
    const script = document.createElement('script')
    script.src = 'https://www.spatius.ai/consent/v1/consent.js'
    script.async = true
    script.onload = () => {
      const consent = window.SpatiusConsent
      if (consent?.version !== 1) return
      consent.subscribeAnalyticsConsent(syncAnalytics)
      consent.mount({ settingsLink: true })
      void consent.loadConsentRegion().then(syncAnalytics)
      syncAnalytics()
    }
    script.onerror = () => {
      // Leave analytics disabled, but let the visitor retry settings.
      const retry = document.createElement('button')
      retry.textContent = 'Retry Cookie Settings'
      retry.style.cssText = 'position:fixed;bottom:8px;right:12px;z-index:9999;background:white;color:#333;padding:8px;border:1px solid #ddd'
      retry.onclick = () => { retry.remove(); script.remove(); loadConsentComponent() }
      document.body.appendChild(retry)
    }
    document.head.appendChild(script)
  }

  function syncAnalytics() {
    const allowed = readConsent() === 'accepted'
    window[`ga-disable-${MEASUREMENT_ID}`] = !allowed
    if (loaded) window.gtag('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' })
    if (!allowed) {
      previousPageLocation = ''
      for (const item of document.cookie.split(';')) {
        const name = item.trim().split('=')[0]
        if (!/^_ga(?:_|$)/.test(name)) continue
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.spatius.ai; SameSite=Lax; Secure`
      }
      return
    }
    loadGa4()
    trackPageView()
  }
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
    if (pageLocation === previousPageLocation) return
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
    return window.SpatiusConsent?.readAnalyticsConsent() ?? 'undecided'
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
