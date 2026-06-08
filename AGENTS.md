# AGENTS.md

Repository guidance for any AI coding agent (Claude Code, Codex, Cursor, Copilot, Aider, etc.) working in this codebase.

## What this repo is

Mintlify documentation site for **Spatius** (audio-driven real-time avatar platform). Pure content repo — no build step, no test suite, no `package.json`, no lint. Production deploy is automatic on push to `main` via the Mintlify GitHub app.

## Local preview

```bash
npm i -g mint   # one-time install
mint dev        # serves on http://localhost:3000, hot-reloads on file save
mint update     # bump CLI when dev fails or shows "update available"
```

A `dockerfile` exists for parity (`node:22-alpine` running `mint dev` on port 3000); host-level `mint` is the daily driver.

## Navigation: `docs.json` is the single source of truth

Mintlify reads `docs.json` and serves only what is referenced from `navigation.tabs[*].groups[*].pages`. Files on disk that are not referenced exist but are unreachable through the sidebar. If you add a new `.mdx` and it doesn't appear in the sidebar, the most likely cause is a missing `docs.json` entry. Always check `docs.json` before assuming a page is reachable.

Top-level structure (Documentation tab):

1. **Start Here** — `getting-started/introduction`, `concepts/how-it-works`, `getting-started/credentials`, `getting-started/how-to-integrate`
2. **Quickstarts** — platform SDK first-runs only (`quickstarts/{overview,web-sdk,ios-sdk,android-sdk,flutter-sdk}`). LiveKit Agents quickstart lives under its own group, not here.
3. **Platform Integrations** — third-party realtime/agent platforms slot in via plugins. Today contains `LiveKit Agents Integration` (`livekit-agents/{overview,client,server}`) and `Agora Convo AI / TEN Framework Integration` (`agora-convoai/{overview,convo-ai-agent,ten-extension,client}`).
4. **Standalone Integrations** — build directly with Spatius SDKs. Contains two nested groups: `Direct Mode` (`direct-mode/*`) and `Backend Mode` (`backend-mode/*` including `with-livekit` as a transport sub-page).
5. **Concepts** — `concepts/{avatar,audio,lifecycle,state-events}` (mental model + cross-cutting warnings; `how-it-works` lives in Start Here as orientation).
6. **Examples & Support** — `resources/demo-projects` (matrix), `faq`, Error Codes group, `changelog`.

Other tabs:

- **SDK Reference** → `sdk-reference/{web,ios,android,flutter,python,go}-sdk/` (no JS SDK in nav — not implemented yet)
- **API Reference** → `api-reference/` (Server REST API)

**Key IA boundary:** `backend-mode/with-livekit` lives under Standalone Integrations > Backend Mode even though it mentions LiveKit. It is a transport option for Backend Mode, not a Platform Integration. LiveKit Agents (Platform Integration) and Backend Mode with LiveKit Room transport (Standalone) must never be conflated. The phrase "Server-Side Integrations" was a previous interim grouping and is no longer used anywhere user-facing.

When you rename or move a page, also add an entry to `docs.json > redirects` so existing inbound links keep resolving (`{ "source": "/old/path", "destination": "/new/path" }`). Pure deletions don't need a redirect — only renames do.

## IA convention: Concepts vs SDK Reference (hybrid)

`concepts/` pages are **mental model + cross-cutting warnings** for the avatar pipeline. They are **not** API exhaustion. The four pages are:

- `concepts/avatar.mdx` — what an Avatar is, how IDs/loading/caching behave
- `concepts/audio.mdx` — accepted audio format, when to send, how to interrupt
- `concepts/lifecycle.mdx` — Initialize → Load → Render → Connect, plus Cleanup
- `concepts/state-events.mdx` — connection/conversation state, errors, reconnect

Rules for editing concept pages:

- **Do** include task-oriented narrative, mental model framing, shared-state warnings, links between concepts, and links out to `sdk-reference/` for exact signatures.
- **Don't** put cross-platform code-tab walls (Web / iOS / Android / Flutter snippets), method signatures, return-type tables, or anything that would need to be rewritten when an SDK ships a new version. Those live in `sdk-reference/{web,ios,android,flutter}-sdk/api-reference.mdx` (and `web-sdk/reference.mdx`).
- **Don't** add "Driving Modes" or "Choose your integration" content here — that lives in `getting-started/how-to-integrate.mdx`.

## Brand and naming (strict)

Use these names verbatim everywhere — including running prose, headings, code comments, diagram labels, and link text. Inconsistency in this list causes the most reader confusion and the most cross-page drift.

| Term | Meaning |
|------|---------|
| **Spatius** | The product. Never use earlier internal brand names (any variant of the prior org or product spelling). |
| **Motion Server** | The cloud service. Input: agent audio. Output: motion data. |
| **motion data** | The driving data stream produced by Motion Server, ~10–15 KB/s, consumed by the on-device avatar to speak. Lowercase except at sentence start. |
| **Avatar** / **avatar assets** | The digital-human resources (model, textures, metadata). "Avatar" when referring to the entity; "avatar assets" when referring to the downloadable bundle. |
| **AvatarKit** | The client-side core SDK that handles rendering and playback. |
| **`@spatius/avatarkit-rtc`** | The RTC adapter package. Always lowercase, hyphenated, fully scoped. |
| **LiveKit Agents Integration** | The public name for the **Platform Integration** that uses `livekit-plugins-spatius`. The user-facing name in nav is "LiveKit Agents Integration"; do not call the integration path "LiveKit Integration" or "LiveKit Plugin". |
| **Direct Mode Integration** | The public name for the path that maps to `DrivingServiceMode.sdk` in SDK code. |
| **Backend Mode Integration** | The public name for the path that maps to `DrivingServiceMode.host` in SDK code. |
| **`ConnectionState`** / **`ConversationState`** | The two state enum types. Always in code style with this exact casing. |

Do not invent synonyms (e.g. "drive data", "animation stream", "mocap stream", "Spatius Server", "renderer SDK", "RTC plugin"). If you find an existing page using a different term, either fix it in the same change or flag it explicitly — silent drift is the failure mode this section exists to prevent.

### RTC Adapter naming

- `@spatius/avatarkit-rtc` is the **Web SDK RTC transport adapter**. Treat it as part of the Web SDK family alongside `@spatius/avatarkit`, not as a peer of the iOS / Android / Flutter SDKs.
- Do not describe `@spatius/avatarkit-rtc` itself as a diagnostic, smoke test, or debug helper. The demo directory `platform-integrations/livekit-room-demo` is the minimal LiveKit example exercising the adapter. Agora client setup is documented under `agora-convoai/client`.
- **LiveKit Agents** is a Platform Integration; **LiveKit Room** and **Agora Room** are transport providers; the **RTC Adapter** (`@spatius/avatarkit-rtc`) is the Web SDK adapter that renders the avatar stream from that transport.
- Agora Convo AI client integrations support Web, iOS, and Android. Web uses `@spatius/avatarkit-rtc`; iOS uses `AvatarKitRTC`; Android uses `ai.spatius:avatarkit-rtc`.
- Backend Mode can use an RTC transport. In that pattern the Web client uses the RTC Adapter; backend wiring still belongs to Backend Mode docs.

## Brand-asset reference

| Asset | Value |
|------|------|
| Product | Spatius |
| Studio | `https://app.spatius.ai` |
| Website | `https://spatius.ai` |
| Docs | `https://docs.spatius.ai` |
| GitHub org | `spatius-ai` |
| Consolidated demo repo | `https://github.com/spatius-ai/spatius-avatar-demo` |
| npm | `@spatius/avatarkit`, `@spatius/avatarkit-rtc` |
| Python | `livekit-plugins-spatius` |
| Android (Maven) | `ai.spatius:avatarkit` |
| iOS | `AvatarKit.xcframework` (downloaded from `spatius-ai/avatarkit-ios-release`) |
| Flutter | `spatius` |
| Env vars | `SPATIUS_API_KEY`, `SPATIUS_APP_ID`, `SPATIUS_AVATAR_ID`, `SPATIUS_REGION` (`us-west` default, `ap-northeast` supported). Vite-built frontends use `VITE_SPATIUS_*`. |
| Logo files | `/images/spatius-logo-mark-black.svg`, `/images/spatius-logo-mark-white.svg` (SVG, never PNG) |

## Endpoint discipline

- Spatius currently operates in two regions: `us-west` and `ap-northeast`. Other historical region slugs are removed. Endpoint domains use `*.{region}.spatius.ai` — never a `*.cloud` TLD under any historical brand.
- Reference URLs (for advanced users): `https://console.us-west.spatius.ai/v1/console`, `wss://api.us-west.spatius.ai/v2/driveningress`, `https://console.ap-northeast.spatius.ai/v1/console`, `wss://api.ap-northeast.spatius.ai/v2/driveningress`.
- **Quickstarts and normal demo setup** ask users to set only `SPATIUS_REGION` (defaulting to `us-west`). Do **not** ask users to set `SPATIUS_CONSOLE_ENDPOINT` or `SPATIUS_INGRESS_ENDPOINT` in any setup flow — those exist as commented-out "Advanced override" env vars only.

## Mintlify-specific conventions used here

- **MDX components**: `<Tabs>`, `<Tab>`, `<Steps>`, `<Step>`, `<Note>`, `<Warning>`, `<Card>`, `<CardGroup>`, `<Frame>`, `<Accordion>`, `<AccordionGroup>` — all built-in.
- **Mermaid blocks**: use ` ```mermaid actions={false} ` and pass the `themeVariables` block already used in `concepts/lifecycle.mdx` for visual consistency. Wrap in a white-bg `<div>` so dark theme doesn't invert the diagram badly.
- **Custom JSX snippets**: `snippets/spatius-diagrams.jsx` exports React/SVG components (e.g. `SpatiusArchitectureDiagram`) consumed in mdx via `import` then `<SpatiusArchitectureDiagram />`. Styled by classes in `custom.css` (CSS variables prefixed `--spatius-diagram-*`).
- **`customCSS`**: `/custom.css` is wired in `docs.json`; it ships globally so changes affect every page.
- **Frontmatter**: `title`, `sidebarTitle` (when nav label should differ from page H1), `description`. Sidebar always shows `sidebarTitle ?? title`, **not** the slug — renaming a page's slug doesn't change its sidebar label, you must edit frontmatter too.

## Page-bottom CTA convention

Every page that has a "what to do next" section uses the heading `## Next steps`. Don't introduce variants like "Get Started", "Go next", "Examples", or "Beyond quickstarts". Each `## Next steps` block contains 2–3 `<Card>`s pointing to logical follow-ups.

## Source-of-truth for SDK behavior

When documenting SDK behavior, the authoritative source is the published SDK source — not memory, not the existing docs. Verify method names and semantics against the SDK before asserting them in a concept page.
