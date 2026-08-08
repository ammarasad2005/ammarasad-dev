import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { DesktopPlatform } from '../types'

type Shortcut = {
  id: string
  label: string
  icon: LucideIcon
}

type Point = { x: number; y: number }
type Selection = { start: Point; current: Point }

type DesktopShortcutsProps = {
  shortcuts: readonly Shortcut[]
  onLaunch: (id: string) => void
  platform: DesktopPlatform
}

const ICON_WIDTH = 82
const ICON_HEIGHT = 68

export function DesktopShortcuts({ shortcuts, onLaunch, platform }: DesktopShortcutsProps) {
  const defaultPositions = useMemo(() => Object.fromEntries(shortcuts.map((shortcut, index) => [shortcut.id, platform === 'macos' ? { x: Math.max(17, window.innerWidth - 103 - Math.floor(index / 5) * 92), y: 48 + (index % 5) * 75 } : { x: 17 + Math.floor(index / 5) * 92, y: 25 + (index % 5) * 75 }])), [platform, shortcuts])
  const [positions, setPositions] = useState<Record<string, Point>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`ammaros:${platform}:desktop-icons`) ?? '{}') as Record<string, Point>
      return { ...defaultPositions, ...saved }
    } catch { return defaultPositions }
  })
  const [selected, setSelected] = useState<string[]>([])
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    localStorage.setItem(`ammaros:${platform}:desktop-icons`, JSON.stringify(positions))
  }, [platform, positions])

  useEffect(() => {
    function resetLayout() {
      setPositions(defaultPositions)
      setSelected([])
    }
    window.addEventListener('ammaros:reset-icons', resetLayout)
    return () => window.removeEventListener('ammaros:reset-icons', resetLayout)
  }, [defaultPositions])

  useEffect(() => {
    if (!selection) return
    const selectionStart = selection.start
    function move(event: PointerEvent) {
      const next = { x: event.clientX, y: event.clientY }
      setSelection((current) => current ? { ...current, current: next } : null)
      const left = Math.min(selectionStart.x, next.x)
      const right = Math.max(selectionStart.x, next.x)
      const top = Math.min(selectionStart.y, next.y)
      const bottom = Math.max(selectionStart.y, next.y)
      setSelected(shortcuts.filter((shortcut) => {
        const point = positions[shortcut.id] ?? defaultPositions[shortcut.id]
        return point.x < right && point.x + ICON_WIDTH > left && point.y < bottom && point.y + ICON_HEIGHT > top
      }).map((shortcut) => shortcut.id))
    }
    function up() { setSelection(null) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [defaultPositions, positions, selection, shortcuts])

  function moveIcons(id: string, offset: Point) {
    const moving = selected.includes(id) ? selected : [id]
    setPositions((current) => {
      const next = { ...current }
      moving.forEach((shortcutId) => {
        const point = current[shortcutId] ?? defaultPositions[shortcutId]
        next[shortcutId] = {
          x: Math.max(0, Math.min(window.innerWidth - ICON_WIDTH, point.x + offset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 118, point.y + offset.y)),
        }
      })
      return next
    })
  }

  return <div className={`desktop-canvas desktop-canvas-${platform}`} aria-label="Desktop shortcuts" onPointerDown={(event) => {
    if (event.button !== 0 || event.target !== event.currentTarget) return
    if (!event.ctrlKey && !event.metaKey) setSelected([])
    setSelection({ start: { x: event.clientX, y: event.clientY }, current: { x: event.clientX, y: event.clientY } })
  }}>
    {shortcuts.map(({ id, label, icon: Icon }) => {
      const point = positions[id] ?? defaultPositions[id]
      return <motion.button
        key={id}
        className={`desktop-shortcut ${selected.includes(id) ? 'selected' : ''}`}
        style={{ left: point.x, top: point.y }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin
        onDragStart={() => { if (!selected.includes(id)) setSelected([id]) }}
        onDragEnd={(_, info) => moveIcons(id, info.offset)}
        onClick={(event) => setSelected((current) => event.ctrlKey || event.metaKey ? current.includes(id) ? current.filter((item) => item !== id) : [...current, id] : [id])}
        onDoubleClick={() => onLaunch(id)}
        onKeyDown={(event) => { if (event.key === 'Enter') onLaunch(id) }}
        aria-pressed={selected.includes(id)}
        title={`${label} — double-click to open`}
      ><span><Icon /></span><small>{label}</small></motion.button>
    })}
    {selection && <div className="desktop-selection-box" style={{ left: Math.min(selection.start.x, selection.current.x), top: Math.min(selection.start.y, selection.current.y), width: Math.abs(selection.current.x - selection.start.x), height: Math.abs(selection.current.y - selection.start.y) }} />}
  </div>
}
