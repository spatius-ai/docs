---
name: Spatius
description: Use when building audio-driven real-time avatar applications with Spatius, choosing an integration, using AvatarKit client SDKs, using Server SDKs, configuring regions and credentials, or troubleshooting audio, motion data, rendering, and connection issues.
metadata:
  mintlify-proj: spatius
  version: "1.3"
---

# Spatius Skill

## Product summary

Spatius converts avatar speech audio into real-time motion data. Motion Server receives audio and returns motion data. AvatarKit downloads avatar assets, renders the Avatar locally, and plays synchronized audio and motion data on the client. Spatius does not return finished video.

Conversation logic is outside Spatius unless LiveKit Agents or Agora provides it. ASR, LLM, TTS, turn-taking, and interruption policy are owned by the application, LiveKit Agents, Agora Convo AI, TEN Framework, or a developer backend.

## Canonical terms

Use these terms exactly:

| Term | Use for |
| --- | --- |
| Spatius | The product. |
| Motion Server | The Spatius cloud service that receives audio and returns motion data. |
| motion data | Data produced by Motion Server and consumed by AvatarKit. |
| Avatar | The 3D character rendered by AvatarKit. |
| avatar assets | The downloadable model, texture, and metadata bundle. |
| AvatarKit | The client-side SDK that loads, renders, and plays the Avatar. |
| Direct Mode Integration | Client SDK connects directly to Motion Server. Maps to `DrivingServiceMode.direct`. |
| Backend Mode Integration | Developer backend connects to Motion Server through a Server SDK. Client receives response audio and motion data. Maps to `DrivingServiceMode.backend`. |
| LiveKit Agents Integration | Recommended integration using `livekit-plugins-spatius` in a LiveKit Agents worker. |
| Agora Convo AI Integration | Recommended integration using Agora Convo AI or TEN Framework with Spatius as the avatar provider. |
| `@spatius/avatarkit-rtc` | Web SDK RTC transport adapter for LiveKit and Agora providers. |

Do not use old names, internal names, or undocumented synonyms for motion data. If discussing frame rate, say frame rate or motion data frames explicitly.

## Supported regions

Spatius currently operates in:

- `us-west`
- `ap-northeast`
- `cn-beijing`

Defaults differ by SDK: AvatarKit clients and the Python Server SDK use automatic selection, while the Go Server SDK defaults to `us-west`. Set only `SPATIUS_REGION` when a server-side integration needs an explicit region. `SPATIUS_CONSOLE_ENDPOINT` and `SPATIUS_INGRESS_ENDPOINT` are advanced override variables for staging or proxy setups only.

## Integration decision

All four integrations live under one **Integrations** navigation group in this order: LiveKit Agents Integration, Agora Convo AI Integration, Direct Mode Integration, and Backend Mode Integration. The first two are tagged `Recommended`; their concise navigation labels are **LiveKit Agents** and **Agora ConvoAI**. Do not recreate separate platform-versus-SDK navigation categories.

Use this decision order:

| User situation | Recommend |
| --- | --- |
| User already uses LiveKit Agents or wants the packaged LiveKit voice-agent path. | LiveKit Agents Integration. |
| User already uses Agora Convo AI or TEN Framework. | Agora Convo AI Integration. |
| User has avatar speech audio and wants the smallest client-side integration. | Direct Mode Integration. |
| User's backend owns ASR, LLM, TTS, client delivery, or latency tuning. | Backend Mode Integration. |
| User only needs to mint Session Tokens for Direct Mode clients. | Session Token API. |
| User wants exact classes, methods, enums, and fields. | SDK Reference tab, not Concepts pages. |

## Where to read

Start with these pages before answering implementation questions:

| Need | Page |
| --- | --- |
| Compare integrations | `https://docs.spatius.ai/integrations/overview.md` |
| Product architecture | `https://docs.spatius.ai/concepts/how-it-works.md` |
| Direct Mode authentication | `https://docs.spatius.ai/api-reference/auth.md` |
| Demo matrix | `https://docs.spatius.ai/resources/demo-projects.md` |
| Scenario quickstarts | `https://docs.spatius.ai/quickstarts/web-sdk.md`, `https://docs.spatius.ai/quickstarts/ios-sdk.md`, `https://docs.spatius.ai/quickstarts/android-sdk.md`, and `https://github.com/spatius-ai/spatius-scenario-demo` |
| FAQ | `https://docs.spatius.ai/resources/faq.md` |
| SDK capability matrix | `https://docs.spatius.ai/reference/sdk-capabilities.md` |
| Reference overview | `https://docs.spatius.ai/reference/overview.md` |
| Regions and endpoints | `https://docs.spatius.ai/api-reference/regions.md` |

## Integration pages

| Integration | Read these pages |
| --- | --- |
| Direct Mode Integration | `https://docs.spatius.ai/direct-mode/client.md`; choose Web, iOS, Android, or Flutter on the page. |
| LiveKit Agents Integration | `https://docs.spatius.ai/livekit-agents/overview.md`, `https://docs.spatius.ai/livekit-agents/server.md`, and `https://docs.spatius.ai/livekit-agents/client.md`. Use the Web platform Quickstart for the runnable LiveKit scenario. |
| Agora Convo AI Integration | `https://docs.spatius.ai/agora-convoai/overview.md`, `https://docs.spatius.ai/agora-convoai/convo-ai-agent.md`, `https://docs.spatius.ai/agora-convoai/ten-extension.md`, `https://docs.spatius.ai/agora-convoai/client.md`. |
| Backend Mode Integration | `https://docs.spatius.ai/backend-mode/server-sdk.md` for Backend Setup, then `https://docs.spatius.ai/backend-mode/client-sdk.md` for the Client. |

The platform Quickstarts run the scenario demo on Web, iOS, and Android. Web includes LiveKit and Agora providers. The current iOS and Android scenario implementations use the included Agora provider, but this is a demo-specific implementation choice: both platforms also support Direct Mode, Backend Mode, and the public RTC provider abstraction. Flutter has SDK and integration documentation but no scenario Quickstart.

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
- LiveKit Agents and Agora RTC clients use `DrivingServiceMode.rtc`; the RTC provider owns room-to-renderer delivery. Backend Mode clients use `DrivingServiceMode.backend` and feed backend-delivered payloads into AvatarKit. Neither path opens a client-side Motion Server WebSocket or needs a Spatius Session Token.
- A Direct Mode token endpoint is not a Backend Mode runtime server. It only mints Session Tokens.
- Backend Mode requires a Server SDK session on the backend. The client should feed response audio and motion data received from the backend.
- When using `@spatius/avatarkit-rtc`, do not manually call `yieldAudioData()` or `yieldFramesData()`; the RTC Adapter owns the room-to-renderer data flow.
- iOS `AvatarKitRTC` and Android `ai.spatius:avatarkit-rtc` expose a public `RTCProvider` abstraction and currently bundle `AgoraProvider`. Do not describe the platforms as Agora-only, and do not claim they bundle a native LiveKit provider until the published SDKs do.
- Keep API Keys on the backend. Rotate immediately if leaked.
- Use PCM audio requirements from the Audio concept page and SDK references. Do not assume automatic resampling unless a specific SDK page says so.
- If unsure whether an API exists on a platform, check the SDK capability matrix first, then the platform SDK reference.

## Common mistakes to avoid

- Do not say Spatius generates video. It returns motion data and AvatarKit renders locally.
- Do not use undocumented internal data names for motion data.
- Do not present Server SDK RTC egress as a separate integration path. LiveKit Agents and Agora Convo AI remain the supported packaged RTC integrations.
- Do not describe `@spatius/avatarkit-rtc` as a standalone platform SDK. It is the Web SDK RTC transport adapter.
- Do not recommend setting `SPATIUS_CONSOLE_ENDPOINT` or `SPATIUS_INGRESS_ENDPOINT` in normal quickstarts.
- Do not use old `DrivingServiceMode` enum names. Use `DrivingServiceMode.direct`, `DrivingServiceMode.backend`, and `DrivingServiceMode.rtc` for their documented paths.
