import { useState, useEffect, useRef } from 'react'
import { DEFAULT_POS, DEFAULT_SIZE } from '../data/constants.js'

/**
 * useDragResize — handles window dragging and corner-resizing.
 * Returns { pos, size, winRef, onHdDown, onHdTouch, onResDown, resetPos, isDragged }
 */
export function useDragResize() {
  const [pos,  setPos]  = useState(DEFAULT_POS)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const winRef  = useRef(null)
  const dragRef = useRef(null)
  const resRef  = useRef(null)

  const isDragged = pos.left !== undefined

  const resetPos = () => {
    setPos(DEFAULT_POS)
    setSize(DEFAULT_SIZE)
  }

  // ─── Drag handlers ───────────────────────────────────────────────────
  const onHdDown = (e) => {
    if (e.target.dataset.nd) return
    const r = winRef.current?.getBoundingClientRect()
    if (!r) return
    dragRef.current = { sx: e.clientX, sy: e.clientY, oL: r.left, oT: r.top }
    e.preventDefault()
  }

  const onHdTouch = (e) => {
    if (e.target.dataset.nd) return
    const t = e.touches[0]
    const r = winRef.current?.getBoundingClientRect()
    if (!r) return
    dragRef.current = { sx: t.clientX, sy: t.clientY, oL: r.left, oT: r.top }
  }

  // ─── Resize handler ──────────────────────────────────────────────────
  const onResDown = (e) => {
    resRef.current = { sx: e.clientX, sy: e.clientY, ow: size.w, oh: size.h }
    e.preventDefault()
    e.stopPropagation()
  }

  // ─── Global mouse / touch listeners ──────────────────────────────────
  useEffect(() => {
    const moveDrag = (cx, cy) => {
      if (!dragRef.current) return
      const dx = cx - dragRef.current.sx
      const dy = cy - dragRef.current.sy
      const nL = Math.max(0, Math.min(window.innerWidth  - size.w, dragRef.current.oL + dx))
      const nT = Math.max(0, Math.min(window.innerHeight - size.h, dragRef.current.oT + dy))
      setPos({ left: nL, top: nT })
    }

    const moveRes = (cx, cy) => {
      if (!resRef.current) return
      setSize({
        w: Math.max(320,  Math.min(window.innerWidth  * .92, resRef.current.ow + cx - resRef.current.sx)),
        h: Math.max(440,  Math.min(window.innerHeight * .92, resRef.current.oh + cy - resRef.current.sy)),
      })
    }

    const onMM = (e) => { moveDrag(e.clientX, e.clientY); moveRes(e.clientX, e.clientY) }
    const onTM = (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)
    const onUp = ()  => { dragRef.current = null; resRef.current = null }

    window.addEventListener('mousemove',  onMM)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchmove',  onTM, { passive: true })
    window.addEventListener('touchend',   onUp)

    return () => {
      window.removeEventListener('mousemove',  onMM)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchmove',  onTM)
      window.removeEventListener('touchend',   onUp)
    }
  }, [size])

  return { pos, size, winRef, onHdDown, onHdTouch, onResDown, resetPos, isDragged }
}
