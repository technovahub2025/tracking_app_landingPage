import { useState, useCallback } from 'react'
import { API_URL } from '../data/constants.js'

const DEFAULT_LEAD_DATA = {
  name: '',
  phone: '',
  email: '',
  bio: '',
  address: '',
  instagram: '',
  googleBusinessProfile: '',
  facebook: '',
  linkedin: '',
  websiteType: '',
  websiteName: '',
  requirement: 'Data submission',
}

export function useLeadFlow({ setMessages }) {
  const [showLead, setShowLead] = useState(false)
  const [leadDone, setLeadDone] = useState(false)
  const [leadData, setLeadData] = useState(DEFAULT_LEAD_DATA)
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadErrors, setLeadErrors] = useState({})

  const openLeadForm = useCallback((presetReq) => {
    if (presetReq) {
      setLeadData(d => ({ ...d, requirement: presetReq }))
    } else {
      setLeadData(d => ({ ...d, requirement: d.requirement || 'Data submission' }))
    }
    setShowLead(true)
  }, [])

  const closeLeadForm = useCallback(() => setShowLead(false), [])

  const validateLead = useCallback(() => {
    const errors = {}
    const name = (leadData.name || '').trim()
    const phone = (leadData.phone || '').replace(/[\s-]/g, '')
    const email = (leadData.email || '').trim()
    const bio = (leadData.bio || '').trim()
    const address = (leadData.address || '').trim()
    const instagram = (leadData.instagram || '').trim()
    const googleBusinessProfile = (leadData.googleBusinessProfile || '').trim()
    const facebook = (leadData.facebook || '').trim()
    const linkedin = (leadData.linkedin || '').trim()
    const websiteType = (leadData.websiteType || '').trim()
    const websiteName = (leadData.websiteName || '').trim()
    const requirement = (leadData.requirement || '').trim()

    if (!name || name.length < 2) errors.name = 'Name must be at least 2 characters.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid Indian mobile number.'
    if (bio.length > 500) errors.bio = 'Bio must not exceed 500 characters.'
    if (address.length > 500) errors.address = 'Address must not exceed 500 characters.'
    if (instagram.length > 200) errors.instagram = 'Instagram must not exceed 200 characters.'
    if (googleBusinessProfile.length > 300) errors.googleBusinessProfile = 'Google Business Profile must not exceed 300 characters.'
    if (facebook.length > 200) errors.facebook = 'Facebook must not exceed 200 characters.'
    if (linkedin.length > 200) errors.linkedin = 'LinkedIn must not exceed 200 characters.'
    if (websiteType && !['personal', 'company'].includes(websiteType)) {
      errors.websiteType = 'Choose either personal or company website.'
    }
    if (websiteName.length > 200) errors.websiteName = 'Website name must not exceed 200 characters.'
    if (requirement.length > 1000) errors.requirement = 'Additional notes must not exceed 1000 characters.'

    return errors
  }, [leadData])

  const submitLead = useCallback(async () => {
    const errors = validateLead()
    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors)
      return
    }

    setLeadLoading(true)
    setLeadErrors({})

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      if (res.status === 201) {
        setLeadDone(true)
        setShowLead(false)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Thanks! Your details have been submitted successfully.\n\nWe will review your profile and get back to you soon.\n\nContact: +91 9629600230\nEmail: technovahubcareer@gmail.com',
          time: new Date().toISOString(),
        }])
      } else if (res.status === 400) {
        const data = await res.json()
        setLeadErrors(data.errors || {})
      } else {
        setLeadErrors({ _network: 'Something went wrong. Please try again.' })
      }
    } catch {
      setLeadErrors({ _network: 'Network error. Please check your connection and try again.' })
    } finally {
      setLeadLoading(false)
    }
  }, [leadData, setMessages, validateLead])

  return {
    showLead,
    leadDone,
    leadData,
    setLeadData,
    leadLoading,
    leadErrors,
    openLeadForm,
    closeLeadForm,
    submitLead,
  }
}
