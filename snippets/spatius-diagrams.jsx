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
        <text x="1249" y="359" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">AvatarKit SDK</text>
        <text x="1249" y="408" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="24" fontWeight="500">Web/iOS/Android</text>
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
    <div className="spatius-diagram not-prose" aria-label="LiveKit plugin architecture">
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
        <rect x="285" y="152" width="310" height="92" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="192" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">
          <tspan x="440">AgentSession</tspan>
          <tspan x="440" dy="34" fill="var(--spatius-diagram-muted)" fontSize="22">ASR / LLM / TTS</tspan>
        </text>
        <rect x="285" y="276" width="310" height="82" rx="12" fill="var(--spatius-diagram-node)" stroke="var(--spatius-diagram-stroke)" strokeWidth="3" />
        <text x="440" y="311" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="30" fontWeight="500">LiveKit Plugin</text>
        <text x="440" y="342" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">livekit-plugins-spatius</text>
        <polyline points="608,317 865,317" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="1000,400 1000,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />

        <polyline points="440,442 440,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-livekit-surface)" stroke="var(--spatius-diagram-livekit)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">LiveKit room</text>

        <rect x="535" y="615" width="300" height="130" rx="14" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="680" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="25" fontWeight="500">Web</text>
        <polyline points="665,605 665,548" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />
        <polyline points="705,548 705,605" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-rtc)" />

        <g className="spatius-audio-visualizer" aria-label="user audio">
          <rect className="spatius-audio-bar" x="220" y="654" width="8" height="54" rx="4" />
          <rect className="spatius-audio-bar" x="238" y="640" width="8" height="82" rx="4" />
          <rect className="spatius-audio-bar" x="256" y="662" width="8" height="38" rx="4" />
          <rect className="spatius-audio-bar" x="274" y="634" width="8" height="94" rx="4" />
          <rect className="spatius-audio-bar" x="292" y="650" width="8" height="62" rx="4" />
        </g>
        <text x="260" y="748" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="28" fontWeight="500">user audio</text>
        <polyline points="335,680 525,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />
        <polyline points="847,680 1080,680" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-livekit-ink)" />
        <text x="1102" y="690" textAnchor="start" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">Avatar</text>
      </svg>
    </div>
  )
}

export const CustomModeRtcTransportDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="Custom mode architecture with RTC transport">
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
        <text x="440" y="342" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">custom mode</text>
        <polyline points="608,317 865,317" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-ink)" />

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="1000,400 1000,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />

        <polyline points="440,442 440,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-livekit)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-rtc-transport)" />
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-livekit-surface)" stroke="var(--spatius-diagram-livekit)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">LiveKit transport</text>

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

export const CustomModeOwnTransportDiagram = () => {
  return (
    <div className="spatius-diagram not-prose" aria-label="Custom mode architecture with your own transport">
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
        <text x="440" y="342" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="500">custom mode</text>
        <polyline points="608,306 865,306" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <polyline points="865,328 608,328" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-ink)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-ink)" />
        <text x="736" y="290" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Agent Audio</text>
        <text x="736" y="363" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Animation Data</text>

        <rect x="875" y="118" width="250" height="275" rx="18" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="31" fontWeight="500">
          <tspan x="1000">Motion</tspan>
          <tspan x="1000" dy="44">Server</tspan>
        </text>
        <polyline points="420,442 420,405" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />
        <polyline points="460,405 460,442" className="spatius-diagram-flow" fill="none" stroke="var(--spatius-diagram-red)" strokeWidth="4" strokeLinecap="round" markerEnd="url(#spatius-custom-own-transport)" />
        <text x="376" y="428" textAnchor="end" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">User Audio</text>
        <text x="490" y="428" textAnchor="start" fill="var(--spatius-diagram-muted)" fontSize="20" fontWeight="600">Agent Audio + Animation Data</text>
        <rect x="310" y="452" width="750" height="82" rx="12" fill="var(--spatius-diagram-owned)" stroke="var(--spatius-diagram-red)" strokeWidth="3" />
        <text x="685" y="505" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="600">Your own transport layer</text>

        <rect x="535" y="615" width="300" height="130" rx="14" fill="var(--spatius-diagram-managed)" stroke="var(--spatius-diagram-brand)" strokeWidth="3" />
        <text x="685" y="680" textAnchor="middle" fill="var(--spatius-diagram-ink)" fontSize="32" fontWeight="500">AvatarKit SDK</text>
        <text x="685" y="722" textAnchor="middle" fill="var(--spatius-diagram-muted)" fontSize="25" fontWeight="500">Web/iOS/Android</text>
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
