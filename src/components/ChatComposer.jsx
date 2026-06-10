import React from 'react'
import { Paperclip, Mic, SendHorizontal } from 'lucide-react'
import logo from '../assets/images/technovalogo.png'

export default function ChatComposer({
  lang, onSwitchLang, input, onInputChange, onKeyDown, onSend, onStartVoice, onStopVoice,
  listening, loading, maxLength, hasVoice, onAttach,
}) {
  return (
    <div className="tvh-iarea">
      <div className="tvh-lang-row">
        <button className={`tvh-lbtn${lang === 'en' ? ' on' : ''}`} onClick={() => lang !== 'en' && onSwitchLang('en')} aria-label="Switch to English">
          English
        </button>
        <button className={`tvh-lbtn${lang === 'ta' ? ' on' : ''}`} onClick={() => lang !== 'ta' && onSwitchLang('ta')} aria-label="Switch to Tanglish">
          Tanglish
        </button>
      </div>
      <div className="tvh-irow">
        <textarea
          className="tvh-ta"
          placeholder={lang === 'ta' ? 'Ungal kelviya inga type pannunga...' : 'Ask about employee registration, live tracking, or supervisor monitoring...'}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          rows={1}
          disabled={loading}
          aria-label="Type your message"
        />
        {onAttach && (
          <button className="tvh-attach-btn" onClick={onAttach} title="Attach file" aria-label="Attach file (PNG, JPG, PDF under 5MB)">
            <Paperclip size={16} strokeWidth={2.2} />
          </button>
        )}
        {hasVoice && (
          <button
            className={`tvh-mic${listening ? ' on' : ''}`}
            onClick={listening ? onStopVoice : onStartVoice}
            title={listening ? 'Stop' : 'Voice input'}
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          >
            {listening
              ? <><div className="tvh-wave">{[1,2,3,4,5].map(j => <div key={j} className="tvh-wb" />)}</div><div className="tvh-mic-ring" /><div className="tvh-mic-ring" /><div className="tvh-mic-ring" /></>
              : <Mic size={16} strokeWidth={2.2} />
            }
          </button>
        )}
        <button className="tvh-snd" onClick={onSend} disabled={loading || !input.trim()} aria-label="Send message"><SendHorizontal size={16} strokeWidth={2.2} /></button>
      </div>
      {input.length > 1800 && (
        <div className={`tvh-char-cnt${input.length > 1950 ? ' warn' : ''}`}>{input.length} / {maxLength}</div>
      )}
      <div className="tvh-fbar">
        <a className="tvh-fbar-brand" href="https://technovahub.in" target="_blank" rel="noopener" aria-label="TechnovaHub website">
          <img src={logo} alt="TechnovaHub logo" className="tvh-fbar-logo" />
          <span>TrackPulse Assistant</span>
        </a>
        <span>&middot;</span>
        <span>Powered by Gemini AI</span>
        <span>&middot;</span>
        <span>Employee tracking system</span>
      </div>
    </div>
  )
}
