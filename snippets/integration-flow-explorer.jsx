export const IntegrationFlowExplorer = () => {
const INTEGRATIONS = [
  { id: 'livekit', label: 'LiveKit Agents', recommended: true },
  { id: 'agora', label: 'Agora ConvoAI', recommended: true },
  { id: 'direct', label: 'Direct Mode' },
  { id: 'backend', label: 'Backend Mode' },
]

const SOURCES = [
  { id: 'realtime', label: 'Realtime Audio' },
  { id: 'preset', label: 'Preset Audio' },
]

const wire = (id, points, options = {}) => ({
  id,
  points,
  dataType: options.dataType ?? 'audio',
  ...options,
})
const owner = (id, x, y, width, height, label) => ({ id, x, y, width, height, label, kind: 'owner' })
const box = (id, x, y, width, height, label, kind = 'plain') => ({ id, x, y, width, height, label, kind })
const verticalDataLane = (centerX, dataType) => centerX + (dataType === 'audio' ? -40 : 40)
const appVerticalDataLane = (centerX, dataType) => centerX + (dataType === 'motion' ? -40 : 40)
const horizontalDataLane = (centerY, dataType) => centerY + (dataType === 'audio' ? -14 : 14)

const directFlow = (source) => {
  const realtime = source === 'realtime'
  const clientY = 80
  const businessY = clientY + 75
  const sdkY = 350
  const motionY = sdkY
  const clientCenterX = 990
  const dataCenterY = sdkY + 42
  const appAudioX = appVerticalDataLane(clientCenterX, 'audio')
  const audioY = horizontalDataLane(dataCenterY, 'audio')
  const motionYLane = horizontalDataLane(dataCenterY, 'motion')

  return {
    key: `${source}-direct`,
    title: `${realtime ? 'Realtime' : 'Preset'} audio · Direct Mode`,
    showLatency: realtime,
    description: realtime
      ? 'A realtime audio source sends avatar speech audio to the app business layer, which passes it to AvatarKit. AvatarKit sends it to Motion Server and receives motion data for local rendering.'
      : 'The app business layer passes preset avatar speech audio to AvatarKit. AvatarKit sends it to Motion Server and receives motion data for local rendering.',
    height: 540,
    nodes: [
      ...(realtime ? [box('audio-provider', 180, businessY, 236, 84, 'Realtime audio source')] : []),
      box('motion-server', 180, motionY, 236, 84, 'Motion Server', 'service'),
      owner('client', 840, clientY, 300, 430, 'Your app'),
      box('client-business', 885, businessY, 210, 84, 'Your Business Layer', 'business'),
      box('sdk', 885, sdkY, 210, 84, 'AvatarKit SDK', 'sdk'),
    ],
    wires: [
      ...(realtime ? [wire('provider-audio', [[416, businessY + 42], [885, businessY + 42]], {
        crossing: true, stage: 1, target: 'client-business',
      })] : []),
      wire('handoff', [[appAudioX, businessY + 84], [appAudioX, sdkY]], {
        target: 'sdk',
      }),
      wire('audio', [[885, audioY], [416, audioY]], {
        crossing: true, stage: realtime ? 2 : 1, target: 'motion-server',
      }),
      wire('motion', [[416, motionYLane], [885, motionYLane]], {
        crossing: true, stage: realtime ? 3 : 2, target: 'sdk', dataType: 'motion',
      }),
    ],
    journey: [
      ...(realtime ? [['provider-audio']] : []),
      ['handoff'],
      ['audio'],
      ['motion'],
    ],
  }
}

const backendFlow = (source) => {
  const realtime = source === 'realtime'
  const ownerY = realtime ? 180 : 80
  const ownerHeight = 360
  const businessY = ownerY + 75
  const sdkY = realtime ? 420 : 320
  const avatarY = sdkY
  const motionY = realtime ? 600 : 500
  const backendCenterX = 290
  const clientCenterX = 990
  const businessCenterY = businessY + 42
  const backendAudioX = verticalDataLane(backendCenterX, 'audio')
  const backendMotionX = verticalDataLane(backendCenterX, 'motion')
  const clientAudioX = appVerticalDataLane(clientCenterX, 'audio')
  const clientMotionX = appVerticalDataLane(clientCenterX, 'motion')
  const businessAudioY = horizontalDataLane(businessCenterY, 'audio')
  const businessMotionY = horizontalDataLane(businessCenterY, 'motion')

  return {
    key: `${source}-backend`,
    title: `${realtime ? 'Realtime' : 'Preset'} audio · Backend Mode`,
    showLatency: realtime,
    description: realtime
      ? 'A realtime audio source enters the backend business layer. The Server SDK sends it to Motion Server, while the backend and app business layers deliver response audio and returned motion data to AvatarKit.'
      : 'The backend business layer passes preset avatar speech audio to the Server SDK. The backend and app business layers then deliver response audio and returned motion data to AvatarKit.',
    height: realtime ? 740 : 630,
    nodes: [
      ...(realtime ? [box('audio-provider', 180, 50, 236, 84, 'Realtime audio source')] : []),
      owner('backend', 140, ownerY, 300, ownerHeight, 'Your backend'),
      box('backend-business', 185, businessY, 210, 84, 'Your Business Layer', 'business'),
      box('server-sdk', 185, sdkY, 210, 84, 'Server SDK', 'sdk'),
      box('motion-server', 180, motionY, 236, 84, 'Motion Server', 'service'),
      owner('client', 840, ownerY, 300, ownerHeight, 'Your app'),
      box('client-business', 885, businessY, 210, 84, 'Your Business Layer', 'business'),
      box('sdk', 885, avatarY, 210, 84, 'AvatarKit SDK', 'sdk'),
    ],
    wires: [
      ...(realtime ? [wire('produce', [[backendCenterX, 134], [backendCenterX, businessY]], {
        stage: 1, stageAt: [backendCenterX, 158], target: 'backend-business',
      })] : []),
      wire('wire-audio', [[395, businessAudioY], [885, businessAudioY]], {
        crossing: true, target: 'client-business',
      }),
      wire('wire-motion', [[395, businessMotionY], [885, businessMotionY]], {
        crossing: true, stage: realtime ? 4 : 3, target: 'client-business', dataType: 'motion',
      }),
      wire('cli-audio', [[clientAudioX, businessY + 84], [clientAudioX, avatarY]], {
        target: 'sdk',
      }),
      wire('cli-motion', [[clientMotionX, businessY + 84], [clientMotionX, avatarY]], {
        target: 'sdk', dataType: 'motion',
      }),
      wire('biz-audio', [[backendAudioX, businessY + 84], [backendAudioX, sdkY]], {
        target: 'server-sdk',
      }),
      wire('biz-motion', [[backendMotionX, sdkY], [backendMotionX, businessY + 84]], {
        target: 'backend-business', dataType: 'motion',
      }),
      wire('audio', [[backendAudioX, sdkY + 84], [backendAudioX, motionY]], {
        stage: realtime ? 2 : 1, stageAt: [backendAudioX, realtime ? 570 : 470], target: 'motion-server',
      }),
      wire('motion', [[backendMotionX, motionY], [backendMotionX, sdkY + 84]], {
        stage: realtime ? 3 : 2, stageAt: [backendMotionX, realtime ? 570 : 470], target: 'server-sdk', dataType: 'motion',
      }),
    ],
    journey: realtime
      ? [['produce'], ['biz-audio'], ['audio'], ['motion'], ['biz-motion'], ['wire-motion'], ['cli-motion']]
      : [['biz-audio'], ['audio'], ['motion'], ['biz-motion'], ['wire-motion'], ['cli-motion']],
    branch: { triggerStep: 0, journey: [['wire-audio'], ['cli-audio']] },
  }
}

const rtcFlow = (integration) => {
  const livekit = integration === 'livekit'
  const serverCenterX = 296
  const motionServerRight = serverCenterX + 118
  const clientCenterX = 995
  const roomX = 603
  const roomWidth = 74
  const roomCenterY = 352
  const clientCenterY = 252
  const backendAudioX = verticalDataLane(serverCenterX, 'audio')
  const clientMotionX = appVerticalDataLane(clientCenterX, 'motion')
  const roomAudioY = horizontalDataLane(roomCenterY, 'audio')
  const roomMotionY = horizontalDataLane(roomCenterY, 'motion')
  const clientAudioY = horizontalDataLane(clientCenterY, 'audio')
  const clientMotionY = horizontalDataLane(clientCenterY, 'motion')

  return {
    key: `realtime-${integration}`,
    title: livekit ? 'Realtime audio · LiveKit Agents' : 'Realtime audio · Agora ConvoAI',
    showLatency: true,
    description: livekit
      ? 'The agent worker sends avatar speech audio to Motion Server. Synchronized audio and motion data travel through the LiveKit room to the RTC SDK, which plays the audio and sends motion data to AvatarKit SDK for local rendering.'
      : 'Agora Convo AI or TEN sends avatar speech audio to Motion Server. Synchronized audio and motion data travel through the Agora channel to the RTC SDK, which plays the audio and sends motion data to AvatarKit SDK for local rendering.',
    height: 560,
    nodes: [
      owner('backend', serverCenterX - 160, 70, 320, 180, 'Your backend'),
      box('voice-agents', serverCenterX - 120, 145, 240, 84, livekit ? 'Agent Worker' : 'Agora ConvoAI'),
      box('motion-server', serverCenterX - 118, 310, 236, 84, 'Motion Server', 'service'),
      box('room', roomX, 170, roomWidth, 250, livekit ? 'LiveKit Room' : 'Agora Channel', 'room'),
      owner('client', 840, 110, 310, 370, 'Your app'),
      box('rtc-sdk', 890, 210, 210, 84, 'RTC SDK', 'sdk'),
      box('sdk', 890, 350, 210, 84, 'AvatarKit SDK', 'sdk'),
    ],
    wires: [
      wire('audio', [[backendAudioX, 229], [backendAudioX, 310]], {
        stage: 1, stageAt: [backendAudioX, 280], target: 'motion-server',
      }),
      wire('pub-audio', [[motionServerRight, roomAudioY], [roomX, roomAudioY]], {
        target: 'room',
      }),
      wire('motion', [[motionServerRight, roomMotionY], [roomX, roomMotionY]], {
        stage: 2, target: 'room', dataType: 'motion',
      }),
      wire('wire-audio', [[roomX + roomWidth, clientAudioY], [890, clientAudioY]], {
        crossing: true, target: 'rtc-sdk',
      }),
      wire('wire-motion', [[roomX + roomWidth, clientMotionY], [890, clientMotionY]], {
        crossing: true, stage: 3, target: 'rtc-sdk', dataType: 'motion',
      }),
      wire('sdk-motion', [[clientMotionX, 294], [clientMotionX, 350]], {
        target: 'sdk', dataType: 'motion',
      }),
    ],
    journey: [['audio'], ['pub-audio', 'motion'], ['wire-audio', 'wire-motion'], ['sdk-motion']],
  }
}

const getFlow = (source, integration) => {
  if (integration === 'livekit' || integration === 'agora') return rtcFlow(integration)
  if (integration === 'backend') return backendFlow(source)
  return directFlow(source)
}

const pathData = points => points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ')

const wireLength = points => points.slice(1).reduce((total, point, index) => {
  const previous = points[index]
  return total + Math.hypot(point[0] - previous[0], point[1] - previous[1])
}, 0)

const wireDuration = (item) => {
  const base = Math.max(520, Math.min(1900, wireLength(item.points) * 2.6))
  return base / (item.crossing ? 0.5 : 2)
}

const legDuration = (flow, ids) => Math.max(
  ...ids
    .map(id => flow.wires.find(item => item.id === id))
    .filter(Boolean)
    .map(wireDuration),
  0,
)

const packetVisualState = (item, elapsed) => {
  const fade = 100
  const duration = wireDuration(item)
  const progress = elapsed <= fade ? 0 : Math.max(0, Math.min(1, (elapsed - fade) / duration))
  const scale = elapsed <= 0
    ? 0
    : elapsed < fade
      ? elapsed / fade
      : elapsed > fade + duration
        ? Math.max(0, 1 - ((elapsed - fade - duration) / fade))
        : 1

  return { progress, scale }
}

const pointOnWire = (points, progress) => {
  const lengths = points.slice(1).map((point, index) => {
    const previous = points[index]
    return Math.hypot(point[0] - previous[0], point[1] - previous[1])
  })
  const total = lengths.reduce((sum, length) => sum + length, 0)
  let remaining = total * Math.max(0, Math.min(1, progress))

  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index]
    if (remaining <= length || index === lengths.length - 1) {
      const start = points[index]
      const end = points[index + 1]
      const ratio = length ? Math.min(1, remaining / length) : 0
      return {
        x: start[0] + (end[0] - start[0]) * ratio,
        y: start[1] + (end[1] - start[1]) * ratio,
      }
    }
    remaining -= length
  }

  return { x: points[0][0], y: points[0][1] }
}

const renderNode = (item, lit) => {
  const lines = Array.isArray(item.label) ? item.label : [item.label]
  const centerX = item.x + item.width / 2
  const centerY = item.y + item.height / 2
  const vertical = item.kind === 'room'
  const radius = item.kind === 'owner' || vertical ? 18 : 12

  // Keep conditional class names as explicit tokens. Mintlify's production
  // compiler can trim whitespace embedded in conditional template fragments.
  return (
    <g
      className={[
        'spatius-tour-node',
        `is-${item.kind}`,
        lit ? 'is-lit' : null,
      ].filter(Boolean).join(' ')}
      data-node={item.id}
    >
      <rect x={item.x} y={item.y} width={item.width} height={item.height} rx={radius} />
      {item.kind === 'owner'
        ? item.label && <text x={item.x + 22} y={item.y + 35} className="spatius-tour-owner-label">{item.label}</text>
        : (
            <text
              x={centerX}
              y={centerY - ((lines.length - 1) * 10)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="spatius-tour-node-label"
              transform={vertical ? `rotate(-90 ${centerX} ${centerY})` : undefined}
            >
              {lines.map((text, index) => (
                <tspan key={text} x={centerX} dy={index ? 23 : 0}>{text}</tspan>
              ))}
            </text>
          )}
    </g>
  )
}

const renderDiagram = (flow, packet, branchPacket) => {
  const footerHeight = 58
  const diagramHeight = flow.height + footerHeight
  const runners = [
    { id: 'main', packet, journey: flow.journey },
    ...(branchPacket && flow.branch ? [{ id: 'client-audio', packet: branchPacket, journey: flow.branch.journey }] : []),
  ]
  const activeByRunner = runners.map(runner => {
    const ids = runner.journey[runner.packet.step] ?? []
    return {
      ...runner,
      ids,
      wires: ids
        .map(id => flow.wires.find(item => item.id === id))
        .filter(Boolean)
        .map(item => ({ ...item, packetState: packetVisualState(item, runner.packet.elapsed) })),
    }
  })
  const activeIds = new Set(activeByRunner.flatMap(runner => runner.ids))
  const litTargets = new Set(activeByRunner.flatMap(runner => (
    runner.wires
      .filter(item => item.packetState.progress > 0.72)
      .map(item => item.target)
      .filter(Boolean)
  )))

  return (
    <svg className="spatius-tour-stage" viewBox={`0 0 1280 ${diagramHeight}`} role="img" aria-label={`${flow.title}. ${flow.description}`}>
      <desc>{flow.description}</desc>
      <defs>
        <filter id="spatius-tour-packet-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="spatius-tour-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" className="spatius-tour-arrow" />
        </marker>
      </defs>

      <rect width="1280" height={diagramHeight} className="spatius-tour-stage-surface" />
      <rect x="592" width="96" height={flow.height} className="spatius-tour-network" />
      <line x1="592" y1="0" x2="592" y2={flow.height} className="spatius-tour-network-edge" />
      <line x1="688" y1="0" x2="688" y2={flow.height} className="spatius-tour-network-edge" />
      <text x="296" y="36" textAnchor="middle" className="spatius-tour-zone-label">Server side</text>
      <text x="984" y="36" textAnchor="middle" className="spatius-tour-zone-label">Client side</text>
      <text x="640" y="25" textAnchor="middle" className="spatius-tour-network-label">Network</text>
      <g className="spatius-tour-network-icon" transform="translate(640 47)">
        <circle r="10" />
        <path d="M-10 0H10M0-10C-4-6-4 6 0 10M0-10C4-6 4 6 0 10" />
      </g>

      {flow.nodes.filter(item => item.kind === 'owner').map(item => (
        <g key={item.id}>{renderNode(item, litTargets.has(item.id))}</g>
      ))}

      {flow.wires.map(item => (
        <g key={item.id} data-wire={item.id}>
          <path
            d={pathData(item.points)}
            className={[
              'spatius-tour-wire',
              `is-${item.dataType}`,
              item.crossing ? 'is-crossing' : null,
              activeIds.has(item.id) ? 'is-active' : null,
            ].filter(Boolean).join(' ')}
            markerEnd="url(#spatius-tour-flow-arrow)"
          />
          {flow.showLatency && item.stage && (() => {
            const at = item.stageAt
              ? { x: item.stageAt[0], y: item.stageAt[1] }
              : pointOnWire(item.points, 0.5)
            return (
              <g
                className={[
                  'spatius-tour-stage-number',
                  item.crossing ? 'is-variable' : 'is-low',
                ].join(' ')}
                transform={`translate(${at.x} ${at.y})`}
              >
                <circle r="12" />
                <text textAnchor="middle" dominantBaseline="central">{item.stage}</text>
              </g>
            )
          })()}
        </g>
      ))}

      {flow.nodes.filter(item => item.kind !== 'owner').map(item => (
        <g key={item.id}>{renderNode(item, litTargets.has(item.id))}</g>
      ))}

      <g className="spatius-tour-packets" aria-hidden="true">
        {activeByRunner.flatMap(runner => runner.wires.map(item => {
          const at = pointOnWire(item.points, item.packetState.progress)
          return (
            <g
              key={`${runner.id}-${item.id}-${runner.packet.step}`}
              className={['spatius-tour-packet', `is-${item.dataType}`].join(' ')}
              transform={`translate(${at.x} ${at.y})`}
            >
              <g transform={`scale(${Math.max(0.01, item.packetState.scale)})`}>
                <circle r="18" className="spatius-tour-packet-glow" />
                <circle r="10" className="spatius-tour-packet-halo" />
                <circle r="4.5" className="spatius-tour-packet-core" />
              </g>
            </g>
          )
        }))}
      </g>

      <line x1="0" y1={flow.height} x2="1280" y2={flow.height} className="spatius-tour-footer-edge" />
      <g className="spatius-tour-inline-legend" aria-label="Diagram legend: Audio orbs are blue, Motion Data orbs are yellow, solid lines indicate low latency, and dashed lines indicate variable latency">
        <g className="spatius-tour-legend-orb is-audio" transform={`translate(58 ${flow.height + 29})`}>
          <circle r="10" className="spatius-tour-legend-orb-halo" />
          <circle r="5" className="spatius-tour-legend-orb-core" />
        </g>
        <text x="78" y={flow.height + 35} className="spatius-tour-legend-label">Audio</text>
        <g className="spatius-tour-legend-orb is-motion" transform={`translate(208 ${flow.height + 29})`}>
          <circle r="10" className="spatius-tour-legend-orb-halo" />
          <circle r="5" className="spatius-tour-legend-orb-core" />
        </g>
        <text x="228" y={flow.height + 35} className="spatius-tour-legend-label">Motion Data</text>
        <line x1="386" y1={flow.height + 29} x2="430" y2={flow.height + 29} className="spatius-tour-wire" markerEnd="url(#spatius-tour-flow-arrow)" />
        <text x="446" y={flow.height + 35} className="spatius-tour-legend-label">Low latency</text>
        <line x1="590" y1={flow.height + 29} x2="634" y2={flow.height + 29} className="spatius-tour-wire is-crossing" markerEnd="url(#spatius-tour-flow-arrow)" />
        <text x="650" y={flow.height + 35} className="spatius-tour-legend-label">Variable latency</text>
      </g>
    </svg>
  )
}

  const [source, setSource] = useState('realtime')
  const [integration, setIntegration] = useState('direct')
  const [packet, setPacket] = useState({ step: 0, elapsed: 0 })
  const [branchPacket, setBranchPacket] = useState(null)
  const flow = getFlow(source, integration)
  const stageCount = Math.max(...flow.wires.map(item => item.stage ?? 0))
  const latencyStages = flow.showLatency ? Array.from({ length: stageCount }, (_, index) => {
    const stage = index + 1
    const variable = flow.wires.some(item => item.stage === stage && item.crossing)
    return { stage, type: variable ? 'variable' : 'low' }
  }) : []

  const selectSource = (nextSource) => {
    setSource(nextSource)
    if (nextSource === 'preset' && (integration === 'livekit' || integration === 'agora')) setIntegration('direct')
  }

  const selectIntegration = (nextIntegration) => {
    setIntegration(nextIntegration)
    if (nextIntegration === 'livekit' || nextIntegration === 'agora') setSource('realtime')
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPacket({ step: 0, elapsed: 0 })
      setBranchPacket(null)
      return undefined
    }

    let frame
    let step = 0
    let startedAt = performance.now() + 420
    let branchStep = -1
    let branchStartedAt = 0
    setBranchPacket(null)

    const stateAt = (journey, currentStep, origin, now) => {
      const ids = journey[currentStep] ?? []
      const duration = legDuration(flow, ids)
      const elapsed = now - origin
      return { elapsed, complete: elapsed >= 100 + duration + 100 }
    }

    const tick = (now) => {
      const main = stateAt(flow.journey, step, startedAt, now)
      setPacket({ step, elapsed: main.elapsed })

      if (branchStep >= 0 && flow.branch) {
        const branch = stateAt(flow.branch.journey, branchStep, branchStartedAt, now)
        setBranchPacket({ step: branchStep, elapsed: branch.elapsed })
        if (branch.complete) {
          branchStep += 1
          if (branchStep >= flow.branch.journey.length) {
            branchStep = -1
            setBranchPacket(null)
          }
          else branchStartedAt = now
        }
      }

      if (main.complete) {
        if (flow.branch?.triggerStep === step) {
          branchStep = 0
          branchStartedAt = now
        }
        step = (step + 1) % flow.journey.length
        startedAt = now + (step === 0 ? 700 : 0)
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [flow.key])

  return (
    <section className="spatius-diagram spatius-flow-explorer not-prose" data-integration={integration} aria-label="Explore Spatius integration data flows">
      <div className="spatius-flow-controls">
        <div className="spatius-flow-source-row">
          <div className="spatius-flow-segmented" role="group" aria-label="Avatar speech audio source">
            {SOURCES.map(option => (
              <button key={option.id} type="button" aria-pressed={source === option.id} data-selected={source === option.id ? 'true' : 'false'} onClick={() => selectSource(option.id)}>
                {option.label}
              </button>
            ))}
          </div>
          {flow.showLatency && (
            <div
              className="spatius-flow-latency"
              aria-label={`Latency stages: ${latencyStages.map(item => `${item.stage} ${item.type === 'low' ? 'low' : 'variable'} latency`).join(', ')}`}
            >
              <span className="spatius-flow-latency-title" aria-hidden="true">Latency =</span>
              {latencyStages.map((item, index) => (
                <span key={item.stage} className="spatius-flow-latency-term" aria-hidden="true">
                  <span className={['spatius-flow-latency-stage', `is-${item.type}`].join(' ')}>{item.stage}</span>
                  {index < latencyStages.length - 1 && <span className="spatius-flow-latency-plus">+</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="spatius-flow-segmented spatius-flow-mode-options" role="group" aria-label="Mode">
          {INTEGRATIONS.map(option => {
            const unavailableForPreset = source === 'preset' && (option.id === 'livekit' || option.id === 'agora')
            return (
              <button
                key={option.id}
                type="button"
                aria-label={`${option.label}${option.recommended ? ', recommended' : ''}`}
                aria-pressed={integration === option.id}
                data-selected={integration === option.id ? 'true' : 'false'}
                disabled={unavailableForPreset}
                onClick={() => selectIntegration(option.id)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="spatius-flow-status" aria-live="polite" aria-atomic="true">{flow.title}</p>
      <div className="spatius-flow-seo-copy">
        <p>LiveKit Agents Integration: synchronized audio and motion data pass through the LiveKit room to the RTC SDK; the RTC SDK plays audio and sends motion data to AvatarKit SDK.</p>
        <p>Agora Convo AI Integration: synchronized audio and motion data pass through the Agora channel to the RTC SDK; the RTC SDK plays audio and sends motion data to AvatarKit SDK.</p>
        <p>Direct Mode Integration: AvatarKit sends client-side avatar speech audio to Motion Server and receives motion data.</p>
        <p>Backend Mode Integration: the backend business layer uses the Server SDK with Motion Server, then passes audio and motion data to the app business layer and AvatarKit.</p>
      </div>

      <div className="spatius-flow-diagram-shell">
        <div className="spatius-flow-diagram">
          {renderDiagram(flow, packet, branchPacket)}
        </div>
      </div>
    </section>
  )
}
