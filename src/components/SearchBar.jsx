import React from 'react'

export default function SearchBar({ query, onChange, onPrev, onNext, onClose, matchCount, currentIndex }) {
  return (
    <div className="tvh-srch">
      <input
        autoFocus
        placeholder="Search messages..."
        value={query}
        onChange={e => onChange(e.target.value)}
        aria-label="Search messages"
      />
      <span className="tvh-srch-cnt">
        {matchCount > 0 ? `${currentIndex + 1} of ${matchCount}` : '0 found'}
      </span>
      <div className="tvh-srch-nav">
        <button title="Previous" aria-label="Previous match" onClick={onPrev}>&#9650;</button>
        <button title="Next" aria-label="Next match" onClick={onNext}>&#9660;</button>
      </div>
      <button
        style={{ background: 'none', border: 'none', color: 'var(--txt2)', cursor: 'pointer', fontSize: 14 }}
        onClick={onClose}
        title="Close search"
        aria-label="Close search"
      >&#10005;</button>
    </div>
  )
}
