import { useCallback, useEffect, useRef, useState } from 'react'
import type { BootChoice } from '../types'

const options: { id: BootChoice; label: string; detail: string }[] = [
  { id: 'portfolio', label: 'Boot AmmarOS', detail: 'Full interactive portfolio' },
  { id: 'safe', label: 'AmmarOS (safe graphics)', detail: 'Fast, static content mode' },
  { id: 'easter', label: 'Run memory diagnostics', detail: 'Definitely a serious utility' },
]

type BootSequenceProps = {
  onChoose: (choice: BootChoice) => void
  reducedMotion: boolean
}

export function BootSequence({ onChoose, reducedMotion }: BootSequenceProps) {
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(100)
  const rootRef = useRef<HTMLDivElement>(null)

  const choose = useCallback((index = selected) => {
    onChoose(options[index].id)
  }, [onChoose, selected])

  useEffect(() => {
    rootRef.current?.focus()
    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => choose(0), 650)
      return () => window.clearTimeout(reducedTimer)
    }
    const started = performance.now()
    const duration = 2800
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, 100 - ((performance.now() - started) / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        window.clearInterval(timer)
        choose(0)
      }
    }, 40)
    return () => window.clearInterval(timer)
  }, [choose, reducedMotion])

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelected((value) => (value + 1) % options.length)
      setProgress(100)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelected((value) => (value - 1 + options.length) % options.length)
      setProgress(100)
    }
    if (event.key === 'Enter') choose()
  }

  return (
    <div className="boot-screen" ref={rootRef} tabIndex={0} onKeyDown={handleKeyDown} aria-label="AmmarOS bootloader menu">
      <div className="boot-noise" aria-hidden="true" />
      <main className="boot-console">
        <div className="boot-brand">GNU GRUB <span>version 2.12-ammar.1</span></div>
        <div className="boot-frame">
          <p>Use the ↑ and ↓ keys to select an entry. Press Enter to boot.</p>
          <div className="boot-options" role="listbox" aria-label="Boot options">
            {options.map((option, index) => (
              <button
                key={option.id}
                role="option"
                aria-selected={selected === index}
                className={selected === index ? 'boot-option selected' : 'boot-option'}
                onMouseEnter={() => setSelected(index)}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                <small>{option.detail}</small>
              </button>
            ))}
          </div>
          <div className="boot-hint">
            <span>Boot sequence runs on every visit</span>
            <span>{reducedMotion ? 'Fast boot enabled' : `Auto-boot in ${Math.max(1, Math.ceil(progress / 34))}s`}</span>
          </div>
          {!reducedMotion && <div className="boot-progress"><i style={{ width: `${progress}%` }} /></div>}
        </div>
        <p className="boot-footer">Minimal BASH-like line editing is supported. github.com/ammarasad2005</p>
      </main>
    </div>
  )
}

export function LoadingScreen({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="os-mark" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={reducedMotion ? 'loading-dots still' : 'loading-dots'} aria-label="Starting AmmarOS"><i /><i /><i /><i /><i /></div>
      <p>starting workspace</p>
      <button className="skip-link visible-skip" onClick={() => window.dispatchEvent(new Event('alexos:skip'))}>Skip intro</button>
    </div>
  )
}
