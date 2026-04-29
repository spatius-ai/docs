# AGENTS.md

Repository guidance for any AI coding agent (Claude Code, Codex, Cursor, Copilot, Aider, etc.) working in this codebase.

## What this repo is

Mintlify documentation site for **Spatius** (audio-driven real-time avatar platform by spatialwalk). Pure content repo — no build step, no test suite, no `package.json`, no lint. Production deploy is automatic on push to `main` via the Mintlify GitHub app.

## Local preview

```bash
npm i -g mint   # one-time install
mint dev        # serves on http://localhost:3000, hot-reloads on file save
mint update     # bump CLI when dev fails or shows "update available"
```

A `dockerfile` exists for parity (`node:22-alpine` running `mint dev` on port 3000); host-level `mint` is the daily driver.

## Navigation: `docs.json` is the single source of truth

Mintlify reads `docs.json` and serves only what is referenced from `navigation.tabs[*].groups[*].pages`. Files on disk that are not referenced exist but are unreachable through the sidebar. As of the post-cleanup state there are no orphans, but if you add a new `.mdx` and it doesn't appear in the sidebar, the most likely cause is a missing `docs.json` entry. Always check `docs.json` before assuming a page is reachable.

Top-level structure:

- **Documentation** tab → `getting-started/`, `concepts/`, `livekit-plugin/`, `basic-mode/`, `custom-mode/`, `resources/`
- **SDK Reference** tab → `sdk-reference/{web,ios,android,python,go,js}-sdk/`
- **API Reference** tab → `api-reference/` (Server REST API)

When you rename or move a page, also add an entry to `docs.json > redirects` so existing inbound links keep resolving (`{ "source": "/old/path", "destination": "/new/path" }`). Pure deletions don't need a redirect — only renames do.

## IA convention: Concepts vs SDK Reference (hybrid)

`concepts/` pages are **mental model + cross-cutting warnings** for the avatar pipeline. They are **not** API exhaustion. The four pages are:

- `concepts/avatars.mdx` — what an Avatar is, how IDs/loading/caching behave
- `concepts/sessions-lifecycle.mdx` — Initialize → Load → Render → Connect, plus Cleanup
- `concepts/audio-io.mdx` — accepted audio format, when to send, how to interrupt
- `concepts/state-events.mdx` — connection/conversation state, errors, reconnect

Rules for editing concept pages:

- **Do** include task-oriented narrative, mental model framing, shared-state warnings, links between concepts, and links out to `sdk-reference/` for exact signatures.
- **Don't** put cross-platform code-tab walls (Web / iOS / Android snippets), method signatures, return-type tables, or anything that would need to be rewritten when an SDK ships a new version. Those live in `sdk-reference/{web,ios,android}-sdk/api-reference.mdx` (and `web-sdk/reference.mdx`).
- **Don't** add "Driving Modes" or "Choose your integration" content here — that lives in `getting-started/how-to-integrate.mdx`. The standalone `concepts/integrations.mdx` was removed because it duplicated that page and the per-Mode chapter overviews.

This split was established in this branch's history; see commits prefixed `docs(concepts/...)` for the worked examples on Avatars and Audio I/O.

Detailed concept-page writing standard: [`docs/superpowers/specs/concept-page-writing-standard.md`](./docs/superpowers/specs/concept-page-writing-standard.md).

## Naming conventions (strict)

Use these names verbatim everywhere — including running prose, headings, code comments, diagram labels, and link text. Inconsistency in this list causes the most reader confusion and the most cross-page drift.

| Term | Meaning |
|------|---------|
| **Motion Server** | The cloud service. Input: agent audio. Output: motion data. |
| **motion data** | The driving data stream produced by Motion Server, ~10–15 KB/s, consumed by the on-device avatar to speak. Lowercase except at sentence start. |
| **Avatar** / **avatar assets** | The digital-human resources (model, textures, metadata). "Avatar" when referring to the entity; "avatar assets" when referring to the downloadable bundle. |
| **AvatarKit** | The client-side core SDK that handles rendering and playback. |
| **avatarkit-rtc** | The RTC adapter layer (core + adapter). Always lowercase, hyphenated. |
| **LiveKit Plugin** | A server-side concept; the package is `livekit-plugins-spatialreal`. |
| **`ConnectionState`** / **`ConversationState`** | The two state enum types. Always in code style with this exact casing. |

Do not invent synonyms (e.g. "drive data", "animation stream", "mocap stream", "Spatius Server", "renderer SDK", "RTC plugin"). If you find an existing page using a different term, either fix it in the same change or flag it explicitly — silent drift is the failure mode this section exists to prevent.

## Domain rules

Two domains, intentionally split:

- `app.spatius.ai` — Studio (the product app). Always link Studio CTAs / login to this.
- `docs.spatialreal.ai` — these docs. Used in the navbar `llms.txt` link.

Do not unify them without being asked. The historical `app.spatialreal.ai` was rebranded out across all content; if you see it appear, it's a regression.

## Mintlify-specific conventions used here

- **MDX components**: `<Tabs>`, `<Tab>`, `<Steps>`, `<Step>`, `<Note>`, `<Warning>`, `<Card>`, `<CardGroup>`, `<Frame>`, `<Accordion>`, `<AccordionGroup>` — all built-in.
- **Mermaid blocks**: use ` ```mermaid actions={false} ` and pass the `themeVariables` block already used in `concepts/sessions-lifecycle.mdx` for visual consistency. Wrap in a white-bg `<div>` so dark theme doesn't invert the diagram badly.
- **Custom JSX snippets**: `snippets/spatius-diagrams.jsx` exports React/SVG components (e.g. `SpatiusArchitectureDiagram`) consumed in mdx via `import` then `<SpatiusArchitectureDiagram />`. Styled by classes in `custom.css` (CSS variables prefixed `--spatius-diagram-*`).
- **`customCSS`**: `/custom.css` is wired in `docs.json`; it ships globally so changes affect every page.
- **Frontmatter**: `title`, `sidebarTitle` (when nav label should differ from page H1), `description`. Sidebar always shows `sidebarTitle ?? title`, **not** the slug — renaming a page's slug doesn't change its sidebar label, you must edit frontmatter too.

## Source-of-truth for SDK behavior

When documenting SDK behavior, the authoritative source is the published SDK source — not memory, not the existing docs. The Web SDK lives at `https://github.com/spatialwalk/avatar-kit-web` (package `@spatialwalk/avatarkit`); iOS/Android equivalents are referenced from `sdk-reference/{ios,android}-sdk/`. Verify method names and semantics against the SDK before asserting them in a concept page.
