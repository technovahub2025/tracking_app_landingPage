import React from 'react'
import { NEXION_PLANS } from '../data/company.js'

export default function PricingCards({ onContact }) {
  return (
    <div className="tvh-pricing">
      {NEXION_PLANS.map((p, i) => (
        <button key={i} className={`tvh-pc${p.hot ? ' hot' : ''}`} onClick={onContact} aria-label={`${p.name} plan — ${p.cta}`}>
          {p.hot && <div className="tvh-pbadge">&#11088; Most Popular</div>}
          <div className="tvh-pname">{p.name}</div>
          <div className="tvh-pamt">
            {p.price !== 'Custom' ? '\u20B9' : ''}{p.price}
            <span>{p.unit}</span>
          </div>
          <div className="tvh-pfeats">
            {p.feats.map((f, j) => (
              <div key={j} className="tvh-pfeat">{f}</div>
            ))}
          </div>
          <span className="tvh-pbtn">{p.cta} &#8594;</span>
        </button>
      ))}
    </div>
  )
}
