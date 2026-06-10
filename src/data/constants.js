// ─── STORAGE KEYS ─────────────────────────────────────────────────────────
export const SK = {
  CHAT:  'tvh_chat_v3',
  LANG:  'tvh_lang',
  THEME: 'tvh_theme',
  TTS:   'tvh_tts',
  LEADS: 'tvh_leads',
  NAME:  'tvh_user_name',
  CTX:   'tvh_user_ctx',
  TNC:   'tvh_tnc',
}

// ─── LAYOUT DEFAULTS ──────────────────────────────────────────────────────
export const DEFAULT_POS  = { bottom: 108, right: 24 }
export const DEFAULT_SIZE = { w: 380, h: 595 }

// ─── API CONFIG ───────────────────────────────────────────────────────────
// All Gemini requests go through the Express backend proxy — no API key in the browser.
const viteApiUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_API_URL
  : undefined

export const API_URL = viteApiUrl || 'https://trackpulsebackend.onrender.com/api'
