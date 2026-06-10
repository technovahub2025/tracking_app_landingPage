import React from 'react'
import { COURSES } from '../data/company.js'

export default function CourseCards({ onSelect }) {
  return (
    <div className="tvh-cgrid">
      {COURSES.map((c, i) => (
        <button key={i} className="tvh-cc" onClick={() => onSelect(c.name)} aria-label={`Learn about ${c.name}`}>
          <div className="tvh-cc-icon"><i className={c.icon} style={{ color: c.color }} /></div>
          <div className="tvh-cc-name">{c.name}</div>
          <div className="tvh-cc-dur">{c.dur}</div>
        </button>
      ))}
    </div>
  )
}
