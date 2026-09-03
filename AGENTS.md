# AGENTS.md

Repository guidance for any AI coding agent (Claude Code, Codex, Cursor, Copilot, Aider, etc.) working in this codebase.

## What this repo is

Mintlify documentation site for **Spatius** (audio-driven real-time avatar platform). Pure content repo — no app build step and no test suite. Production deploy is automatic on push to `main` via the Mintlify GitHub app.

## Local preview

```bash
npm i -g mint   # one-time install
mint dev        # serves on http://localhost:3000, hot-reloads on file save
mint update     # bump CLI when dev fails or shows "update available"
```

A `dockerfile` exists for parity (`node:22-alpine` running `mint dev` on port 3000); host-level `mint` is the daily driver.

## Checks

Install dependencies before running the repository checks:

```bash
pnpm install
```

Run all checks before opening or updating a PR:

```bash
pnpm check
```

## Navigation: `docs.json` is the single source of truth

Mintlify reads `docs.json` and serves only what is referenced from `navigation.tabs[*].groups[*].pages`. Files on disk that are not referenced exist but are unreachable through the sidebar. If you add a new `.mdx` and it doesn't appear in the sidebar, the most likely cause is a missing `docs.json` entry. Always check `docs.json` before assuming a page is reachable.

Top-level structure (Guides tab):

1. **Start Here** — `getting-started`, `concepts/how-it-works`
2. **Quickstarts** — complete scenario first-runs from `spatius-scenario-demo` for Web, iOS, and Android only (`quickstarts/{web-sdk,ios-sdk,android-sdk}`). There is no Quickstarts Overview page. The current native scenario clients use Agora, but this must be described as a demo implementation choice, never as the complete iOS or Android platform capability. Flutter remains in SDK Reference and integration guides, not Quickstarts.
3. **Integrations** — starts with `integrations/overview`, followed by `LiveKit Agents` (tagged `Recommended`), `Agora ConvoAI` (tagged `Recommended`), `Direct Mode`, then `Backend Mode`. Direct Mode contains only `Client`; Backend Mode contains `Backend Setup` and `Client`. These concise labels may also be used in the comparison table; integration page titles use the full public names.
4. **Concepts** — `concepts/{avatar,avatar-background,audio,lifecycle,state-events}` (mental model + cross-cutting warnings; `how-it-works` lives in Start Here as orientation).
5. **Examples & Support** — `resources/demo-projects` (matrix) and `faq`.

Other tabs:

- **SDK Reference** → all SDK/reference material: client SDKs, server SDKs, Server API pages, shared Regions & Endpoints, and Error Handling. This tab is the single place to look up exact classes, methods, enums, request fields, endpoint regions, and error codes.
- **API Reference** → the public REST Spatius API for programmatic avatar creation. Hand-written pages live in `api-reference/` (overview, authentication, errors); endpoint pages are auto-generated from `openapi/avatar-open-api.json` via the group-level `openapi` key in `docs.json`.

**Public integration boundary:** Guides expose exactly four integrations under one `Integrations` group: LiveKit Agents Integration, Agora Convo AI Integration (including TEN Framework), Direct Mode Integration, and Backend Mode Integration. The first two carry the `Recommended` navigation tag. Do not recreate separate "Backend Mode with LiveKit," "Backend Mode with Agora," or "your own transport" entries. Server SDK LiveKit/Agora egress remains a low-level SDK capability, not an additional integration path. Backend Mode means the application owns client delivery. The phrases "Realtime Platform Integrations," "Build with Spatius SDKs," and "Server-Side Integrations" are not user-facing navigation categories.

**Integration content hierarchy:** `integrations/overview.mdx` owns cross-path comparison and selection. LiveKit Agents and Agora Convo AI Overviews contain only architecture, one short runtime-boundary explanation, and 2–3 next-step cards. Other installation, credentials, configuration, and runnable code belong in Agent setup, Backend Setup, or Client pages. Package matrices, platform differences, and exact APIs belong in SDK Reference. Do not create separate Direct Mode or Backend Mode Overview pages.

When you rename or move a page, also add an entry to `docs.json > redirects` so existing inbound links keep resolving (`{ "source": "/old/path", "destination": "/new/path" }`). Pure deletions don't need a redirect — only renames do.

## IA convention: Concepts vs Reference (hybrid)

`concepts/` pages are **mental model + cross-cutting warnings** for the avatar pipeline. They are **not** API exhaustion. The five pages are:

- `concepts/avatar.mdx` — what an Avatar is, how IDs/loading/caching behave
- `concepts/avatar-background.mdx` — how Studio backgrounds and app UI backgrounds compose
- `concepts/audio.mdx` — accepted audio format, when to send, how to interrupt
- `concepts/lifecycle.mdx` — Initialize → Load → Render → Connect, plus Cleanup
- `concepts/state-events.mdx` — connection/conversation state, errors, reconnect

Rules for editing concept pages:

- **Do** include task-oriented narrative, mental model framing, shared-state warnings, links between concepts, and links out to `sdk-reference/` for exact signatures.
- **Don't** put cross-platform code-tab walls (Web / iOS / Android / Flutter snippets), method signatures, return-type tables, or anything that would need to be rewritten when an SDK ships a new version. Those live in `sdk-reference/{web,ios,android,flutter}-sdk/api-reference.mdx` (and `web-sdk/reference.mdx`).
- **Don't** add "Driving Modes" or integration selection content here — comparison lives in `integrations/overview.mdx`, and exact setup lives under **Integrations**.

## Brand and naming (strict)

Use these names verbatim everywhere — including running prose, headings, code comments, diagram labels, and link text. Inconsistency in this list causes the most reader confusion and the most cross-page drift.

| Term | Meaning |
|------|---------|
| **Spatius** | The product. Never use earlier internal brand names (any variant of the prior org or product spelling). |
| **Motion Server** | The cloud service. Input: agent audio. Output: motion data. |
| **motion data** | The driving data stream produced by Motion Server, ~10–15 KB/s, consumed by the on-device avatar to speak. Lowercase except at sentence start. |
| **Avatar** / **avatar assets** | The rendered 3D character and its resources (model, textures, metadata). "Avatar" refers to the entity; "avatar assets" refers to the downloadable bundle. |
| **AvatarKit** | The client-side core SDK that handles rendering and playback. |
| **`@spatius/avatarkit-rtc`** | The RTC adapter package. Always lowercase, hyphenated, fully scoped. |
| **LiveKit Agents Integration** | The public name for the recommended integration that uses `livekit-plugins-spatius`. The concise navigation label is "LiveKit Agents"; do not call the integration "LiveKit Integration" or "LiveKit Plugin". Its navigation follows the same `Overview` → `Agent setup` → `Client` structure as Agora. |
| **Agora Convo AI Integration** | The public name for the recommended integration that uses Agora Convo AI or TEN Framework. The concise navigation label is "Agora ConvoAI". |
| **Direct Mode Integration** | The public name for the path that maps to `DrivingServiceMode.direct` in SDK code. |
| **Backend Mode Integration** | The public name for the path that maps to `DrivingServiceMode.backend` in SDK code. |
| **`ConnectionState`** / **`ConversationState`** | The two state enum types. Always in code style with this exact casing. |

Do not invent synonyms (e.g. "drive data", "animation stream", "mocap stream", "Spatius Server", "renderer SDK", "RTC plugin"). If you find an existing page using a different term, either fix it in the same change or flag it explicitly — silent drift is the failure mode this section exists to prevent.

### RTC Adapter naming

- `@spatius/avatarkit-rtc` is the **Web SDK RTC transport adapter**. Treat it as part of the Web SDK family alongside `@spatius/avatarkit`, not as a peer of the iOS / Android / Flutter SDKs.
- Do not describe `@spatius/avatarkit-rtc` itself as a diagnostic, smoke test, debug helper, or standalone integration. It is a client package used by LiveKit Agents and Agora Convo AI.
- **LiveKit Agents Integration** and **Agora Convo AI Integration** are the two recommended integrations. The **RTC Adapter** (`@spatius/avatarkit-rtc`) is the Web SDK adapter that renders the avatar stream from their supported RTC rooms.
- Agora Convo AI client integrations support Web, iOS, and Android. Web uses `@spatius/avatarkit-rtc`; iOS uses `AvatarKitRTC`; Android uses `ai.spatius:avatarkit-rtc`.
- The iOS and Android RTC SDKs expose a public `RTCProvider` abstraction and currently bundle `AgoraProvider`; they do not yet bundle a native `LiveKitProvider`. Describe this as a packaged-provider boundary, never as iOS or Android supporting only Agora—the core platform SDKs also support Direct Mode and Backend Mode.
- Server SDK LiveKit/Agora egress is a low-level SDK capability, not an additional integration path. Backend Mode uses the core AvatarKit client feed and does not branch into RTC provider variants.

## Brand-asset reference

| Asset | Value |
|------|------|
| Product | Spatius |
| Studio | `https://app.spatius.ai` |
| Website | `https://spatius.ai` |
| Docs | `https://docs.spatius.ai` |
| GitHub org | `spatius-ai` |
| Scenario quickstart repo | `https://github.com/spatius-ai/spatius-scenario-demo` |
| Integration demo repo | `https://github.com/spatius-ai/spatius-integration-demo` |
| npm | `@spatius/avatarkit`, `@spatius/avatarkit-rtc` |
| Python | `livekit-plugins-spatius` |
| Android (Maven) | `ai.spatius:avatarkit` |
| iOS | `AvatarKit.xcframework` (downloaded from `spatius-ai/avatarkit-ios-release`) |
| Flutter | `spatius_avatarkit` |
| Env vars | `SPATIUS_API_KEY`, `SPATIUS_APP_ID`, `SPATIUS_AVATAR_ID`, `SPATIUS_REGION` (`us-west`, `ap-northeast`, and `cn-beijing`). Vite-built frontends use `VITE_SPATIUS_*`. |
| Logo files | Favicon uses `/images/spatius-logo-mark-black.svg` and `/images/spatius-logo-mark-white.svg`. Navbar logo uses the original wordmark PNGs: `/images/spatius-logo-wordmark-black.png` and `/images/spatius-logo-wordmark-white.png`. |

## Endpoint discipline

- Spatius currently operates in three regions: `us-west`, `ap-northeast`, and `cn-beijing`. Other historical region slugs are removed. Endpoint domains use `*.{region}.spatius.ai` except for the `cn-beijing` Console API host, which is `console.cn-beijing.spatialwalk.top`. Never use a `*.cloud` TLD under any historical brand.
- Reference URLs (for advanced users): `https://console.us-west.spatius.ai/v1/console`, `wss://api.us-west.spatius.ai/v2/driveningress`, `https://console.ap-northeast.spatius.ai/v1/console`, `wss://api.ap-northeast.spatius.ai/v2/driveningress`, `https://console.cn-beijing.spatialwalk.top/v1/console`, `wss://api.cn-beijing.spatius.ai/v2/driveningress`.
- **Quickstarts and normal demo setup** ask users to set only `SPATIUS_REGION` (defaulting to `us-west`). Do **not** ask users to set `SPATIUS_CONSOLE_ENDPOINT` or `SPATIUS_INGRESS_ENDPOINT` in any setup flow — those exist as commented-out "Advanced override" env vars only.

## Mintlify-specific conventions used here

- **MDX components**: `<Tabs>`, `<Tab>`, `<Steps>`, `<Step>`, `<Note>`, `<Warning>`, `<Card>`, `<CardGroup>`, `<Frame>`, `<Accordion>`, `<AccordionGroup>` — all built-in.
- **Mermaid blocks**: use ` ```mermaid actions={false} ` and pass the `themeVariables` block already used in `concepts/lifecycle.mdx` for visual consistency. Wrap in a white-bg `<div>` so dark theme doesn't invert the diagram badly.
- **Custom JSX snippets**: `snippets/spatius-diagrams.jsx` exports React/SVG components (e.g. `SpatiusArchitectureDiagram`) consumed in mdx via `import` then `<SpatiusArchitectureDiagram />`. Styled by classes in `custom.css` (CSS variables prefixed `--spatius-diagram-*`).
- **`customCSS`**: `/custom.css` is wired in `docs.json`; it ships globally so changes affect every page.
- **Frontmatter**: `title`, `sidebarTitle` (when nav label should differ from page H1), `description`. Sidebar always shows `sidebarTitle ?? title`, **not** the slug — renaming a page's slug doesn't change its sidebar label, you must edit frontmatter too.

## Page-bottom CTA convention

Pages that include a follow-up CTA use the heading `## Next steps`. Don't introduce variants like "Get Started", "Go next", "Examples", or "Beyond quickstarts". Each `## Next steps` block contains 1–3 title-only, self-closing `<Card>`s pointing to logical follow-ups; do not repeat destination descriptions inside the cards.

## Source-of-truth for SDK behavior

When documenting SDK behavior, the authoritative source is the published SDK source — not memory, not the existing docs. Verify method names and semantics against the SDK before asserting them in a concept page.

Do not hardcode concrete SDK or package versions in user-facing documentation. Prefer unversioned package-manager commands, latest-release links, or a `<latest-version>` placeholder when manifest syntax requires a version. Link to published package metadata for compatibility ranges. API/protocol versions, toolchain requirements, and lockfile versions are not subject to this rule.
