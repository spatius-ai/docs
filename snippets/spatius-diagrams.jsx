export const SpatiusArchitectureDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="Spatius on-device rendering architecture">
      <svg viewBox="0 0 1640 520" role="img">
        <defs>
          <marker id="spatius-arch-arrow" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
        </defs>

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="74" y="264" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="92" y="250" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="110" y="272" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="128" y="244" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="146" y="260" width="8" height="62" rx="4" />
        </g>
        <text x="114" y="370" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>

        <g className="spatius-agent-pipeline">
          <polyline points="178,292 265,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />

          <rect x="275" y="242" width="165" height="100" rx="10" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
          <text x="357" y="306" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">ASR</text>
          <polyline points="446,292 510,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />

          <rect x="520" y="242" width="165" height="100" rx="10" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
          <text x="602" y="306" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">LLM</text>
          <polyline points="690,292 755,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />

          <rect x="765" y="242" width="165" height="100" rx="10" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
          <text x="847" y="306" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">TTS</text>
          <text x="1010" y="232" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">
            <tspan x="1010">Agent</tspan>
            <tspan x="1010" dy="38">Audio</tspan>
          </text>
          <polyline points="938,292 1088,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
        </g>

        <g className="spatius-agent-speech">
          <polyline points="178,292 300,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
          <rect x="310" y="242" width="610" height="100" rx="12" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
          <text x="615" y="300" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">Speech-to-Speech Model</text>
          <text x="615" y="330" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="22" fontWeight="500">direct realtime voice model</text>
          <text x="1010" y="232" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">
            <tspan x="1010">Agent</tspan>
            <tspan x="1010" dy="38">Audio</tspan>
          </text>
          <polyline points="928,292 1088,292" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
        </g>

        <text x="1245" y="48" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="30" fontWeight="500">Spatius Managed</text>
        <rect className="spatius-diagram-zone" x="1100" y="78" width="300" height="400" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <rect x="1137" y="115" width="225" height="120" rx="10" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="1249" y="187" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">
          <tspan x="1249">Motion Server</tspan>
        </text>
        <rect x="1137" y="300" width="225" height="120" rx="10" fill="var(--spatius-diagram-box)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="1249" y="360" textAnchor="middle" dominantBaseline="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">AvatarKit SDK</text>
        <polyline points="1238,290 1238,246" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
        <polyline points="1262,246 1262,290" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
        <polyline points="1365,360 1488,360" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-arch-arrow)" />
        <text x="1510" y="370" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">
          <tspan x="1510">Avatar</tspan>
        </text>
      </svg>
    </div>
  )
}

export const LiveKitPluginDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="LiveKit Agents Integration architecture">
      <svg viewBox="-83 0 1535 800" role="img">
        <defs>
          <marker id="spatius-livekit-rtc" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-livekit)" />
          </marker>
          <marker id="spatius-livekit-ink" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
        </defs>

        <text x="440" y="72" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="30" fontWeight="600">You Managed</text>
        <text x="1000" y="72" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="30" fontWeight="600">Spatius Managed</text>

        <rect x="245" y="118" width="390" height="275" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="148" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="21" fontWeight="600">LiveKit Agents Worker</text>
        <rect x="285" y="168" width="310" height="112" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="204" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="29" fontWeight="500">
          <tspan x="440">AgentSession</tspan>
          <tspan x="440" dy="32" fill="var(--spatius-diagram-muted)" fontSize="21">STT / LLM / TTS</tspan>
          <tspan x="440" dy="27" fill="var(--spatius-diagram-muted)" fontSize="19">VAD / turns / tools</tspan>
        </text>
        <rect x="285" y="302" width="310" height="72" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="332" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">Spatius Plugin</text>
        <text x="440" y="360" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="19" fontWeight="500">livekit-plugins-spatius</text>
        <polyline points="608,338 865,338" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="1000,400 1000,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />
        <polyline points="440,442 440,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-livekit-surface)" stroke="var(--spatius-diagram-livekit)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">LiveKit room</text>

        <rect x="470" y="570" width="430" height="215" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" opacity="0.72" />
        <rect x="500" y="590" width="370" height="78" rx="12" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="624" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">RTC Adapter</text>
        <text x="685" y="652" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">LiveKit provider</text>
        <polyline points="665,580 665,548" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />
        <polyline points="705,548 705,580" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />

        <rect x="535" y="705" width="300" height="70" rx="12" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="734" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="27" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="760" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="19" fontWeight="500">client renderer</text>
        <polyline points="685,675 685,696" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="220" y="602" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="238" y="588" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="256" y="610" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="274" y="582" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="292" y="598" width="8" height="62" rx="4" />
        </g>
        <text x="260" y="696" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>
        <polyline points="335,630 490,630" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />
        <polyline points="847,740 1080,740" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />
        <text x="1102" y="750" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">Avatar</text>
      </svg>
    </div>
  )
}

export const AgoraConvoAiDiagram = () => {
  return (
    <div className="spatius-diagram spatius-agora-diagram not-prose" aria-label="Agora Convo AI Integration architecture">
      <svg viewBox="-83 0 1535 800" role="img">
        <defs>
          <marker id="spatius-agora-rtc" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-agora)" />
          </marker>
          <marker id="spatius-agora-ink" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
        </defs>

        <text x="440" y="72" textAnchor="middle" fill="var(--spatius-diagram-agora)" fontSize="30" fontWeight="600">Agora Managed</text>
        <text x="1000" y="72" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="30" fontWeight="600">Spatius Managed</text>

        <rect x="245" y="118" width="390" height="275" rx="18" fill="var(--spatius-diagram-agora-surface)" stroke="var(--spatius-diagram-agora-stroke)" strokeWidth="3" />
        <text x="440" y="148" textAnchor="middle" fill="var(--spatius-diagram-agora)" fontSize="21" fontWeight="600">Agora Convo AI</text>
        <rect x="285" y="168" width="310" height="112" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="204" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="29" fontWeight="500">
          <tspan x="440">Convo AI agent</tspan>
          <tspan x="440" dy="32" fill="var(--spatius-diagram-muted)" fontSize="21">ASR / LLM / TTS</tspan>
          <tspan x="440" dy="27" fill="var(--spatius-diagram-muted)" fontSize="19">turns / tools / audio</tspan>
        </text>
        <rect x="285" y="302" width="310" height="72" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="332" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">Spatius avatar</text>
        <text x="440" y="360" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="19" fontWeight="500">vendor: spatius</text>
        <polyline points="608,338 865,338" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-ink)" />

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="1000,400 1000,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-agora)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-rtc)" />
        <polyline points="440,442 440,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-agora)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-rtc)" />
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-agora-surface)" stroke="var(--spatius-diagram-agora)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">Agora channel</text>

        <rect x="470" y="570" width="430" height="215" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" opacity="0.72" />
        <rect x="500" y="590" width="370" height="78" rx="12" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="624" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">RTC Adapter</text>
        <text x="685" y="652" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">Agora provider</text>
        <polyline points="665,580 665,548" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-agora)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-rtc)" />
        <polyline points="705,548 705,580" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-agora)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-rtc)" />

        <rect x="535" y="705" width="300" height="70" rx="12" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="734" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="27" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="760" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="19" fontWeight="500">client renderer</text>
        <polyline points="685,675 685,696" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-ink)" />

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="220" y="602" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="238" y="588" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="256" y="610" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="274" y="582" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="292" y="598" width="8" height="62" rx="4" />
        </g>
        <text x="260" y="696" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>
        <polyline points="335,630 490,630" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-ink)" />
        <polyline points="847,740 1080,740" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-agora-ink)" />
        <text x="1102" y="750" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">Avatar</text>
      </svg>
    </div>
  )
}

export const HostedModeRealtimeTransportDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="Backend Mode architecture with third-party realtime transport">
      <svg viewBox="-83 0 1535 800" role="img">
        <defs>
          <marker id="spatius-custom-rtc-transport" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-livekit)" />
          </marker>
          <marker id="spatius-custom-rtc-ink" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
        </defs>

        <text x="440" y="72" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="30" fontWeight="600">You Managed</text>
        <text x="1000" y="72" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="30" fontWeight="600">Spatius Managed</text>

        <rect x="245" y="118" width="390" height="275" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <rect x="285" y="152" width="310" height="92" rx="12" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-red)" strokeWidth="3" />
        <text x="440" y="192" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">
          <tspan x="440">Voice Agent</tspan>
          <tspan x="440" dy="34" fill="var(--spatius-diagram-muted)" fontSize="22">ASR / LLM / TTS</tspan>
        </text>
        <rect x="285" y="276" width="310" height="82" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="311" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">Server SDK</text>
        <text x="440" y="342" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">Backend Mode</text>
        <polyline points="608,317 865,317" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-ink)" />

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="1000,400 1000,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />

        <polyline points="440,442 440,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-livekit-surface)" stroke="var(--spatius-diagram-livekit)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">Realtime transport</text>

        <rect x="535" y="615" width="300" height="130" rx="14" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="680" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="25" fontWeight="500">Web</text>
        <polyline points="665,605 665,548" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />
        <polyline points="705,548 705,605" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="220" y="654" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="238" y="640" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="256" y="662" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="274" y="634" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="292" y="650" width="8" height="62" rx="4" />
        </g>
        <text x="260" y="748" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>
        <polyline points="335,680 525,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-ink)" />
        <polyline points="847,680 1080,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-ink)" />
        <text x="1102" y="690" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">Avatar</text>
      </svg>
    </div>
  )
}

export const HostedModeOwnTransportDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="Backend Mode architecture with your own transport">
      <svg viewBox="-83 0 1535 800" role="img">
        <defs>
          <marker id="spatius-custom-own-transport" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-red)" />
          </marker>
          <marker id="spatius-custom-own-ink" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
        </defs>

        <text x="440" y="72" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="30" fontWeight="600">You Managed</text>
        <text x="1000" y="72" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="30" fontWeight="600">Spatius Managed</text>

        <rect x="245" y="118" width="390" height="275" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <rect x="285" y="152" width="310" height="92" rx="12" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-red)" strokeWidth="3" />
        <text x="440" y="192" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">
          <tspan x="440">Voice Agent</tspan>
          <tspan x="440" dy="34" fill="var(--spatius-diagram-muted)" fontSize="22">ASR / LLM / TTS</tspan>
        </text>
        <rect x="285" y="276" width="310" height="82" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="311" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">Server SDK</text>
        <text x="440" y="342" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">Backend Mode</text>
        <polyline points="608,306 865,306" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <polyline points="865,328 608,328" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <text x="736" y="290" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Agent Audio</text>
        <text x="736" y="363" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Motion Data</text>

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="420,442 420,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />
        <polyline points="460,405 460,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />
        <text x="376" y="428" textAnchor="end" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">User Audio</text>
        <text x="490" y="428" textAnchor="start" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Agent Audio + Motion Data</text>
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-red)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">Your own transport layer</text>

        <rect x="535" y="615" width="300" height="130" rx="14" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="680" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="23" fontWeight="500">Web/iOS/Android/Flutter</text>
        <polyline points="665,605 665,548" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />
        <polyline points="705,548 705,605" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="220" y="654" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="238" y="640" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="256" y="662" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="274" y="634" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="292" y="650" width="8" height="62" rx="4" />
        </g>
        <text x="260" y="748" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>
        <polyline points="335,680 525,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <polyline points="847,680 1080,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <text x="1102" y="690" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">Avatar</text>
      </svg>
    </div>
  )
}

export const AudioSendTimingDiagram = () => {
  return (
    <div className="spatius-diagram spatius-audio-timing-diagram not-prose" aria-label="Comparison of generated audio and paced audio for client playback buffering">
      <svg viewBox="0 0 980 980" role="img">
        <defs>
          <marker id="spatius-audio-timing-good" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-ink)" />
          </marker>
          <marker id="spatius-audio-timing-bad" viewBox="0 0 12 10" refX="10.5" refY="5" markerWidth="4.5" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L12 5L0 10Z" fill="var(--spatius-diagram-warning)" />
          </marker>
        </defs>

        <text x="305" y="54" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="24" fontWeight="600">Generated Audio Path</text>
        <text x="770" y="54" textAnchor="middle" fill="var(--spatius-diagram-brand)" fontSize="24" fontWeight="600">Inference + Playback</text>

        <rect x="40" y="100" width="530" height="340" rx="18" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="305" y="136" textAnchor="middle" fill="var(--spatius-diagram-red)" fontSize="18" fontWeight="600">Works: send new TTS chunks immediately</text>

        <rect x="80" y="180" width="170" height="102" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="165" y="222" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">TTS</text>
        <text x="165" y="254" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="18" fontWeight="500">new chunks</text>

        <rect x="360" y="180" width="170" height="102" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="445" y="220" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="25" fontWeight="500">SDK send</text>
        <text x="445" y="252" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="18" fontWeight="500">immediate</text>

        <polyline points="262,231 348,231" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-audio-timing-good)" />

        <text x="85" y="334" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="600">generation time</text>
        <line x1="85" y1="360" x2="525" y2="360" stroke="var(--spatius-diagram-stroke)" strokeWidth="4" strokeLinecap="round" />
        <g className="spatius-timing-fast-chunks">
          <rect x="255" y="336" width="48" height="48" rx="8" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
          <text x="279" y="367" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">1</text>
          <rect x="318" y="336" width="48" height="48" rx="8" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
          <text x="342" y="367" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">2</text>
          <rect x="381" y="336" width="48" height="48" rx="8" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
          <text x="405" y="367" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">3</text>
        </g>
        <text x="305" y="416" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="500">chunks arrive ahead of playback</text>

        <rect x="620" y="100" width="300" height="340" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <rect x="670" y="158" width="200" height="120" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="770" y="203" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">
          <tspan x="770">Motion</tspan>
          <tspan x="770" dy="36">Server</tspan>
        </text>
        <g className="spatius-timing-window-pulse">
          <rect x="682" y="318" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
          <rect x="744" y="318" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
          <rect x="806" y="318" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-brand)" strokeWidth="2.5" />
        </g>
        <text x="770" y="396" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="500">buffer stays ahead</text>

        <polyline points="540,231 658,231" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-audio-timing-good)" />
        <circle className="spatius-timing-packet spatius-timing-packet-good" cx="550" cy="231" r="9" fill="var(--spatius-diagram-brand)" />
        <circle className="spatius-timing-packet spatius-timing-packet-good spatius-timing-delay-1" cx="550" cy="231" r="9" fill="var(--spatius-diagram-brand)" />
        <circle className="spatius-timing-packet spatius-timing-packet-good spatius-timing-delay-2" cx="550" cy="231" r="9" fill="var(--spatius-diagram-brand)" />
        <text x="600" y="207" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="600">fast</text>

        <text x="305" y="526" textAnchor="middle" fill="var(--spatius-diagram-warning)" fontSize="24" fontWeight="600">Paced Audio Path</text>
        <text x="770" y="526" textAnchor="middle" fill="var(--spatius-diagram-warning)" fontSize="24" fontWeight="600">Playback Buffer</text>

        <rect x="40" y="570" width="530" height="340" rx="18" fill="var(--spatius-diagram-warning-surface)" stroke="var(--spatius-diagram-warning-stroke)" strokeWidth="3" />
        <text x="305" y="606" textAnchor="middle" fill="var(--spatius-diagram-warning)" fontSize="18" fontWeight="600">Avoid: send 1x playback-speed output</text>

        <rect x="80" y="650" width="170" height="102" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="165" y="690" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="24" fontWeight="500">Paced audio</text>
        <text x="165" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="18" fontWeight="500">already heard</text>

        <rect x="360" y="650" width="170" height="102" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="445" y="690" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="25" fontWeight="500">Decode</text>
        <text x="445" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="18" fontWeight="500">paced at 1x</text>

        <polyline points="262,701 348,701" className="spatius-diagram-flow spatius-timing-flow-bad" fill="none" stroke="var(--spatius-diagram-warning)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-audio-timing-bad)" />

        <text x="85" y="804" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="600">playback time</text>
        <line x1="85" y1="830" x2="525" y2="830" stroke="var(--spatius-diagram-stroke)" strokeWidth="4" strokeLinecap="round" />
        <g className="spatius-timing-slow-chunks">
          <rect x="225" y="806" width="48" height="48" rx="8" fill="var(--spatius-diagram-warning-surface)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
          <text x="249" y="837" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">1</text>
          <rect x="347" y="806" width="48" height="48" rx="8" fill="var(--spatius-diagram-warning-surface)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
          <text x="371" y="837" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">2</text>
          <rect x="469" y="806" width="48" height="48" rx="8" fill="var(--spatius-diagram-warning-surface)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
          <text x="493" y="837" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="18" fontWeight="700">3</text>
        </g>
        <text x="305" y="886" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="500">chunks arrive only when listeners hear them</text>

        <rect x="620" y="570" width="300" height="340" rx="18" fill="var(--spatius-diagram-warning-surface)" stroke="var(--spatius-diagram-warning)" strokeWidth="3" />
        <rect x="670" y="625" width="200" height="118" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-warning)" strokeWidth="3" />
        <text x="770" y="670" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="28" fontWeight="500">
          <tspan x="770">Motion</tspan>
          <tspan x="770" dy="36">Server</tspan>
        </text>
        <text x="770" y="772" textAnchor="middle" fill="var(--spatius-diagram-warning)" fontSize="20" fontWeight="700">motion returned</text>
        <text x="770" y="884" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="18" fontWeight="500">playback can stall</text>

        <polyline points="540,701 658,701" className="spatius-diagram-flow spatius-timing-flow-bad" fill="none" stroke="var(--spatius-diagram-warning)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-audio-timing-bad)" />
        <circle className="spatius-timing-packet spatius-timing-packet-bad" cx="550" cy="701" r="9" fill="var(--spatius-diagram-warning)" />
        <text x="600" y="677" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="17" fontWeight="600">1x</text>

        <g className="spatius-timing-window-pulse">
          <rect x="682" y="802" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
          <rect x="744" y="802" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
          <rect x="806" y="802" width="52" height="46" rx="8" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-warning)" strokeWidth="2.5" />
        </g>
        <g className="spatius-timing-blocker">
          <line x1="742" y1="795" x2="798" y2="855" stroke="var(--spatius-diagram-warning)" strokeWidth="8" strokeLinecap="round" />
          <line x1="798" y1="795" x2="742" y2="855" stroke="var(--spatius-diagram-warning)" strokeWidth="8" strokeLinecap="round" />
        </g>

      </svg>
    </div>
  )
}
