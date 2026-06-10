// ─── WEB AUDIO SOUND EFFECTS ──────────────────────────────────────────────
// Isolated into its own module so components stay clean.

const beep = (f1, f2, v, d, t = 'sine') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = /** @type {OscillatorType} */ (t)
    o.frequency.setValueAtTime(f1, ctx.currentTime)
    o.frequency.linearRampToValueAtTime(f2, ctx.currentTime + d / 1000)
    g.gain.setValueAtTime(v, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d / 1000)
    o.start(); o.stop(ctx.currentTime + d / 1000)
    setTimeout(() => ctx.close(), d + 200)
  } catch { /* audio not available */ }
}

export const sfx = {
  send:  () => beep(880, 1200, 0.010, 90),
  recv:  () => beep(520, 700,  0.007, 130),
  key:   () => beep(1400, 1400, 0.0014, 30, 'square'),
  reset: () => {
    beep(400, 650, 0.012, 110)
    setTimeout(() => beep(650, 900, 0.010, 110), 130)
  },
}
