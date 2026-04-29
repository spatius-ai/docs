# Concepts "How It Works" Umbrella — Design

- **Status**: Approved (brainstorming complete; pending user spec review before writing-plans)
- **Date**: 2026-04-26
- **Branch**: `refact/concepts`
- **Owner**: yuhang
- **Reviewers used**: Codex (validated hybrid IA earlier in session); GPT-5.3-codex-high (adversarial review of this proposal)

## 1. Background

Spatius docs has 4 Concept pages already shipped on this branch:

- `concepts/avatars.mdx`
- `concepts/sessions-lifecycle.mdx`
- `concepts/audio-io.mdx`
- `concepts/state-events.mdx`

They follow a Codex-validated hybrid IA — Concepts hold mental model + cross-cutting warnings; SDK Reference holds method signatures and platform-specific behavior. Each Concept page links to per-platform anchors in SDK Reference (Web/iOS/Android). Strict naming conventions are enforced via `AGENT.md` (Motion Server / motion data / AvatarKit / `ConnectionState` / `ConversationState`).

User identified a gap: the 4 pages cover their topics well individually, but they don't *thread together* — there is no narrative anchor that lets a reader build a single coherent mental model of how Spatius works. User cited Anthropic's "How Claude Code Works" page as the reference pattern: a single page that threads all concepts through one central anchor (Claude Code uses "Agent Loop"; everything else orbits it).

## 2. Goal

Add a Concepts entry point that gives readers a one-page tour of "how Spatius works" without disturbing the depth and discipline already established in the 4 deep pages.

## 3. Non-Goals

- Replace any of the 4 existing Concept pages (rejected: would discard ~10 commits of just-shipped hybrid IA + 26 SDK Reference anchor links + Codex-validated structure).
- Add concept content elsewhere (Getting Started, Mode chapters, SDK Reference all stay untouched in this PR).
- Promote `Motion Server` or `motion data` to dedicated concept pages (separately addressed via term contract anchors in Overview; see §6.2).
- Promote Auth, Driving Modes, or Connection-resilience to top-level concepts (already rejected per Plan D and prior Codex review).
- Pre-abstract `audio` input as a generic "driver input" surface (YAGNI; revisit only when a second pipeline ships — see §10).

## 4. Decisions Locked During Brainstorming

| # | Decision | Rationale |
|---|---|---|
| **D1** | **Architecture B** — umbrella page + 4 deep pages (not replace, not retrofit) | Preserves committed work; matches industry pattern (Stripe, Vercel, AWS, LiveKit all have "how X works" entry pages on top of detailed docs); two reading modes (story vs lookup). |
| **D2** | **Anchor: runtime data pipeline** as the single central concept | Most analogous to Claude Code's Agent Loop (both are runtime data flow, not integration sequence). The pipeline is the shortest answer to "what does Spatius do?". The 4 deep pages map naturally onto faces of the pipeline. |
| **D3** | **Deep page openings reframed** — sentence 1 self-contains the page object's definition; sentence 2 positions it in the pipeline | Search-landing readers (skipping Overview) must still understand each page in isolation. Verifiable via "first 120 words standalone" rule. |
| **D4** | **5 flat sidebar items** (Overview added as first; existing 4 unchanged in scope/name) | Peer evidence: LiveKit/LiveAvatar/Prisma all flat at this scale. Kubernetes nests but has ~50 concepts; we have 5. |
| **D5** | **No dedicated pages for Motion Server or motion data**; instead, **term contract anchors** in Overview | These terms are mental-model anchors, not API surfaces. A regulated term block in Overview gives a single deep-linkable definition without inflating concept count. |
| **D6** (NEW) | **Mode responsibility matrix** in Overview as a stage × mode table | One consolidated table replaces per-section "Mode divergence cards"; less noise, same coverage. |
| **D7** (NEW) | **Coverage checklist replaces word target** | Avoids the "good-looking but un-actionable" failure mode of pages that hit a word count by sacrificing key constraints. |

### What we revised after GPT review

GPT raised 11 findings (2 Critical, 5 High, 3 Medium, 2 Low). We accepted 10 in substance, rejected 1 outright (H4 — premature abstraction), and adapted C1 (refused the "double anchor" framing because it would defeat single-anchor cognitive cohesion; accepted its spirit by structuring Overview as pipeline → operational layer rather than pipeline + control plane as peers).

## 5. IA Placement

```
Documentation
└── Concepts
    ├── How it works              ← NEW (concepts/how-it-works.mdx)
    ├── Avatars
    ├── Sessions & Lifecycle
    ├── Audio I/O
    └── State & Events
```

- **File**: `concepts/how-it-works.mdx`
- **Slug**: `/concepts/how-it-works`
- **Sidebar label** (frontmatter `sidebarTitle`): `How it works`
- **Page H1** (frontmatter `title`): `How Spatius Works`
- **Description** (frontmatter `description`): `The Spatius runtime pipeline, the canonical terminology, and where each concept page fits.`

`docs.json` change: insert `"concepts/how-it-works"` as the first entry of the Concepts `pages` array. No redirects required (pure addition, no rename).

## 6. Overview Page Structure

The page has exactly 5 H2 sections, in this order:

### 6.1 The pipeline

A single Mermaid diagram of the runtime data flow:

```
your audio  →  Motion Server  →  motion data  →  AvatarKit render
```

Each station gets 1–2 sentences:

- **your audio** — agent or user audio your application owns and feeds in.
- **Motion Server** — the cloud service that consumes audio and emits motion data.
- **motion data** — driving stream (~10–15 KB/s) that controls the avatar's mouth, head, and gestures.
- **AvatarKit render** — on-device rendering that animates the avatar from motion data.

This section does **not** discuss APIs, modes, or session lifecycle — those have their own sections.

### 6.2 Terms

Anchored, regulated definitions used as the canonical reference for the rest of the doc set:

- **Motion Server** {`#motion-server`} — The cloud service that takes agent audio in and emits motion data.
- **motion data** {`#motion-data`} — The driving data stream from Motion Server (~10–15 KB/s) consumed by AvatarKit to animate the avatar.
- **AvatarKit** {`#avatarkit`} — The client-side core SDK. Renders the avatar and plays back motion data.
- **State enums** {`#state-enums`} — `ConnectionState` and `ConversationState`, the two enums you observe at runtime.

These anchors are the single source of truth. Future PRs may sweep other docs to deep-link to them; this PR does not.

### 6.3 Who does what

A stage × mode responsibility matrix. Five rows × three modes:

| Stage | SDK Mode | Custom Mode | LiveKit Plugin |
|---|---|---|---|
| Capture audio | you | you | LiveKit room |
| Forward audio to Motion Server | AvatarKit | you (e.g. `yieldAudioData`) | LiveKit Plugin |
| Hold / refresh Session Token | you | you | you |
| Reconnect on drop | you | you | LiveKit room |
| Render avatar | AvatarKit | AvatarKit | AvatarKit |

This is the canonical statement of Mode boundaries. SDK behavior changes that move responsibility across modes require this table to be updated in the same PR.

### 6.4 Where each concept fits

Each entry uses the format **trigger condition → what you get → deep link** (not a definition sentence):

- **[Avatars](/concepts/avatars)** — when you need to choose a look or load assets before the pipeline runs.
- **[Sessions & Lifecycle](/concepts/sessions-lifecycle)** — when you need to bring the pipeline online or tear it down.
- **[Audio I/O](/concepts/audio-io)** — when you need to send audio into the pipeline or stop it mid-flow.
- **[State & Events](/concepts/state-events)** — when something goes wrong or you need to react to runtime state.

### 6.5 Common failure paths

Runtime entry points to deep pages, anchored at subsection level:

- **Token expired** → [State & Events: Token expiry](/concepts/state-events#what-happens-when-my-session-token-expires)
- **Connection dropped** → [State & Events: Recovery](/concepts/state-events#how-do-i-recover-from-a-dropped-connection)
- **Audio format mismatch** → [Audio I/O: Sample rate](/concepts/audio-io#audio-input-format)
- **Bad Avatar ID / asset download fail** → [Avatars](/concepts/avatars) + [State & Events: ErrorCode](/concepts/state-events#what-can-go-wrong)

## 7. The 4 Invariants the Page Promises

Overview is intentionally lossy. It commits to four invariants and links to depth for everything else:

1. The pipeline shape stays: `audio → Motion Server → motion data → AvatarKit render`.
2. Token refresh is always the developer's responsibility, regardless of Mode.
3. Render is always AvatarKit's responsibility, regardless of Mode.
4. Reconnect is the developer's responsibility, except in LiveKit Plugin where the LiveKit room handles it.

These invariants are why Overview can stay short: it doesn't restate behavior; it just commits to what doesn't change.

## 8. Deep Page Opening Reframes

Template (applies to all 4 deep pages):

1. **Sentence 1**: self-contained definition of the page's object. Must read sensibly without ever having seen Overview.
2. **Sentence 2**: position in the Spatius pipeline.
3. **Sentence 3 (optional)**: boundary condition or important warning.

Verification: reading first 120 words alone is sufficient to understand the page's scope and responsibility.

### 8.1 `concepts/avatars.mdx`

> An **Avatar** is a digital-human asset bundle identified by an **Avatar ID** — a stable string you obtain from Spatius Studio. In the Spatius pipeline, the Avatar is what AvatarKit renders at the on-device end after motion data starts flowing in. Avatars are loaded on demand: AvatarKit downloads and caches the assets when you call `AvatarManager.shared.load(id)`, and hands you back an `Avatar` object you attach to a view and a controller.

### 8.2 `concepts/sessions-lifecycle.mdx`

> A **session** is one running instance of an avatar in your app, from initial SDK configuration to final cleanup. A session is what brings the Spatius pipeline online and tears it down — without an active session, no audio reaches Motion Server and no motion data reaches AvatarKit. Every session goes through the same four stages, in order: **Initialize → Load → Render → Connect**, each with preconditions the previous stage must satisfy.

### 8.3 `concepts/audio-io.mdx`

> **Audio I/O** is how your application sends audio to AvatarKit and how it stops mid-utterance. Audio is the pipeline's input — what AvatarKit forwards to Motion Server in exchange for motion data. Two things matter for a correct integration: **format** (what bytes are accepted) and **timing** (when to push, when to mark end-of-stream, when to interrupt).

### 8.4 `concepts/state-events.mdx`

> **State & Events** is how your application observes what AvatarKit is doing at runtime. AvatarKit exposes two independent state machines on `AvatarController` — they let you watch the Spatius pipeline from the client side: **Connection** (the WebSocket to Motion Server) and **Conversation** (what's flowing through it right now).

## 9. Cross-Page Contracts

### Overview → 4 deep pages

- Each deep page appears exactly once in §6.4 ("Where each concept fits").
- §6.5 ("Common failure paths") deep-links to subsection anchors in deep pages, not page tops.
- Overview never restates behavior covered by deep pages (no `ConnectionState` value tables, no sample-rate lists, no 4-stage tables).

### Deep pages → Overview

- Deep pages do not need to backlink to Overview.
- Deep pages may use the term "Spatius pipeline" or "the pipeline" without a link; by convention this refers to §6.1.
- Deep pages keep self-contained inline definitions of terms; the §6.2 term contract is a canonical link target, not a replacement for inline clarity.

### Other docs → term contract

- Out of scope for this PR. Existing inline mentions of "Motion Server" / "motion data" elsewhere stay untouched.
- A future sweep PR may convert those to deep-link to `#motion-server` etc.

## 10. Future Extension Triggers

Conditions under which this design needs to be revisited:

| Trigger | Impact | Action |
|---|---|---|
| Spatius adds a second pipeline (e.g. text-driven) | Overview pipeline diagram + all 4 deep page openings need rework | Abstract entry to "driver input adapter" (GPT H4, deferred until then) |
| Concept count exceeds 8 | Flat sidebar starts to overload | Consider Kubernetes-style nesting; re-evaluate the LiveKit/LiveAvatar/Prisma 5-item baseline |
| A third state machine appears (beyond Connection + Conversation) | State & Events two-pillar structure becomes unbalanced | Re-split State & Events |
| New client-side SDK component (beyond Avatar / AvatarManager / AvatarController / AvatarView) | Sessions & Lifecycle 4-stage table becomes incomplete | Update Sessions & Lifecycle and Overview's "Who does what" table |
| Mode behavior changes (e.g. SDK Mode adds auto-reconnect) | Some cells in §6.3 become wrong | This table is the single source of Mode boundaries — behavior change PR must update it |

## 11. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Search-landing readers miss Overview and are confused by reframed deep page openings | First 120 words of each deep page are self-contained (D3 verification rule) |
| Overview drifts from deep pages over SDK releases | Overview commits to 4 invariants only and links for everything else; any deep page change that touches an invariant or a §6.3 cell triggers Overview review |
| §6.3 Mode responsibility table goes silently stale | Marked in AGENT.md as the canonical Mode boundary statement; SDK behavior change PRs must review it |
| Term contract anchors are added but other pages don't use them | Acceptable in this PR; anchors serve as future link targets, not as currently-required link sources |
| §6.3 cells written incorrectly (wrong owner) | PR description must cite source of truth (SDK source code path or AGENT.md naming convention) for any cell that changes from prior assumption |

## 12. Acceptance Criteria

### Structure & form
- [ ] `concepts/how-it-works.mdx` exists; slug `/concepts/how-it-works`; sidebar label `How it works`; H1 `How Spatius Works`
- [ ] `docs.json` Concepts `pages` order: `how-it-works` → `avatars` → `sessions-lifecycle` → `audio-io` → `state-events` (5 flat items)
- [ ] Overview contains exactly 5 H2 sections in this order: The pipeline / Terms / Who does what / Where each concept fits / Common failure paths

### Overview content coverage
- [ ] §6.1 includes a Mermaid diagram of `audio → Motion Server → motion data → AvatarKit render`
- [ ] §6.2 has 4 anchors all resolvable in rendered HTML: `#motion-server`, `#motion-data`, `#avatarkit`, `#state-enums`
- [ ] §6.3 covers 5 stages × 3 modes = 15 non-empty cells
- [ ] §6.4 uses "trigger + what you get + deep link" framing for all 4 entries (no definition sentences)
- [ ] §6.5 covers at least 4 failure entry points (token expiry / connection drop / audio format / bad Avatar ID)
- [ ] §7 explicitly enumerates the 4 invariants

### Deep page opening compliance
- [ ] All 4 deep pages have new openings matching §8 verbatim
- [ ] Each opening's first sentence is self-contained (no required reference to "the pipeline" or to Overview)
- [ ] First 120 words of each deep page is verifiable as a standalone scope statement (manual review)

### Anti-drift discipline
- [ ] Overview does NOT restate `ConnectionState` value tables, `ConversationState` value tables, 4-stage detailed flow, sample-rate lists, or any other content owned by deep pages
- [ ] Every concrete behavior reference in Overview is followed by a `→` link to the relevant deep page or subsection

### Regression
- [ ] All 26 existing SDK Reference anchor links across the 4 deep pages still resolve (rerun the curl-based verification used earlier this session)
- [ ] No naming convention violations introduced (no occurrences of `driving service`, `driving data`, `drive data`, `animation stream`, etc.)
- [ ] `mint dev` reports 0 broken internal links

### AGENT.md (optional, recommended)
- [ ] AGENT.md gains 3 new conventions:
  1. Concepts must include an Overview / How-it-works umbrella with a term-contract block as the canonical site-wide terminology source
  2. Concept deep page opening template (sentence 1 self-contained; first 120 words standalone)
  3. The Mode responsibility matrix in Overview is the canonical statement of Mode boundaries; SDK behavior changes must update it in the same PR

## 13. Out of Scope (Bright-Line Exclusions)

- Getting Started, Basic Mode, Custom Mode, LiveKit Plugin chapters — untouched
- SDK Reference, API Reference — untouched
- Existing inline term mentions outside `concepts/` — untouched
- Avatar / motion data / Motion Server promotion to dedicated concept pages — explicitly rejected (D5)
- `audio` abstraction to generic input layer — explicitly rejected (premature, GPT H4)
- Backlinks from deep pages to Overview — explicitly not required (deep page autonomy preserved)
- Cross-platform code-tab walls in Overview — explicitly forbidden (hybrid IA still applies)
- Modifying any existing SDK Reference anchor link — explicitly out of scope; these are regression-tested

## 14. File Change Summary

| # | File | Change | Approx size |
|---|---|---|---|
| 1 | `concepts/how-it-works.mdx` | NEW — full Overview per §6 | ~120 lines |
| 2 | `concepts/avatars.mdx` | Replace opening per §8.1 | -4 / +5 lines |
| 3 | `concepts/sessions-lifecycle.mdx` | Replace opening per §8.2 | -3 / +5 lines |
| 4 | `concepts/audio-io.mdx` | Replace opening per §8.3 | -3 / +4 lines |
| 5 | `concepts/state-events.mdx` | Replace opening per §8.4 | -2 / +3 lines |
| 6 | `docs.json` | Insert `"concepts/how-it-works"` as first item in Concepts `pages` | +1 line |
| 7 | `AGENT.md` | (Optional) add 3 new conventions per §12 | ~+25 lines |

Single PR. No staged rollout.
