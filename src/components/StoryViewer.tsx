import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '../types'

interface Props {
  photos: Photo[]
  albumName: string
  startIndex?: number
  onClose: () => void
}

const SLIDE_MS = 5000

export default function StoryViewer({ photos, albumName, startIndex = 0, onClose }: Props) {
  const [current, setCurrent]   = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused]     = useState(false)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef    = useRef(Date.now())
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const goNext = useCallback(() => {
    setCurrent(c => {
      if (c < photos.length - 1) return c + 1
      onClose()
      return c
    })
  }, [photos.length, onClose])

  const goPrev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0)
    startRef.current = Date.now()
  }, [current])

  // Auto-advance timer
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    startRef.current = Date.now() - (progress / 100) * SLIDE_MS
    timerRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - startRef.current) / SLIDE_MS) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(timerRef.current!)
        goNext()
      }
    }, 40)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, current, goNext]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l') goNext()
      else if (e.key === 'ArrowLeft'  || e.key === 'j') goPrev()
      else if (e.key === 'Escape') onClose()
      else if (e.key === ' ') { e.preventDefault(); setPaused(p => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  // Touch swipe
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX
      const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
      // only swipe if horizontal motion dominates (not a scroll attempt)
      if (Math.abs(dx) > 48 && Math.abs(dx) > dy * 1.5) {
        if (dx > 0) goNext()
        else goPrev()
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [goNext, goPrev])

  const photo = photos[current]
  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}>
      {/* Phone-frame container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[360px] h-full max-h-[760px] sm:rounded-3xl overflow-hidden shadow-2xl bg-black"
        onClick={e => e.stopPropagation()}>

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
          {photos.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{ width: i < current ? '100%' : i === current ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between">
          <p className="text-white text-sm font-bold drop-shadow-lg">{albumName}</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPaused(p => !p)}
              className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              {paused ? <Play size={12} fill="white" /> : <Pause size={12} fill="white" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Photo */}
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.caption ?? ''}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Bottom gradient + caption */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        {photo.caption && (
          <div className="absolute bottom-8 left-4 right-4 z-30 text-white text-sm text-center font-medium drop-shadow-lg">
            {photo.caption}
          </div>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-4 z-30 text-white/50 text-xs font-medium">
          {current + 1} / {photos.length}
        </div>

        {/* Click zones */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-14 bottom-0 w-[35%] z-20"
          aria-label="Previous"
        />
        <button
          onClick={goNext}
          className="absolute right-0 top-14 bottom-0 w-[35%] z-20"
          aria-label="Next"
        />

        {/* Arrow hints */}
        {current > 0 && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <ChevronLeft size={30} className="text-white/40 drop-shadow-lg" />
          </div>
        )}
        {current < photos.length - 1 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <ChevronRight size={30} className="text-white/40 drop-shadow-lg" />
          </div>
        )}

        {/* Pause indicator */}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Pause size={22} className="text-white" fill="white" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
