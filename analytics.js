/**
 * Spatius docs analytics.
 *
 * Mintlify injects every .js file in the content directory into every page and
 * runs it after the page becomes interactive. There is no build step here, so
 * this file is plain browser JS with no imports and no bundler env vars.
 *
 * Behaviour is aligned with the marketing site (`spatius-website/src/analytics.ts`):
 * consent gate, cookie persistence shared across `.spatius.ai`, PII scrubbing in
 * `before_send`, and a `project` super property so all front ends stay separable
 * inside one PostHog project. See `spatius-website/docs/cross-site-analytics.md`.
 */
(function () {
  'use strict'

  var POSTHOG_API_KEY = 'phc_BJpW8hXVP84eK4bnQsRevfNy7uDdD7PAmxafqxLBerfj'
  var POSTHOG_HOST = 'https://i.spatialwalk.ai'
  var PROJECT_NAME = 'docs'
  var TRACK_EVENTS = true

  // Written by the marketing site on the shared root domain, so a visitor who
  // answered the cookie banner on spatius.ai arrives here already decided.
  var CONSENT_COOKIE = 'spatius_analytics_consent'
  var CONSENT_CHANGE_EVENT = 'spatius-cookie-consent-change'
  var SHARED_COOKIE_DOMAIN = 'spatius.ai'
  var CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
  var COOKIE_POLICY_URL = 'https://spatius.ai/cookie-policy'

  var BANNER_ID = 'spatius-docs-cookie-banner'
  var SEARCH_DEBOUNCE_MS = 900
  var MAX_SEARCH_TERM_LENGTH = 200
  var SCROLL_MILESTONES = [25, 50, 75, 100]
  // Docs readers stare at a code block without touching anything, so the idle
  // cutoff is deliberately looser than the usual 30s used on marketing pages.
  var IDLE_TIMEOUT_MS = 60 * 1000
  var MAX_ENGAGED_MS = 30 * 60 * 1000
  var IDLE_CHECK_INTERVAL_MS = 5 * 1000
  var NOT_FOUND_TITLE = 'Page Not Found'
  var NOT_FOUND_CHECK_DELAY_MS = 1200
  var AUTH_API_BASE_URL = 'https://api.studio.spatius.ai'

  if (!TRACK_EVENTS || !POSTHOG_API_KEY || typeof window === 'undefined') return

  var posthog = null
  var capturing = false
  var loadPromise = null
  var queue = []
  var reachedMilestones = {}
  var lastSearchTerm = ''
  var searchTimer = null
  var bannerObserver = null
  var engagement = null
  var reportedNotFound = {}
  var knownUserId = ''
  var knownUserTraits = null

  start()

  function start() {
    applyConsent()
    watchConsent()
    if (readConsent() === 'undecided') showBanner()
    installSearchTracking()
    installClickTracking()
    installScrollTracking()
    installEngagementTracking()
    installNotFoundTracking()
    resolveIdentity()
    installRouteChangeReset()
  }

  /* ---------------------------------------------------------------- consent */

  function readConsent() {
    var prefix = encodeURIComponent(CONSENT_COOKIE) + '='
    var values = document.cookie
      .split(';')
      .map(function (part) { return part.trim() })
      .filter(function (part) { return part.indexOf(prefix) === 0 })
      .map(function (part) {
        try {
          return decodeURIComponent(part.slice(prefix.length))
        } catch (error) {
          return ''
        }
      })

    if (values.length === 0) return 'undecided'
    // Duplicate cookies on different domains can disagree; treat that as undecided
    // rather than guessing, matching the marketing site's resolution rule.
    var unique = values.filter(function (value, index, all) { return all.indexOf(value) === index })
    if (unique.length !== 1) return 'undecided'

    var value = unique[0]
    if (value === 'granted' || value === 'accepted' || value === 'true') return 'accepted'
    if (value === 'denied' || value === 'declined' || value === 'false') return 'declined'
    return 'undecided'
  }

  // Written on the shared root domain so a choice made here also settles the
  // banner on www.spatius.ai and app.spatius.ai, and vice versa.
  function writeConsent(consent) {
    var name = encodeURIComponent(CONSENT_COOKIE)
    var domain = sharedCookieDomain()
    var secure = window.location.protocol === 'https:' ? '; Secure' : ''
    var attributes = '; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '') + secure

    // Expire both scopes first: a host-only cookie left over from an earlier
    // visit would otherwise shadow the shared one and read back as a conflict.
    document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + secure
    if (domain) document.cookie = name + '=; Max-Age=0' + attributes

    var value = consent === 'accepted' ? 'granted' : 'denied'
    document.cookie = name + '=' + value + '; Max-Age=' + CONSENT_COOKIE_MAX_AGE + attributes

    applyConsent()
    hideBanner()
    try {
      window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, {
        detail: { consent: consent, value: consent },
      }))
    } catch (error) {
      /* The cookie is already authoritative. */
    }
  }

  function sharedCookieDomain() {
    var hostname = window.location.hostname.toLowerCase()
    return hostname === SHARED_COOKIE_DOMAIN || hostname.indexOf('.' + SHARED_COOKIE_DOMAIN) === hostname.length - SHARED_COOKIE_DOMAIN.length - 1
      ? '.' + SHARED_COOKIE_DOMAIN
      : undefined
  }

  function applyConsent() {
    if (readConsent() === 'accepted') initPostHog()
    else shutdown()
  }

  function watchConsent() {
    var sync = function () {
      applyConsent()
      // Another tab or another *.spatius.ai site may have answered in the
      // meantime, which retires the banner here without a click.
      if (readConsent() === 'undecided') showBanner()
      else hideBanner()
    }
    window.addEventListener('focus', sync)
    window.addEventListener('storage', sync)
    window.addEventListener(CONSENT_CHANGE_EVENT, sync)
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') sync()
    })
  }

  /* ----------------------------------------------------------------- banner */

  function showBanner() {
    if (readConsent() !== 'undecided' || document.getElementById(BANNER_ID)) return
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', showBanner, { once: true })
      return
    }

    var banner = document.createElement('div')
    banner.id = BANNER_ID
    banner.setAttribute('role', 'dialog')
    banner.setAttribute('aria-label', 'Cookie consent')
    // Excluded from autocapture so answering the banner is never itself an event.
    banner.setAttribute('data-ph-no-capture', '')
    // Mintlify's CSS variables resolve to transparent here, which let the page
    // show through the banner, so the palette is spelled out per theme instead.
    var dark = isDarkTheme()
    banner.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'left:1.5rem', 'z-index:2147483000',
      'width:calc(100% - 3rem)', 'max-width:26rem', 'box-sizing:border-box',
      'padding:1.25rem', 'border-radius:0.75rem',
      'background:' + (dark ? '#1c1c1f' : '#ffffff'),
      'color:' + (dark ? '#e5e7eb' : '#1f2937'),
      'border:1px solid ' + (dark ? 'rgba(255,255,255,0.14)' : 'rgba(15,15,40,0.12)'),
      'box-shadow:0 10px 38px -10px rgba(15,15,40,' + (dark ? '0.7' : '0.35') + ')',
      'font-size:0.8125rem', 'line-height:1.55',
      'font-family:inherit',
    ].join(';')

    var title = document.createElement('div')
    title.textContent = 'Cookie consent'
    title.style.cssText = 'font-weight:600;font-size:0.9375rem;margin-bottom:0.5rem'

    var body = document.createElement('div')
    body.textContent = 'We use cookies to understand how developers use these docs and to improve them. If you reject, we keep only what the site needs to function.'
    body.style.cssText = 'opacity:0.85;margin-bottom:0.5rem'

    var policy = document.createElement('a')
    policy.href = COOKIE_POLICY_URL
    policy.target = '_blank'
    policy.rel = 'noopener noreferrer'
    policy.textContent = 'Cookie Policy'
    policy.style.cssText = 'font-size:0.75rem;text-decoration:underline;opacity:0.75;color:inherit'

    var actions = document.createElement('div')
    actions.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-top:1rem'

    actions.appendChild(makeButton('Reject', false, function () { writeConsent('declined') }))
    actions.appendChild(makeButton('Accept', true, function () { writeConsent('accepted') }))

    banner.appendChild(title)
    banner.appendChild(body)
    banner.appendChild(policy)
    banner.appendChild(actions)
    document.body.appendChild(banner)
    keepBannerMounted()
  }

  // React hydration reconciles <body> and discards nodes it did not render, so
  // a banner appended before hydration finishes silently disappears. Watch for
  // that removal and re-mount, until the reader actually answers.
  function keepBannerMounted() {
    if (bannerObserver || typeof MutationObserver === 'undefined') return
    bannerObserver = new MutationObserver(function () {
      if (readConsent() !== 'undecided') {
        bannerObserver.disconnect()
        bannerObserver = null
        return
      }
      if (!document.getElementById(BANNER_ID)) showBanner()
    })
    bannerObserver.observe(document.body, { childList: true })
  }

  function isDarkTheme() {
    try {
      var root = document.documentElement
      if (root.classList.contains('dark')) return true
      if (root.classList.contains('light')) return false
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (error) {
      return false
    }
  }

  function makeButton(label, primary, onClick) {
    var button = document.createElement('button')
    button.type = 'button'
    button.textContent = label
    button.style.cssText = [
      'padding:0.5rem 0.75rem', 'border-radius:0.5rem', 'font-size:0.8125rem',
      'font-weight:500', 'cursor:pointer', 'font-family:inherit', 'width:100%',
      primary ? 'background:#9399E3;color:#ffffff;border:1px solid #9399E3'
        : 'background:transparent;color:inherit;border:1px solid ' + (isDarkTheme() ? 'rgba(255,255,255,0.22)' : 'rgba(15,15,40,0.18)'),
    ].join(';')
    button.addEventListener('click', onClick)
    return button
  }

  function hideBanner() {
    if (bannerObserver) {
      bannerObserver.disconnect()
      bannerObserver = null
    }
    var banner = document.getElementById(BANNER_ID)
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner)
  }

  /* ---------------------------------------------------------------- posthog */

  function initPostHog() {
    if (capturing || loadPromise) return loadPromise || Promise.resolve()

    loadPromise = loadPostHogScript()
      .then(function (client) {
        if (readConsent() !== 'accepted') return
        client.init(POSTHOG_API_KEY, {
          api_host: POSTHOG_HOST,
          person_profiles: 'identified_only',
          persistence: 'cookie',
          // The whole point of the docs integration: share the anonymous and
          // identified distinct_id with www.spatius.ai and app.spatius.ai.
          cross_subdomain_cookie: true,
          ip: false,
          save_campaign_params: true,
          save_referrer: true,
          capture_pageview: 'history_change',
          capture_pageleave: false,
          autocapture: {
            dom_event_allowlist: ['click', 'submit'],
            element_allowlist: ['a', 'button', 'form'],
            css_selector_ignorelist: ['.ph-no-capture', '[data-ph-no-capture]'],
            capture_copied_text: false,
          },
          disable_session_recording: true,
          disable_surveys: true,
          disable_surveys_automatic_display: true,
          disable_product_tours: true,
          disable_web_experiments: true,
          disable_conversations: true,
          disable_external_dependency_loading: true,
          advanced_disable_flags: true,
          before_send: scrubEvent,
        })
        client.register({ project: PROJECT_NAME, environment: readEnvironment() })
        client.opt_in_capturing({ captureEventName: false })
        posthog = client
        capturing = true
        // The identity probe races SDK loading; whichever finishes second wires
        // the id in, so it is applied here too rather than only in the probe.
        if (knownUserId) applyIdentity(knownUserId)
        flushQueue()
      })
      .catch(function () {
        loadPromise = null
      })

    return loadPromise
  }

  function loadPostHogScript() {
    return new Promise(function (resolve, reject) {
      if (window.posthog && window.posthog.__loaded) {
        resolve(window.posthog)
        return
      }

      var script = document.createElement('script')
      script.src = POSTHOG_HOST.replace(/\/$/, '') + '/static/array.js'
      script.async = true
      script.onload = function () {
        if (window.posthog) resolve(window.posthog)
        else reject(new Error('posthog missing after load'))
      }
      script.onerror = function () { reject(new Error('posthog script failed')) }
      document.head.appendChild(script)
    })
  }

  function shutdown() {
    queue.length = 0
    capturing = false
    if (!posthog) return
    try {
      posthog.reset()
      posthog.opt_out_capturing()
    } catch (error) {
      /* Persistence removal below is the meaningful part. */
    }
  }

  function capture(eventName, properties, sendInstantly) {
    if (readConsent() !== 'accepted') return
    if (!capturing) {
      if (queue.length >= 50) queue.shift()
      queue.push({ name: eventName, properties: properties, sendInstantly: sendInstantly })
      initPostHog()
      return
    }
    try {
      posthog.capture(eventName, properties, sendInstantly ? { send_instantly: true } : undefined)
    } catch (error) {
      /* Analytics must never break the docs. */
    }
  }

  function flushQueue() {
    while (queue.length > 0) {
      var event = queue.shift()
      try {
        posthog.capture(event.name, event.properties, event.sendInstantly ? { send_instantly: true } : undefined)
      } catch (error) {
        return
      }
    }
  }

  function readEnvironment() {
    var host = window.location.hostname
    if (host === 'docs.spatius.ai') return 'production'
    if (host === 'localhost' || host === '127.0.0.1') return 'development'
    return 'preview'
  }

  /* --------------------------------------------------------------- scrubbing */

  // Docs pages carry no user input beyond the search box, so this is a tighter
  // version of the marketing site's sanitizer: credentials, emails, and phone
  // numbers are the realistic leak vectors in a free-text query.
  var CREDENTIAL_PATTERN = /(?:bearer\s+\S+|basic\s+[a-z0-9+/=._~-]+|AIza[A-Za-z0-9_-]{20,}|(?:^|[\s=:_-])(?:sk|pk|phc|gh[oprsu]|xox[baprs])[-_][a-z0-9._-]+|eyJ[a-zA-Z0-9_-]{6,}\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/gi
  // The optional scheme word is part of the match so `Authorization: Bearer xyz`
  // redacts the credential rather than stopping at `Bearer`.
  var LABELLED_SECRET_PATTERN = /\b(token|secret|api[_-]?key|password|passcode|authorization|auth|credential|access[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key)\b\s*[:=]\s*(?:(?:bearer|basic|token)\s+)?(?:"[^"]*"|'[^']*'|[^\s,;&}\]]+)/gi
  var EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi
  // Anchored on both sides so the pattern cannot start inside a UUID segment or
  // a long numeric id — docs readers search for those constantly.
  var PHONE_PATTERN = /(^|[^0-9A-Za-z_-])(\+?\d[\d\s().-]{7,}\d)(?![0-9A-Za-z_-])/g
  var UUID_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi
  var SENSITIVE_QUERY_PARAM = /token|secret|key|password|code|auth|access|refresh|credential|email|phone|name/i

  function scrubText(value, maxLength) {
    if (typeof value !== 'string' || value === '') return ''
    var text = value.normalize ? value.normalize('NFKC') : value
    text = text.replace(LABELLED_SECRET_PATTERN, function (match, label) {
      return label + '=[redacted]'
    })
    text = text.replace(CREDENTIAL_PATTERN, '[credential-redacted]')
    text = text.replace(EMAIL_PATTERN, '[email-redacted]')
    text = redactPhones(text)
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text
  }

  // A phone number and an avatar id are both long digit runs, so shape alone is
  // not enough. UUID spans are mapped first and left untouched; what remains is
  // redacted only when it is punctuated like a phone number (spaces, dashes,
  // parens or a leading +) rather than one unbroken run of digits.
  function redactPhones(value) {
    var protectedRanges = []
    var uuid
    UUID_PATTERN.lastIndex = 0
    while ((uuid = UUID_PATTERN.exec(value)) !== null) {
      protectedRanges.push([uuid.index, uuid.index + uuid[0].length])
    }

    return value.replace(PHONE_PATTERN, function (match, prefix, candidate, offset) {
      var start = offset + prefix.length
      var end = start + candidate.length
      for (var i = 0; i < protectedRanges.length; i += 1) {
        if (start >= protectedRanges[i][0] && end <= protectedRanges[i][1]) return match
      }

      var digits = candidate.replace(/\D/g, '')
      if (digits.length < 8 || digits.length > 15) return match
      var punctuated = /[\s().-]/.test(candidate) || candidate.charAt(0) === '+'
      return punctuated ? prefix + '[phone-redacted]' : match
    })
  }

  function scrubUrl(value) {
    try {
      var url = new URL(value, window.location.origin)
      if (url.protocol === 'mailto:') return 'mailto:[redacted]'
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return url.protocol + '[redacted]'
      url.username = ''
      url.password = ''
      url.hash = ''
      Array.from(url.searchParams.keys()).forEach(function (key) {
        if (SENSITIVE_QUERY_PARAM.test(key)) url.searchParams.set(key, '[redacted]')
      })
      return url.toString()
    } catch (error) {
      return scrubText(String(value), 500)
    }
  }

  function scrubEvent(event) {
    if (!event || !event.properties) return event
    var properties = event.properties

    ;['$current_url', '$initial_current_url', '$session_entry_url'].forEach(function (key) {
      if (typeof properties[key] === 'string') properties[key] = scrubUrl(properties[key])
    })
    ;['$referrer', '$initial_referrer', '$session_entry_referrer'].forEach(function (key) {
      var value = properties[key]
      if (typeof value !== 'string' || value === '' || value === '$direct') return
      try {
        properties[key] = new URL(value).origin + '/'
      } catch (error) {
        properties[key] = ''
      }
    })

    // Autocapture ships the clicked element's visible text, which on a docs page
    // can be a whole code line the reader selected.
    ;['$el_text', 'search_term'].forEach(function (key) {
      if (typeof properties[key] === 'string') properties[key] = scrubText(properties[key], MAX_SEARCH_TERM_LENGTH)
    })

    delete properties.email
    delete properties.username
    delete properties.nickname
    return event
  }

  /* ------------------------------------------------------------------ search */

  // The search panel mounts only after the reader opens it, so bind on the
  // document and identify the field by role/placeholder rather than caching a node.
  function installSearchTracking() {
    document.addEventListener('input', function (event) {
      var input = event.target
      if (!isSearchInput(input)) return

      var term = scrubText(String(input.value || '').trim(), MAX_SEARCH_TERM_LENGTH)
      if (searchTimer) clearTimeout(searchTimer)
      if (term.length < 2) return

      // Debounced so a typed query reports once instead of per keystroke.
      searchTimer = setTimeout(function () {
        if (term === lastSearchTerm) return
        lastSearchTerm = term
        capture('docs.search.queried', {
          search_term: term,
          search_term_length: term.length,
          from_path: window.location.pathname,
        })
      }, SEARCH_DEBOUNCE_MS)
    }, true)

    document.addEventListener('click', function (event) {
      var target = event.target
      if (!target || !target.closest) return

      var entry = target.closest('#search-bar-entry, #search-bar-entry-mobile, [aria-label="Open search"]')
      if (entry) {
        capture('docs.search.opened', { from_path: window.location.pathname })
        return
      }

      // A click on a link while the search field holds a query is the result
      // selection: it tells us which query led to which page.
      var link = target.closest('a[href]')
      if (!link || !lastSearchTerm) return
      var panel = link.closest('[role="dialog"], [cmdk-root], [data-search-results]')
      if (!panel) return

      capture('docs.search.result_clicked', {
        search_term: lastSearchTerm,
        target_path: safePathname(link.getAttribute('href')),
        from_path: window.location.pathname,
      })
    }, true)
  }

  function isSearchInput(node) {
    if (!node || node.tagName !== 'INPUT') return false
    if (node.type && ['text', 'search', ''].indexOf(node.type) === -1) return false
    if (node.closest('#search-bar-entry, #search-bar-entry-mobile')) return true
    if (node.closest('[role="dialog"], [cmdk-root]')) return true
    var placeholder = (node.getAttribute('placeholder') || '').toLowerCase()
    var label = (node.getAttribute('aria-label') || '').toLowerCase()
    return placeholder.indexOf('search') !== -1 || label.indexOf('search') !== -1
  }

  /* ------------------------------------------------------------------ clicks */

  function installClickTracking() {
    document.addEventListener('click', function (event) {
      var target = event.target
      if (!target || !target.closest) return

      var copyPage = target.closest('[aria-label="Copy page"]')
      if (copyPage) {
        capture('docs.page.copied', { from_path: window.location.pathname })
        return
      }

      // The contextual menu (Ask ChatGPT / Claude / MCP / Cursor …) is configured
      // in docs.json; knowing which entry readers actually use is the point.
      var contextual = target.closest('[data-contextual-option], [aria-label^="Open in"], [aria-label^="Ask"]')
      if (contextual) {
        capture('docs.contextual.clicked', {
          option: scrubText(
            contextual.getAttribute('data-contextual-option')
              || contextual.getAttribute('aria-label')
              || readText(contextual),
            80,
          ),
          from_path: window.location.pathname,
        })
        return
      }

      var codeCopy = target.closest('[aria-label*="Copy" i]:not([aria-label="Copy page"])')
      if (codeCopy && codeCopy.closest('pre, [data-code-block], .code-block')) {
        var block = codeCopy.closest('pre, [data-code-block], .code-block')
        capture('docs.code.copied', {
          language: readCodeLanguage(block),
          from_path: window.location.pathname,
        })
        return
      }

      // In-content code tabs. The sibling labels travel with the event so a
      // platform switcher (Web/iOS/Android) stays separable from a package
      // manager switcher (npm/pnpm/yarn) without post-processing in PostHog.
      var tab = target.closest('[role="tab"]')
      if (tab) {
        var tablist = tab.closest('[role="tablist"]')
        var labels = tablist
          ? Array.prototype.map.call(tablist.querySelectorAll('[role="tab"]'), readText)
          : []
        capture('docs.tab.switched', {
          tab_label: scrubText(readText(tab), 40),
          tab_group: scrubText(labels.join('|'), 120),
          tab_index: labels.indexOf(readText(tab)),
          from_path: window.location.pathname,
        })
        return
      }

      // Sidebar groups collapse and expand without navigating, so the click is
      // the only signal that a reader is weighing an integration path.
      var group = target.closest('button[aria-expanded]')
      if (group && group.closest('#sidebar')) {
        capture('docs.nav.group_toggled', {
          group_label: scrubText(readText(group), 80),
          // The attribute still holds the pre-click state at this point.
          expanded: group.getAttribute('aria-expanded') === 'false',
          from_path: window.location.pathname,
        })
        return
      }

      var link = target.closest('a[href]')
      if (!link) return
      var href = link.getAttribute('href') || ''
      if (!href || href.charAt(0) === '#') return

      var url = safeUrl(href)
      if (!url) return
      var isExternal = url.origin !== window.location.origin

      if (!isExternal) {
        // $pageview records that a page was reached, not how. Navigation clicks
        // are what reveal which tab and which SDK readers actually reach for.
        var navArea = readNavArea(link)
        if (navArea) {
          capture('docs.nav.clicked', {
            nav_area: navArea,
            nav_label: scrubText(readText(link), 80),
            target_path: url.pathname,
            from_path: window.location.pathname,
          })
        }
        return
      }

      capture('docs.outbound.clicked', {
        target_domain: url.hostname,
        target_url: scrubUrl(url.toString()),
        link_text: scrubText(readText(link), 120),
        from_path: window.location.pathname,
      })
    }, true)
  }

  // Distinguishes the three navigation surfaces so a report can separate
  // "which top tab" from "which SDK page in the sidebar".
  function readNavArea(link) {
    if (link.closest('.nav-tabs')) return 'top_tab'
    if (link.closest('#sidebar')) return 'sidebar'
    if (link.closest('#navbar')) return 'navbar'
    return ''
  }

  function readCodeLanguage(block) {
    if (!block) return ''
    var className = block.className || ''
    var match = /language-([a-z0-9+#-]+)/i.exec(className)
    if (match) return match[1]
    var inner = block.querySelector && block.querySelector('[class*="language-"]')
    if (inner) {
      var innerMatch = /language-([a-z0-9+#-]+)/i.exec(inner.className || '')
      if (innerMatch) return innerMatch[1]
    }
    return ''
  }

  /* ------------------------------------------------------------------ scroll */

  function installScrollTracking() {
    var ticking = false
    window.addEventListener('scroll', function () {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(function () {
        ticking = false
        reportScrollDepth()
      })
    }, { passive: true })
  }

  function reportScrollDepth() {
    var doc = document.documentElement
    var scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable <= 0) return

    var percent = Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / scrollable) * 100))
    if (engagement && percent > engagement.maxScrollPercent) engagement.maxScrollPercent = percent

    for (var index = 0; index < SCROLL_MILESTONES.length; index += 1) {
      var milestone = SCROLL_MILESTONES[index]
      var key = window.location.pathname + ':' + milestone
      if (percent < milestone || reachedMilestones[key]) continue
      reachedMilestones[key] = true
      capture('docs.page.scrolled', { depth_percent: milestone, from_path: window.location.pathname })
    }
  }

  /* -------------------------------------------------------------- identity */

  /**
   * Signed-in identity, when there is one.
   *
   * The Studio session cookie is HttpOnly on `.spatius.ai`, so its contents are
   * invisible to this script — but the browser still attaches it to a credentialed
   * request, which is how the marketing site resolves the same thing. A 401 simply
   * means "anonymous reader"; nothing prompts, and nothing blocks.
   *
   * Identity fields match what Studio already sends on its `user_info` event,
   * so a person looks the same whichever front end they came through.
   */
  function resolveIdentity() {
    if (!window.fetch) return
    window.fetch(AUTH_API_BASE_URL + '/v1/auth/me', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        if (!response.ok) return null
        return response.json()
      })
      .then(function (data) {
        if (!data) return
        var user = data.user || (data.data && (data.data.user || data.data)) || null
        var userId = user && user.id
        if (!userId || typeof userId !== 'string') return
        applyIdentity(userId, {
          email: user.email || '',
          username: user.username || '',
          nickname: user.nickname || '',
        })
      })
      .catch(function () {
        /* Offline, blocked, or logged out — anonymous is a valid outcome. */
      })
  }

  function applyIdentity(userId, traits) {
    knownUserId = userId
    if (traits) knownUserTraits = traits
    if (!capturing || !posthog) return
    var attributes = knownUserTraits || {}
    try {
      // identify() ties this browser's history to the account and stores the
      // traits on the Person; register() puts the id on every event so cohorts
      // work without a Person join.
      posthog.identify(userId, {
        email: attributes.email || undefined,
        username: attributes.username || undefined,
        nickname: attributes.nickname || undefined,
      })
      posthog.register({ user_id: userId })
    } catch (error) {
      /* Analytics must never break the docs. */
    }
  }

  /* --------------------------------------------------------------- not found */

  // Mintlify serves its 404 page with HTTP 200 and renders it client-side, so
  // the status code is useless here — the rendered title is the actual signal.
  function checkNotFound() {
    if (document.title !== NOT_FOUND_TITLE) return
    var path = window.location.pathname
    if (reportedNotFound[path]) return
    reportedNotFound[path] = true

    capture('docs.page.not_found', {
      missing_path: path,
      // Where the dead link was clicked, which is what makes this actionable:
      // an internal referrer means our own docs point at a page that is gone.
      referrer: document.referrer ? scrubUrl(document.referrer) : '',
      referrer_is_internal: document.referrer.indexOf(window.location.origin) === 0,
    })
  }

  function installNotFoundTracking() {
    // Content renders after this script runs, so the first check has to wait.
    window.setTimeout(checkNotFound, NOT_FOUND_CHECK_DELAY_MS)
  }

  /* -------------------------------------------------------------- engagement */

  /**
   * Active reading time per page.
   *
   * Wall-clock time is close to meaningless here: a reader parks a docs tab for
   * a whole afternoon. Time only accrues while the tab is foregrounded AND the
   * reader has interacted within IDLE_TIMEOUT_MS, and a single page is capped at
   * MAX_ENGAGED_MS so one forgotten tab cannot swamp an average.
   */
  function installEngagementTracking() {
    resetEngagement()

    var markActive = function () {
      if (!engagement) return
      var now = Date.now()
      // Returning from idle starts a fresh active span rather than back-filling
      // the gap, which is what keeps "walked away" out of the number.
      if (engagement.idle) {
        engagement.idle = false
        engagement.spanStart = now
      }
      // Reading time starts at the first real interaction, not at page load —
      // a tab opened in the background should not accrue anything.
      if (!engagement.interacted) {
        engagement.interacted = true
        engagement.spanStart = now
      }
      engagement.lastInteraction = now
    }

    var events = ['scroll', 'mousemove', 'mousedown', 'keydown', 'click', 'touchstart', 'wheel']
    for (var i = 0; i < events.length; i += 1) {
      window.addEventListener(events[i], markActive, { passive: true, capture: true })
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        accrueActiveTime()
        flushEngagement('hidden')
      } else {
        if (!engagement) return
        engagement.spanStart = Date.now()
        engagement.lastInteraction = Date.now()
        engagement.idle = false
        // Time already reported stays banked in activeMs; clearing the flag lets
        // the rest of this visit be reported when the reader finally leaves.
        engagement.reported = false
        engagement.reportedMs = engagement.activeMs
      }
    })

    // Idle has to be detected by polling: the defining feature of going idle is
    // that no further events arrive to trigger the check.
    window.setInterval(function () {
      if (!engagement || engagement.idle || document.visibilityState === 'hidden') return
      if (Date.now() - engagement.lastInteraction < IDLE_TIMEOUT_MS) return
      accrueActiveTime()
      engagement.idle = true
      engagement.idleCount += 1
    }, IDLE_CHECK_INTERVAL_MS)

    // pagehide fires in cases where unload/beforeunload do not, notably the
    // iOS back-forward cache.
    window.addEventListener('pagehide', function () {
      accrueActiveTime()
      flushEngagement('pagehide')
    })
  }

  function resetEngagement() {
    var now = Date.now()
    engagement = {
      path: window.location.pathname,
      pageStart: now,
      spanStart: now,
      lastInteraction: now,
      activeMs: 0,
      idle: document.visibilityState === 'hidden',
      idleCount: 0,
      maxScrollPercent: 0,
      interacted: false,
      reported: false,
      reportedMs: 0,
    }
  }

  function accrueActiveTime() {
    if (!engagement || engagement.idle) return
    // A page nobody ever touched contributes nothing: without this, opening a
    // tab and walking away would bank IDLE_TIMEOUT_MS of "reading".
    if (!engagement.interacted) return
    var now = Date.now()
    var span = now - engagement.spanStart
    // Once the reader has gone quiet past the cutoff, the silent stretch is not
    // reading time — credit the span only up to their last real interaction.
    if (now - engagement.lastInteraction >= IDLE_TIMEOUT_MS) {
      span = Math.max(0, engagement.lastInteraction - engagement.spanStart)
    }
    if (span > 0) engagement.activeMs = Math.min(MAX_ENGAGED_MS, engagement.activeMs + span)
    engagement.spanStart = now
  }

  function flushEngagement(reason) {
    if (!engagement || engagement.reported) return
    // Only the time accrued since the last report, so a reader who tabs away and
    // back several times is not counted once per return.
    var pendingMs = engagement.activeMs - (engagement.reportedMs || 0)
    var activeSeconds = Math.round(pendingMs / 1000)
    // Sub-second visits are navigation noise, not reading.
    if (activeSeconds < 1) return
    engagement.reported = true
    engagement.reportedMs = engagement.activeMs

    capture('docs.page.engaged', {
      active_seconds: activeSeconds,
      total_seconds: Math.round((Date.now() - engagement.pageStart) / 1000),
      max_scroll_percent: engagement.maxScrollPercent,
      idle_count: engagement.idleCount,
      end_reason: reason,
      from_path: engagement.path,
    // The page may be going away right now, so this cannot wait in the batch.
    }, true)
  }

  /* ------------------------------------------------------------- route reset */

  // Mintlify is a SPA: PostHog handles $pageview via history_change, but the
  // per-page state tracked here has to be reset on navigation too.
  function installRouteChangeReset() {
    var lastPath = window.location.pathname
    var onRouteChange = function () {
      if (window.location.pathname === lastPath) return
      // Settle the page being left before the path changes under us.
      accrueActiveTime()
      flushEngagement('route_change')
      lastPath = window.location.pathname
      lastSearchTerm = ''
      reachedMilestones = {}
      resetEngagement()
      window.setTimeout(checkNotFound, NOT_FOUND_CHECK_DELAY_MS)
      // A client-side navigation can re-render the tree the banner lives in.
      if (readConsent() === 'undecided') showBanner()
    }

    window.addEventListener('popstate', onRouteChange)
    wrapHistoryMethod('pushState', onRouteChange)
    wrapHistoryMethod('replaceState', onRouteChange)
  }

  function wrapHistoryMethod(name, callback) {
    var original = window.history[name]
    if (typeof original !== 'function') return
    window.history[name] = function () {
      var result = original.apply(this, arguments)
      try {
        callback()
      } catch (error) {
        /* Navigation must not depend on analytics. */
      }
      return result
    }
  }

  /* ------------------------------------------------------------------ helpers */

  function safeUrl(value) {
    try {
      return new URL(value, window.location.origin)
    } catch (error) {
      return null
    }
  }

  function safePathname(value) {
    var url = safeUrl(value || '')
    return url ? url.pathname : ''
  }

  function readText(node) {
    if (!node) return ''
    return (node.textContent || '').trim().replace(/\s+/g, ' ')
  }
})()
