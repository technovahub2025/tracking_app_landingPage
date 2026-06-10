import React from 'react'

export default function TNCScreen({ onAccept, onDecline }) {
  return (
    <div className="tvh-tnc">
      <div className="tvh-tnc-logo">âš¡</div>
      <h3>Before we chat</h3>
      <p>
        This TrackPulse Employee Tracking Assistant uses AI to answer your questions about employee registration,
        live location tracking, supervisor monitoring, Google Maps links, video updates, and account management.
        By continuing, you agree to our{' '}
        <a href="https://technovahub.in/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
        Your conversations may be used to improve the service.
      </p>
      <div className="tvh-tnc-btns">
        <button className="tvh-tnc-yes" onClick={onAccept}>Accept &amp; Chat -&gt;</button>
        <button className="tvh-tnc-no" onClick={onDecline}>Decline</button>
      </div>
    </div>
  )
}
