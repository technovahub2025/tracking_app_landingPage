import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import logo from '../asset/technovalogo.png'
import { TVH_STATS, TVH_CLIENTS, TVH_PARTNERS, CONTACT } from '../data/company.js'

// ─── LAYERED STAR FIELD (3 depth layers) ────────────────────────────────────
function Stars() {
  const layers = useMemo(() => [
    { count: 40, maxSize: 1.2, opRange: [0.1, 0.4], speed: [5, 8] },
    { count: 30, maxSize: 2.0, opRange: [0.2, 0.6], speed: [3, 6] },
    { count: 20, maxSize: 2.8, opRange: [0.3, 0.9], speed: [2, 4] },
  ], [])

  const stars = useMemo(() => layers.flatMap((l, li) =>
    Array.from({ length: l.count }, (_, i) => ({
      id: `${li}-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      w: Math.random() * l.maxSize + 0.5,
      delay: Math.random() * 6,
      dur: l.speed[0] + Math.random() * (l.speed[1] - l.speed[0]),
      opacity: l.opRange[0] + Math.random() * (l.opRange[1] - l.opRange[0]),
    }))
  ), [layers])

  return (
    <div className="tvh-stars">
      {stars.map(s => (
        <div key={s.id} className="tvh-star" style={{
          top: s.top, left: s.left,
          width: s.w, height: s.w,
          opacity: s.opacity,
          animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

// ─── COUNT-UP NUMBER ────────────────────────────────────────────────────────
function CountUp({ target }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const num = parseInt(target.replace(/[^0-9]/g, ''), 10) || 0
  const suffix = target.replace(/[0-9,]/g, '')

  useEffect(() => {
    const el = ref.current
    if (!el || !num) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const duration = 1200
      const start = performance.now()
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setVal(Math.floor(eased * num))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [num])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ─── SCROLLING TICKER ────────────────────────────────────────────────────────
function Ticker() {
  const items = [
    ...TVH_CLIENTS.map(n => ({ name: n, hi: false })),
    ...TVH_PARTNERS.map(n => ({ name: n, hi: true })),
  ]
  const doubled = [...items, ...items]
  return (
    <div className="tvh-band">
      <div className="tvh-band-inner">
        {doubled.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="tvh-band-sep">&middot;</span>}
            <span className={`tvh-band-item${it.hi ? ' hi' : ''}`}>{it.name}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── BACKGROUND PAGE ────────────────────────────────────────────────────────
export default function Background({ onOpenChat }) {
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' })
  const rafRef = useRef(null)

  const handleMouse = useCallback((e) => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setGlowPos({ x: e.clientX, y: e.clientY })
      rafRef.current = null
    })
  }, [])

  return (
    <div className="tvh-page" onMouseMove={handleMouse}>
      <Stars />
      <div className="tvh-glow" style={{ left: glowPos.x, top: glowPos.y }} />
      <div className="tvh-page-body">

        {/* Brand */}
        <div className="tvh-brand">
          <div><img
  src={logo}
  alt="TechnovaHub logo"
  style={{
    width: "120px",
    height: "120px",
    objectFit: "contain",
    background: "white",
    borderRadius: "8px",
    padding: "4px"
  }}
/>
      </div>
        <div className="tvh-brand-name">TrackPulse<b>Assist</b></div>
        </div>

        <div className="tvh-tagline">TRACK. MONITOR. MAP. REPORT INSTANTLY.</div>

        {/* Hero */}
        <div className="tvh-hero">Your Employee Tracking Hub,<br /><b>Always Ready to Monitor</b></div>
        <div className="tvh-hero-sub">
          Track employee locations, monitor field activity, and open Google Maps links in seconds.
          Keep supervisors updated with live status and video changes.
        </div>

        {/* Primary CTAs */}
        <div className="tvh-ctas">
          <button className="tvh-cta-primary" onClick={onOpenChat}>
            Open the Assistant
          </button>
          <a className="tvh-cta-secondary" href="https://technovahub.in" target="_blank" rel="noopener">
            Learn More
          </a>
          <a className="tvh-cta-secondary" href="https://technovahub.in/courses" target="_blank" rel="noopener">
            See Tracking Features
          </a>
        </div>

        {/* Contact bar */}
        <div className="tvh-contact-bar">
          <a href={`tel:${CONTACT.phone1}`} className="tvh-contact-link">{CONTACT.phone1}</a>
          <a href={CONTACT.whatsapp}        className="tvh-contact-link" target="_blank" rel="noopener">WhatsApp</a>
          <a href={`mailto:${CONTACT.email}`} className="tvh-contact-link">Email</a>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`} className="tvh-contact-link" target="_blank" rel="noopener">Puducherry</a>
        </div>

        {/* Stats with count-up */}
        <div className="tvh-stats">
  {TVH_STATS.map((s, i) => {
    return (
      <div key={i} className="tvh-stat">

         <div className="tvh-stat-i">
          <i className={s.icon} style={{ color: s.color, fontSize: 30 }} />
        </div>

        <div className="tvh-stat-n">
          <CountUp target={s.n} />
        </div>

        <div className="tvh-stat-l">{s.l}</div>
      </div>
    );
  })}
</div>
      </div>

      <Ticker />
    </div>
  )
}
