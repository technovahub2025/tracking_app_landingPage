import React from 'react'
import { PhoneCall, Mail, MessageCircle, CalendarDays } from 'lucide-react'
import { CONTACT } from '../data/company.js'

export default function ContactPanel({ onSchedule, onClose }) {
  return (
    <div className="tvh-contact-panel">
      <h4>Share or Submit Data</h4>
      <a href={`tel:${CONTACT.phone1}`} className="tvh-contact-action" aria-label="Call TechnovaHub">
        <PhoneCall size={16} strokeWidth={2.1} /> Call: {CONTACT.phone1}
      </a>
      <a href={`mailto:${CONTACT.email}`} className="tvh-contact-action" aria-label="Email TechnovaHub">
        <Mail size={16} strokeWidth={2.1} /> Email: {CONTACT.email}
      </a>
      <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="tvh-contact-action" aria-label="WhatsApp TechnovaHub">
        <MessageCircle size={16} strokeWidth={2.1} /> WhatsApp Us
      </a>
      <button className="tvh-contact-action" onClick={onSchedule} aria-label="Submit data">
        <CalendarDays size={16} strokeWidth={2.1} /> Submit Data
      </button>
      <button className="tvh-contact-close" onClick={onClose} aria-label="Close contact panel">Close</button>
    </div>
  )
}
