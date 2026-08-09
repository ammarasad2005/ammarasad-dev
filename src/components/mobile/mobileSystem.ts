'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../../data/portfolio'

/**
 * Shared "system services" for the Android and iOS shells.
 *
 * The desktop workspaces express Ammar's personality through the OS chrome —
 * Wi-Fi is the "Builder network", the battery is "mental resilience", and the
 * Focus zone runs a Build / Learn / Debug session. These helpers give the two
 * mobile shells the same vocabulary so the platforms stay consistent while each
 * keeps its own native presentation.
 */

export type SessionIntent = 'Build' | 'Learn' | 'Debug'

export const sessionIntents: SessionIntent[] = ['Build', 'Learn', 'Debug']

export const intentCopy: Record<SessionIntent, { headline: string; detail: string; tone: string }> = {
  Build: { headline: 'Build zone', detail: 'Shipping something useful', tone: '#7cc4ff' },
  Learn: { headline: 'Learn zone', detail: 'Reading the docs properly', tone: '#a78bfa' },
  Debug: { headline: 'Debug zone', detail: 'Chasing the actual root cause', tone: '#fbbf24' },
}

export const builderRhythm = [
  { label: 'Deep build', value: '90 min' },
  { label: 'Learn deliberately', value: '45 min' },
  { label: 'Ship one useful thing', value: 'Today' },
]

export function greetingFor(date: Date) {
  const hour = date.getHours()
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
}

/** A ticking clock shared by the status bars, lock screens and shade headers. */
export function useClock(intervalMs = 20000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}

/** Elapsed minutes for the active focus session, refreshed once a minute. */
export function useFocusSession() {
  const [intent, setIntent] = useState<SessionIntent | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [tick, setTick] = useState(() => Date.now())

  useEffect(() => {
    if (startedAt === null) return
    const timer = window.setInterval(() => setTick(Date.now()), 15000)
    return () => window.clearInterval(timer)
  }, [startedAt])

  // Derived rather than stored, so the counter can never drift out of sync with the session.
  const minutes = startedAt === null ? 0 : Math.max(0, Math.floor((Math.max(tick, startedAt) - startedAt) / 60000))

  const start = useCallback((next: SessionIntent) => { setIntent(next); setStartedAt(Date.now()) }, [])
  const stop = useCallback(() => { setIntent(null); setStartedAt(null) }, [])
  /** The quick-settings tile is a plain on/off switch: any running session stops. */
  const toggle = useCallback((next: SessionIntent = 'Build') => {
    setIntent((current) => {
      if (current !== null) { setStartedAt(null); return null }
      setStartedAt(Date.now())
      return next
    })
  }, [])

  return { intent, minutes, start, stop, toggle }
}

/**
 * "Now building" media session. Both platforms render a real media control
 * surface (Material You media player / iOS Control Center) and both are wired
 * to the same playlist: Ammar's shipped projects.
 */
export type NowPlayingTrack = { id: string; title: string; subtitle: string; artwork: string }

export function useNowPlaying() {
  const tracks = useMemo<NowPlayingTrack[]>(
    () => projects.map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: project.tags.slice(0, 2).join(' · '),
      artwork: project.gradient,
    })),
    [],
  )
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(18)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) { setIndex((i) => (i + 1) % tracks.length); return 0 }
        return value + 1.6
      })
    }, 220)
    return () => window.clearInterval(timer)
  }, [playing, tracks.length])

  const next = useCallback(() => { setIndex((i) => (i + 1) % tracks.length); setProgress(0) }, [tracks.length])
  const previous = useCallback(() => { setIndex((i) => (i - 1 + tracks.length) % tracks.length); setProgress(0) }, [tracks.length])
  const toggle = useCallback(() => setPlaying((value) => !value), [])

  return { track: tracks[index], tracks, index, playing, progress, next, previous, toggle }
}

/**
 * Pointer-driven value for the brightness / volume sliders so the control
 * surfaces behave like the real thing instead of being decorative bars.
 */
export function useSliderValue(initial: number) {
  const [value, setValue] = useState(initial)
  const dragging = useRef(false)

  const readFromEvent = useCallback((element: HTMLElement, clientX: number, clientY: number, vertical: boolean) => {
    const rect = element.getBoundingClientRect()
    const ratio = vertical
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width
    setValue(Math.round(Math.min(1, Math.max(0, ratio)) * 100))
  }, [])

  const bind = useCallback((vertical: boolean) => ({
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      dragging.current = true
      event.currentTarget.setPointerCapture?.(event.pointerId)
      readFromEvent(event.currentTarget, event.clientX, event.clientY, vertical)
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (!dragging.current) return
      readFromEvent(event.currentTarget, event.clientX, event.clientY, vertical)
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      dragging.current = false
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    },
    onPointerCancel: () => { dragging.current = false },
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => event.stopPropagation(),
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => event.stopPropagation(),
  }), [readFromEvent])

  return { value, setValue, bind }
}

/** Screen dimming driven by the brightness sliders — a real, visible result. */
export function screenDim(brightness: number) {
  return Math.max(0, Math.min(0.62, (72 - brightness) / 100))
}
