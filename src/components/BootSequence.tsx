import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import NextImage from 'next/image'
import type { BootChoice, DesktopPlatform } from '../types'

type BootEntry = {
  id: BootChoice
  label: string
  detail: string
  target: string
  script: string
}

const options: BootEntry[] = [
  {
    id: 'windows',
    label: 'AmmarOS — Windows desktop experience',
    detail: 'Boot the complete portfolio with the Windows-native shell, Explorer, taskbar and desktop applications.',
    target: '/EFI/AMMAROS/WINDOWS/BOOTX64.EFI',
    script: "set root='hd0,gpt2'\nlinux /boot/vmlinuz-ammaros root=UUID=AMMAR-2601 ro quiet splash platform=windows\ninitrd /boot/initramfs-ammaros.img\nboot",
  },
  {
    id: 'macos',
    label: 'AmmarOS — macOS desktop experience',
    detail: 'Boot the complete portfolio with Finder, menu bar, Dock, Launchpad, Spotlight and native macOS chrome.',
    target: '/EFI/AMMAROS/MACOS/BOOTX64.EFI',
    script: "insmod part_gpt\ninsmod chain\nsearch --fs-uuid --set=root AMMAR-MAC-2601\nchainloader /EFI/AMMAROS/MACOS/BOOTX64.EFI\nboot",
  },
  {
    id: 'safe',
    label: 'AmmarOS — safe graphics mode',
    detail: 'Start the accessible static portfolio with animations and accelerated desktop effects disabled.',
    target: '/boot/vmlinuz-ammaros (nomodeset)',
    script: "set root='hd0,gpt2'\nlinux /boot/vmlinuz-ammaros root=UUID=AMMAR-2601 ro nomodeset accessibility=1\ninitrd /boot/initramfs-ammaros.img\nboot",
  },
  {
    id: 'easter',
    label: 'AmmarOS memory diagnostics',
    detail: 'Run the built-in memory, curiosity and builder-resilience diagnostic utility.',
    target: '/EFI/TOOLS/AMMAR-MEMTEST.EFI',
    script: "insmod chain\nsearch --file --set=root /EFI/TOOLS/AMMAR-MEMTEST.EFI\nchainloader /EFI/TOOLS/AMMAR-MEMTEST.EFI\nboot",
  },
]

type BootSequenceProps = {
  onChoose: (choice: BootChoice) => void
  reducedMotion: boolean
}

type GrubMode = 'menu' | 'edit' | 'console'

export function BootSequence({ onChoose, reducedMotion }: BootSequenceProps) {
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(100)
  const [autoBoot, setAutoBoot] = useState(true)
  const [mode, setMode] = useState<GrubMode>('menu')
  const [editBuffer, setEditBuffer] = useState(options[0].script)
  const [consoleInput, setConsoleInput] = useState('')
  const [consoleLines, setConsoleLines] = useState<string[]>(['GNU GRUB command-line interface', 'Type “help” for a list of supported commands. Press Esc to return.', ''])
  const rootRef = useRef<HTMLDivElement>(null)
  const consoleInputRef = useRef<HTMLInputElement>(null)

  const choose = useCallback((index = selected) => {
    onChoose(options[index].id)
  }, [onChoose, selected])

  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  useEffect(() => {
    if (mode === 'console') window.setTimeout(() => consoleInputRef.current?.focus(), 20)
  }, [mode])

  useEffect(() => {
    if (mode !== 'menu' || !autoBoot) return
    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => choose(0), 650)
      return () => window.clearTimeout(reducedTimer)
    }
    const started = performance.now()
    const duration = 2900
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, 100 - ((performance.now() - started) / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        window.clearInterval(timer)
        choose(0)
      }
    }, 40)
    return () => window.clearInterval(timer)
  }, [autoBoot, choose, mode, reducedMotion])

  function pauseAutoBoot() {
    setAutoBoot(false)
    setProgress(100)
  }

  function enterEditMode() {
    pauseAutoBoot()
    setEditBuffer(options[selected].script)
    setMode('edit')
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (mode !== 'menu') return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      pauseAutoBoot()
      setSelected((value) => (value + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      pauseAutoBoot()
      setSelected((value) => (value - 1 + options.length) % options.length)
    } else if (event.key === 'Home') {
      event.preventDefault(); pauseAutoBoot(); setSelected(0)
    } else if (event.key === 'End') {
      event.preventDefault(); pauseAutoBoot(); setSelected(options.length - 1)
    } else if (event.key === 'Enter') {
      event.preventDefault(); choose()
    } else if (event.key.toLowerCase() === 'e') {
      event.preventDefault(); enterEditMode()
    } else if (event.key.toLowerCase() === 'c') {
      event.preventDefault(); pauseAutoBoot(); setMode('console')
    } else if (/^[1-4]$/.test(event.key)) {
      event.preventDefault(); pauseAutoBoot(); setSelected(Number(event.key) - 1)
    }
  }

  function runConsoleCommand(event: FormEvent) {
    event.preventDefault()
    const raw = consoleInput.trim()
    const command = raw.toLowerCase()
    if (!raw) return
    const next = [`grub> ${raw}`]
    if (command === 'help') next.push('boot  clear  exit  help  ls  set  version')
    else if (command === 'ls') next.push('(hd0) (hd0,gpt1) (hd0,gpt2) (memdisk)')
    else if (command.startsWith('ls ')) next.push('EFI/ boot/ portfolio/ resume/ projects/')
    else if (command === 'set') next.push(`root=(hd0,gpt2)  prefix=(hd0,gpt2)/boot/grub  selected=${options[selected].id}`)
    else if (command === 'version') next.push('GNU GRUB 2.12-ammar.1  x86_64-efi')
    else if (command === 'clear') { setConsoleLines([]); setConsoleInput(''); return }
    else if (command === 'exit') { setMode('menu'); setConsoleInput(''); return }
    else if (command === 'boot') { choose(); return }
    else next.push(`error: unknown command '${raw}'.`)
    setConsoleLines((lines) => [...lines, ...next])
    setConsoleInput('')
  }

  const seconds = Math.max(1, Math.ceil((progress / 100) * 3))
  const entry = options[selected]

  return (
    <div className="boot-screen" ref={rootRef} tabIndex={0} onKeyDown={handleKeyDown} aria-label="AmmarOS GNU GRUB bootloader">
      <div className="boot-noise" aria-hidden="true" />
      <div className="boot-firmware" aria-hidden="true"><span>AMMAR UEFI</span><span>Firmware 2.70 · x86_64 · Secure Boot: portfolio mode</span></div>
      <main className="boot-console">
        <div className="boot-brand">GNU GRUB <span>version 2.12-ammar.1</span></div>

        {mode === 'menu' && <div className="boot-frame">
          <p className="boot-instructions">Use the ↑ and ↓ keys to select which entry is highlighted. Press Enter to boot the selected OS.</p>
          <div className="boot-options" role="listbox" aria-label="Boot entries">
            {options.map((option, index) => (
              <button
                key={option.id}
                role="option"
                aria-selected={selected === index}
                className={selected === index ? 'boot-option selected' : 'boot-option'}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span><kbd>{index + 1}</kbd>
              </button>
            ))}
          </div>
          <div className="boot-entry-info"><span>Selected entry</span><strong>{entry.id === 'macos' ? 'Darwin-compatible EFI chainloader' : entry.id === 'windows' ? 'AmmarOS hybrid desktop kernel' : entry.id === 'safe' ? 'Fallback portfolio renderer' : 'UEFI diagnostic image'}</strong><p>{entry.detail}</p><code>{entry.target}</code></div>
          <div className="boot-countdown">
            <span>{autoBoot ? `The highlighted entry will be executed automatically in ${seconds}s.` : 'Automatic boot paused by keyboard input.'}</span>
            <span>{autoBoot ? 'Press any navigation key to stop the countdown.' : 'Press Enter to boot the selected entry.'}</span>
          </div>
          {autoBoot && !reducedMotion && <div className="boot-progress"><i style={{ width: `${progress}%` }} /></div>}
        </div>}

        {mode === 'edit' && <div className="grub-edit-screen">
          <p>Editing “{entry.label}”</p>
          <textarea value={editBuffer} onChange={(event) => setEditBuffer(event.target.value)} autoFocus spellCheck={false} onKeyDown={(event) => {
            if (event.key === 'Escape') { event.preventDefault(); setMode('menu') }
            if (event.key === 'F10' || (event.ctrlKey && event.key.toLowerCase() === 'x')) { event.preventDefault(); choose() }
          }} aria-label="Editable GRUB boot commands" />
          <footer><span>Ctrl-x or F10 boots this entry</span><span>Esc discards edits and returns to the menu</span></footer>
        </div>}

        {mode === 'console' && <div className="grub-command-screen" onClick={() => consoleInputRef.current?.focus()}>
          <div>{consoleLines.map((line, index) => <p key={`${line}-${index}`}>{line || '\u00A0'}</p>)}</div>
          <form onSubmit={runConsoleCommand}><span>grub&gt;</span><input ref={consoleInputRef} value={consoleInput} onChange={(event) => setConsoleInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setMode('menu') } }} autoComplete="off" spellCheck={false} aria-label="GRUB command" /></form>
          <footer>Press Esc to return to the boot menu.</footer>
        </div>}

        <div className="boot-keymap">
          {mode === 'menu' ? <><span><kbd>Enter</kbd> boot</span><span><kbd>e</kbd> edit commands</span><span><kbd>c</kbd> command line</span><span><kbd>↑↓</kbd> navigate</span></> : <span>GNU GRUB minimal BASH-like line editing is supported.</span>}
        </div>
        <p className="boot-footer">Platform: x86_64-efi · Memory: 65536K/65536K available · github.com/ammarasad2005</p>
      </main>
    </div>
  )
}

export function LoadingScreen({ reducedMotion, platform }: { reducedMotion: boolean; platform: DesktopPlatform }) {
  if (platform === 'macos') {
    return (
      <div className="loading-screen apple-boot" role="status" aria-live="polite">
        <svg className="apple-boot-logo" viewBox="0 0 384 512" fill="currentColor" aria-label="Apple logo" role="img">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 270.6q0 39.4 14.9 84.4c11.5 37.4 51.3 114.8 94.6 114.8 22.4 0 40.9-18.1 76.8-18.1s49.7 18.1 76.8 18.1c43.4 0 84.5-96.8 94.6-114.8 11.7-35.2 16.9-73.1 16.9-86.9zM261.1 105c17.5-22.5 29.7-53.7 26.5-85.2-25.4 1.1-55.3 16.9-73.3 39.3-15.8 19.3-28.4 50.9-24.9 80.4 27.1 2.1 54.9-11.3 71.7-34.5z" />
        </svg>
        <div className="apple-boot-bar" aria-hidden="true"><i className={reducedMotion ? 'still' : ''} /></div>
        <p>Starting AmmarOS</p>
        <button className="skip-link visible-skip" onClick={() => window.dispatchEvent(new Event('alexos:skip'))}>Skip intro</button>
      </div>
    )
  }
  return (
    <div className="loading-screen loading-windows" role="status" aria-live="polite">
      <div className="os-mark" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={reducedMotion ? 'loading-dots still' : 'loading-dots'} aria-label="Starting AmmarOS"><i /><i /><i /><i /><i /></div>
      <p>starting Windows workspace</p>
      <button className="skip-link visible-skip" onClick={() => window.dispatchEvent(new Event('alexos:skip'))}>Skip intro</button>
    </div>
  )
}

export function MacSignIn({ reducedMotion, onSignIn }: { reducedMotion: boolean; onSignIn: () => void }) {
  return (
    <div className="loading-screen loading-macos" role="dialog" aria-label="Sign in to AmmarOS">
      <div className="mac-login-account">
        <span className="mac-login-avatar"><NextImage src="/ammar-avatar.png" width={160} height={160} priority alt="Photograph of Muhammad Ammar Asad" /><i /></span>
        <strong>Muhammad Ammar Asad</strong>
        <small>Developer Account · AmmarOS</small>
        <button className="mac-signin-button" onClick={onSignIn}>{reducedMotion ? 'Open account' : 'Sign in'}</button>
      </div>
      <button className="skip-link visible-skip" onClick={onSignIn}>Skip intro</button>
    </div>
  )
}

export function WindowsSignIn({ reducedMotion, onSignIn }: { reducedMotion: boolean; onSignIn: () => void }) {
  return (
    <div className="loading-screen" role="dialog" aria-label="Sign in to AmmarOS">
      <div className="win-login-account">
        <span className="win-login-avatar"><NextImage src="/ammar-avatar.png" width={160} height={160} priority alt="Photograph of Muhammad Ammar Asad" /><i /></span>
        <strong>Muhammad Ammar Asad</strong>
        <small>Developer Account · AmmarOS</small>
        <button className="win-signin-button" onClick={onSignIn}>{reducedMotion ? 'Open account' : 'Sign in'}</button>
      </div>
      <button className="skip-link visible-skip" onClick={onSignIn}>Skip intro</button>
    </div>
  )
}
