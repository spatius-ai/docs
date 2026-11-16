import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const source = readFileSync(new URL('../ga4.js', import.meta.url), 'utf8')
function start(state = 'undecided', fail = false) {
  const listeners = new Map()
  const cookieWrites = []
  const scripts = []
  let subscriber
  let current = state
  const context = {
    URL, URLSearchParams, Set, Map, setTimeout, clearTimeout,
    location: { hostname: 'docs.spatius.ai', href: 'https://docs.spatius.ai/start' },
    addEventListener: (name, fn) => listeners.set(name, fn),
    document: {
      referrer: '', title: 'Docs', hidden: false,
      get cookie() { return '_ga=old; _ga_5YREV5DMW3=old; login=keep' },
      set cookie(value) { cookieWrites.push(value) },
      addEventListener: (name, fn) => listeners.set(name, fn),
      createElement: tag => ({ tag, style: {}, remove() {} }),
      body: { appendChild() {} },
      head: { appendChild(script) {
        scripts.push(script)
        if (script.src?.includes('/consent/v1/')) {
          if (fail) script.onerror()
          else {
            context.SpatiusConsent = {
              version: 1, mount() {}, loadConsentRegion: () => Promise.resolve(),
              readAnalyticsConsent: () => current,
              subscribeAnalyticsConsent: fn => { subscriber = fn },
            }
            script.onload()
          }
        }
      } },
    },
  }
  context.window = context
  runInNewContext(source, context)
  return {
    context, cookieWrites, scripts,
    change(value) { current = value; subscriber() },
    navigate() { listeners.get('mintlify:navigate')() },
    pageviews() { return (context.dataLayer ?? []).filter(args => args[0] === 'event' && args[1] === 'page_view').length },
  }
}

test('no GA4 for strict undecided or GPC denied, then starts on shared permission', () => {
  for (const state of ['undecided', 'declined']) {
    const app = start(state)
    assert.equal(app.pageviews(), 0)
    assert.equal(app.scripts.some(s => s.src?.includes('googletagmanager')), false)
    app.change('accepted')
    assert.equal(app.pageviews(), 1)
    app.navigate()
    assert.equal(app.pageviews(), 1)
  }
})

test('regional allowance starts GA4 without writing a consent cookie; cross-site refusal stops it', () => {
  const app = start('accepted')
  assert.equal(app.pageviews(), 1)
  assert.equal(app.cookieWrites.length, 0)
  app.change('declined')
  app.context.location.href = 'https://docs.spatius.ai/next'
  app.navigate()
  assert.equal(app.pageviews(), 1)
  assert.equal(app.context['ga-disable-G-5YREV5DMW3'], true)
  assert.equal(app.cookieWrites.some(value => value.startsWith('login=')), false)
  assert.ok(app.cookieWrites.some(value => value.includes('Domain=.spatius.ai')))
  app.change('accepted')
  assert.equal(app.pageviews(), 2)
  assert.equal(app.context['ga-disable-G-5YREV5DMW3'], false)
})

test('component loading failure remains closed', () => {
  const app = start('accepted', true)
  assert.equal(app.pageviews(), 0)
  assert.equal(app.scripts.some(s => s.src?.includes('googletagmanager')), false)
})
