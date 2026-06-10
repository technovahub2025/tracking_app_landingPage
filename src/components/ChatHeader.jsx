import React, { useState } from 'react'
import {
  Phone,
  Search,
  Download,
  Volume2,
  VolumeX,
  Trash2,
  Home,
  MoreVertical,
  Moon,
  SunMedium,
  Laptop,
} from 'lucide-react'
import logo from '../assets/images/technovalogo.png'
export default function ChatHeader({
  onSearchToggle, onExport, tts, hasTts, onTtsToggle, themeMode, onCycleTheme,
  onClear, isDragged, onResetPos, onClose, onHdDown, onHdTouch, onContact,
}) {
  const [overflowOpen, setOverflowOpen] = useState(false)
  const themeGlyph = themeMode === 'dark'
    ? <Moon size={15} strokeWidth={2.2} />
    : themeMode === 'light'
      ? <SunMedium size={15} strokeWidth={2.2} />
      : <Laptop size={15} strokeWidth={2.2} />

  return (
    <div className="tvh-hd" onMouseDown={onHdDown} onTouchStart={onHdTouch}>
      <div>
        <img src={logo} alt="TechnovaHub logo" style={{ width: '40px', height: 'auto' }} />
      </div>
      <div className="tvh-hd-info">
        <div className="tvh-hd-name">TrackPulse Employee Tracking Assistant</div>
        <div className="tvh-hd-sub">Tracking &bull; Maps &bull; Supervisor Monitoring</div>
        <div className="tvh-hd-stat">Online &middot; Ready to help</div>
      </div>
      <div className="tvh-hbtns">
        <button className="tvh-hbtn" data-nd="1" onClick={onCycleTheme} title="Toggle theme" aria-label="Toggle theme">{themeGlyph}</button>

        <div className="tvh-hbtns-secondary">
          <button className="tvh-hbtn" data-nd="1" onClick={onContact} title="Contact Team" aria-label="Contact Team"><Phone size={16} strokeWidth={2.1} /></button>
          <button className="tvh-hbtn" data-nd="1" onClick={onSearchToggle} title="Search" aria-label="Search messages"><Search size={16} strokeWidth={2.1} /></button>
          <button className="tvh-hbtn" data-nd="1" onClick={onExport} title="Export chat" aria-label="Export chat"><Download size={16} strokeWidth={2.1} /></button>
          {hasTts && (
            <button className={`tvh-hbtn${tts ? ' on' : ''}`} data-nd="1" onClick={onTtsToggle} title="Voice output" aria-label="Toggle voice output">{tts ? <Volume2 size={16} strokeWidth={2.1} /> : <VolumeX size={16} strokeWidth={2.1} />}</button>
          )}
          <button className="tvh-hbtn" data-nd="1" onClick={onClear} title="Clear chat" aria-label="Clear chat"><Trash2 size={16} strokeWidth={2.1} /></button>
          {isDragged && (
            <button className="tvh-hbtn" data-nd="1" onClick={onResetPos} title="Reset position" aria-label="Reset position"><Home size={16} strokeWidth={2.1} /></button>
          )}
        </div>

        <button
          className="tvh-hbtn tvh-overflow-btn"
          data-nd="1"
          onClick={() => setOverflowOpen(v => !v)}
          title="More options"
          aria-label="More options"
          aria-expanded={overflowOpen}
        ><MoreVertical size={16} strokeWidth={2.1} /></button>

        {overflowOpen && (
          <div className="tvh-overflow-menu">
            <button onClick={() => { onContact(); setOverflowOpen(false) }} aria-label="Contact Team"><Phone size={14} strokeWidth={2.1} /> Contact</button>
            <button onClick={() => { onSearchToggle(); setOverflowOpen(false) }} aria-label="Search messages"><Search size={14} strokeWidth={2.1} /> Search</button>
            <button onClick={() => { onExport(); setOverflowOpen(false) }} aria-label="Export chat"><Download size={14} strokeWidth={2.1} /> Export</button>
            {hasTts && (
              <button onClick={() => { onTtsToggle(); setOverflowOpen(false) }} aria-label="Toggle voice output">{tts ? <Volume2 size={14} strokeWidth={2.1} /> : <VolumeX size={14} strokeWidth={2.1} />} {tts ? 'Voice Off' : 'Voice On'}</button>
            )}
            <button onClick={() => { onClear(); setOverflowOpen(false) }} aria-label="Clear chat"><Trash2 size={14} strokeWidth={2.1} /> Clear</button>
            {isDragged && (
              <button onClick={() => { onResetPos(); setOverflowOpen(false) }} aria-label="Reset position"><Home size={14} strokeWidth={2.1} /> Reset</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
