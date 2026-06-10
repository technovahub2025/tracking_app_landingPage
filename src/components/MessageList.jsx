
import React, { forwardRef } from 'react'
import { sanitize } from '../utils/sanitize.js'
import { fmtTime } from '../utils/chatUtils.js'
import PricingCards from './PricingCards.jsx'
import CourseCards from './CourseCards.jsx'
import logo from '../assets/images/technovalogo.png'

const MessageList = forwardRef(function MessageList({
  messages, streaming, loading, hlText, sendRef, resetInact, showLead, leadDone,
  leadFormNode, showContact, contactNode,
}, ref) {
  const renderMsg = (msg, i) => {
    const isU = msg.role === 'user'
    return (
      <div key={i} className={`tvh-msg${isU ? ' u' : ''}`}>
        <div className={`tvh-mav ${isU ? 'usr' : 'bot'}`}>
          {isU ? '👤' : <img src={logo} alt="TechnovaHub" className="tvh-mav-logo" />}
        </div>
        <div className="tvh-mb">
          <div className={`tvh-bub ${isU ? 'usr' : 'bot'}`} dangerouslySetInnerHTML={{ __html: sanitize(hlText(msg.content)) }} />
          {msg.showPricing && !isU && <PricingCards onContact={() => sendRef.current('I want a Nexion demo')} />}
          {msg.showCourses && !isU && <CourseCards onSelect={c => sendRef.current(`Tell me about the ${c} course`)} />}
          {msg.chips && !isU && (
            <div className="tvh-chips">
              {msg.chips.map((c, j) => (
                <button key={j} className="tvh-chip" onClick={() => { resetInact(); sendRef.current(c) }}>{c}</button>
              ))}
            </div>
          )}
          <span className="tvh-ts">{fmtTime(msg.time)}</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="tvh-msgs">
      {messages.length === 0 && !loading && !streaming && (
        <div className="tvh-empty">
          <div className="tvh-empty-icon"><img src={logo} alt="TechnovaHub" className="tvh-empty-logo" /></div>
          <div className="tvh-empty-text">Ask me anything about NFC profiles, sharing, or updates</div>
          <div className="tvh-empty-chips">
            {['Submit data', 'How does NFC sharing work?', 'How do I update my profile?'].map((q, i) => (
              <button key={i} className="tvh-chip" onClick={() => sendRef.current(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {messages.map((m, i) => renderMsg(m, i))}

      {streaming && (
        <div className="tvh-msg">
          <div className="tvh-mav bot"><img src={logo} alt="TechnovaHub" className="tvh-mav-logo" /></div>
          <div className="tvh-mb">
            <div className="tvh-bub bot tvh-cur" dangerouslySetInnerHTML={{ __html: sanitize(hlText(streaming)) }} />
          </div>
        </div>
      )}

      {loading && !streaming && (
        <div className="tvh-msg">
          <div className="tvh-mav bot"><img src={logo} alt="TechnovaHub" className="tvh-mav-logo" /></div>
          <div className="tvh-mb">
            <div className="tvh-bub bot">
              <div className="tvh-skel">
                <div className="tvh-skel-line" />
                <div className="tvh-skel-line" />
                <div className="tvh-skel-line" />
              </div>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div className="tvh-msg">
          <div className="tvh-mav bot"><img src={logo} alt="TechnovaHub" className="tvh-mav-logo" /></div>
          <div className="tvh-mb" style={{ maxWidth: '92%' }}>
            {contactNode}
          </div>
        </div>
      )}

      {showLead && !leadDone && (
        <div className="tvh-msg">
          <div className="tvh-mav bot"><img src={logo} alt="TechnovaHub" className="tvh-mav-logo" /></div>
          <div className="tvh-mb" style={{ maxWidth: '92%' }}>
            {leadFormNode}
          </div>
        </div>
      )}
    </div>
  )
})

export default MessageList
