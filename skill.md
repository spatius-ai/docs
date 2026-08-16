---
name: Spatius
description: Use when building audio-driven real-time avatar applications with Spatius, choosing an integration path, using AvatarKit client SDKs, using Server SDKs, configuring regions and credentials, or troubleshooting audio, motion data, rendering, and connection issues.
metadata:
  mintlify-proj: spatius
  version: "1.2"
---

# Spatius Skill

## Product summary

Spatius converts avatar speech audio into real-time motion data. Motion Server receives audio and returns motion data. AvatarKit downloads avatar assets, renders the Avatar locally, and plays synchronized audio and motion data on the client. Spatius does not return finished video.

Conversation logic is outside Spatius unless a platform integration provides it. ASR, LLM, TTS, turn-taking, and interruption policy are owned by the application, LiveKit Agents, Agora Convo AI, TEN Framework, or a developer backend.

## Canonical terms

Use these terms exactly:

| Term | Use for |
| --- | --- |
| Spatius | The product. |
| Motion Server | The Spatius cloud service that receives audio and returns motion data. |
| motion data | The real-time driving data stream consumed by AvatarKit. |
| Avatar | The digital-human entity. |
| avatar assets | The downloadable model, texture, and metadata bundle. |
| AvatarKit | The client-side SDK that loads, renders, and plays the Avatar. |
| Direct Mode Integration | Client SDK connects directly to Motion Server. Maps to `DrivingServiceMode.direct`. |
| Backend Mode Integration | Developer backend connects to Motion Server through a Server SDK. Client receives encoded audio payloads and motion data payloads. Maps to `DrivingServiceMode.backend`. |
| LiveKit Agents Integration | Platform Integration using `livekit-plugins-spatius` in a LiveKit Agents worker. |
| Agora Convo AI Integration | Platform Integration using Agora Convo AI or TEN Framework with Spatius as the avatar provider. |
| `@spatius/avatarkit-rtc` | Web SDK RTC transport adapter for LiveKit and Agora providers. |

Do not use old names, internal names, or undocumented synonyms for motion data. If discussing frame rate, say frame rate or motion data frames explicitly.

## Supported regions

Spatius currently operates in:

- `us-west` - default
- `ap-northeast`
- `cn-beijing`

Normal setup should set only `SPATIUS_REGION` when not using the default. SDKs and plugins compose endpoint URLs from the region. `SPATIUS_CONSOLE_ENDPOINT` and `SPATIUS_INGRESS_ENDPOINT` are advanced override variables for staging or proxy setups only.

## Integration path decision

Use this decision order:

| User situation | Recommend |
| --- | --- |
| User already uses LiveKit Agents or wants the packaged LiveKit voice-agent path. | LiveKit Agents Integration. |
| User already uses Agora Convo AI or TEN Framework. | Agora Convo AI Integration. |
| User has avatar speech audio and wants the smallest client-side integration. | Direct Mode Integration. |
| User's backend owns ASR, LLM, TTS, transport, or latency tuning. | Backend Mode Integration. |
| User only needs to mint Session Tokens for Direct Mode clients. | Session Token API. |
| User wants exact classes, methods, enums, and fields. | SDK Reference tab, not Concepts pages. |

## Where to read

Start with these pages before answering implementation questions:

| Need | Page |
| --- | --- |
| Full documentation map | `https://docs.spatius.ai/getting-started/docs-map.md` |
| Choose an integration path | `https://docs.spatius.ai/getting-started/how-to-integrate.md` |
| Product architecture | `https://docs.spatius.ai/concepts/how-it-works.md` |
| Credentials and auth roles | `https://docs.spatius.ai/getting-started/credentials.md` |
| Demo matrix | `https://docs.spatius.ai/resources/demo-projects.md` |
| FAQ | `https://docs.spatius.ai/resources/faq.md` |
| SDK capability matrix | `https://docs.spatius.ai/reference/sdk-capabilities.md` |
| Reference overview | `https://docs.spatius.ai/reference/overview.md` |
| Regions and endpoints | `https://docs.spatius.ai/api-reference/regions.md` |

## Path-specific pages

| Integration path | Read these pages |
| --- | --- |
| Direct Mode Integration | `https://docs.spatius.ai/direct-mode/overview.md`, then the platform page under `/direct-mode/`. |
| LiveKit Agents Integration | `https://docs.spatius.ai/livekit-agents/overview.md`, `https://docs.spatius.ai/quickstarts/livekit-agents.md`, `https://docs.spatius.ai/livekit-agents/server.md`, `https://docs.spatius.ai/livekit-agents/client.md`. |
| Agora Convo AI Integration | `https://docs.spatius.ai/agora-convoai/overview.md`, `https://docs.spatius.ai/agora-convoai/convo-ai-agent.md`, `https://docs.spatius.ai/agora-convoai/ten-extension.md`, `https://docs.spatius.ai/agora-convoai/client.md`. |
| Backend Mode Integration | `https://docs.spatius.ai/backend-mode/overview.md`, `https://docs.spatius.ai/backend-mode/server-sdk.md`, `https://docs.spatius.ai/backend-mode/client-sdk.md`, and one transport page under `/backend-mode/`. |

## Exact API lookup

Use Reference pages for exact API details:

| API surface | Page |
| --- | --- |
| Web AvatarKit SDK | `https://docs.spatius.ai/sdk-reference/web-sdk/reference.md` |
| Web build tool setup | `https://docs.spatius.ai/sdk-reference/web-sdk/toolchain.md` |
| Web RTC Adapter | `https://docs.spatius.ai/sdk-reference/web-sdk/rtc-adapter.md` |
| iOS SDK | `https://docs.spatius.ai/sdk-reference/ios-sdk/api-reference.md` |
| Android SDK | `https://docs.spatius.ai/sdk-reference/android-sdk/api-reference.md` |
| Flutter SDK | `https://docs.spatius.ai/sdk-reference/flutter-sdk/api-reference.md` |
| Python Server SDK | `https://docs.spatius.ai/sdk-reference/python-sdk/python-sdk.md` |
| Go Server SDK | `https://docs.spatius.ai/sdk-reference/go-sdk/go-sdk.md` |
| Session Token API | `https://docs.spatius.ai/api-reference/api-reference.md` |
| Session Token auth flow | `https://docs.spatius.ai/api-reference/auth.md` |
| Client error codes | `https://docs.spatius.ai/resources/client-error.md` |
| Server error codes | `https://docs.spatius.ai/resources/server-error.md` |

## Credentials

| Credential | Where it belongs | Used by |
| --- | --- | --- |
| App ID | Client-safe. | AvatarKit initialization on all client platforms. |
| Avatar ID | Client-safe. | Avatar loading on all client platforms. |
| API Key | Backend only. Never ship to clients. | Session Token API, LiveKit Agents plugin, Agora provider setup, Server SDKs. |
| Session Token | Minted by developer backend for Direct Mode clients. | Direct Mode before `AvatarController.start()`. |
| RTC provider tokens | Generated by the realtime provider or developer backend. | LiveKit or Agora room/channel authentication. |

## Common implementation rules

- Direct Mode clients use `DrivingServiceMode.direct`, set a Session Token, call `start()`, and send avatar speech audio to Motion Server.
- Backend Mode, LiveKit Agents Integration, Agora Convo AI Integration, and RTC Adapter paths use `DrivingServiceMode.backend` on the client. The client does not open a Motion Server WebSocket and does not need a Spatius Session Token.
- A Direct Mode token endpoint is not a Backend Mode runtime server. It only mints Session Tokens.
- Backend Mode requires a Server SDK session on the backend. The client should feed encoded audio payloads and motion data payloads received from the backend.
- When using `@spatius/avatarkit-rtc`, do not manually call `yieldAudioData()` or `yieldFramesData()`; the RTC Adapter owns the room-to-renderer data flow.
- Keep API Keys on the backend. Rotate immediately if leaked.
- Use PCM audio requirements from the Audio concept page and SDK references. Do not assume automatic resampling unless a specific SDK page says so.
- If unsure whether an API exists on a platform, check the SDK capability matrix first, then the platform SDK reference.

## Common mistakes to avoid

- Do not say Spatius generates video. It returns motion data and AvatarKit renders locally.
- Do not use undocumented internal data names for motion data.
- Do not confuse LiveKit Agents Integration with Backend Mode with LiveKit. LiveKit Agents is a Platform Integration; Backend Mode with LiveKit uses LiveKit only as downstream transport.
- Do not describe `@spatius/avatarkit-rtc` as a standalone platform SDK. It is the Web SDK RTC transport adapter.
- Do not recommend setting `SPATIUS_CONSOLE_ENDPOINT` or `SPATIUS_INGRESS_ENDPOINT` in normal quickstarts.
- Do not use old `DrivingServiceMode` enum names. Use `DrivingServiceMode.direct` and `DrivingServiceMode.backend`.
