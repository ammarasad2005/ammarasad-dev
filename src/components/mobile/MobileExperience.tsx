'use client'

import NextImage from 'next/image'
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { BatteryCharging, Bot, ChevronDown, ChevronUp, CirclePower, Cpu, ShieldCheck, Smartphone, Volume2, Wifi } from 'lucide-react'
import { MobilePortfolio } from '../MobilePortfolio'
import { AndroidShell } from './AndroidShell'
import { IOSShell } from './IOSShell'
import type { MobileOS } from './MobileAppContent'

type MobileStage = 'bootloader' | 'loading' | 'lock' | 'home' | 'safe'
type MobileBootChoice = MobileOS | 'safe'

type MobileExperienceProps = { reducedMotion: boolean }

const bootOptions: { id: MobileBootChoice; label: string; detail: string }[] = [
  { id: 'android', label: 'START ANDROID', detail: 'Material You · app drawer · notification shade' },
  { id: 'ios', label: 'START iOS', detail: 'Home Screen · Dock · Spotlight · Control Center' },
  { id: 'safe', label: 'RECOVERY / STATIC PORTFOLIO', detail: 'Accessible content renderer · no mobile shell' },
]

export function MobileExperience({ reducedMotion }: MobileExperienceProps) {
  const [stage, setStage] = useState<MobileStage>('bootloader')
  const [selected, setSelected] = useState(0)
  const [os, setOS] = useState<MobileOS>('android')
  const [now, setNow] = useState(new Date())
  const touchStart = useRef<number | null>(null)

  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  useEffect(() => {
    if (stage !== 'loading') return
    const timer = window.setTimeout(() => setStage('lock'), reducedMotion ? 450 : 1450)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, stage])
  useEffect(() => {
    if (stage !== 'bootloader') return
    function hardwareKeys(event: KeyboardEvent) {
      if (['ArrowUp', 'AudioVolumeUp'].includes(event.key)) { event.preventDefault(); setSelected((value) => (value - 1 + bootOptions.length) % bootOptions.length) }
      if (['ArrowDown', 'AudioVolumeDown'].includes(event.key)) { event.preventDefault(); setSelected((value) => (value + 1) % bootOptions.length) }
      if (event.key === 'Enter') boot(bootOptions[selected].id)
    }
    window.addEventListener('keydown', hardwareKeys)
    return () => window.removeEventListener('keydown', hardwareKeys)
  }, [selected, stage])

  function boot(choice: MobileBootChoice) {
    if (choice === 'safe') { setStage('safe'); return }
    setOS(choice)
    setStage('loading')
  }
  function restart() { setStage('bootloader'); setSelected(0) }
  function unlock() { setStage('home') }

  if (stage === 'safe') return <MobilePortfolio safeMode />
  if (stage === 'bootloader') return <MobileBootloader selected={selected} setSelected={setSelected} onBoot={() => boot(bootOptions[selected].id)} />
  if (stage === 'loading') return <MobileLoading os={os} reducedMotion={reducedMotion} />
  if (stage === 'lock') return <MobileLockScreen os={os} now={now} onUnlock={unlock} onRestart={restart} touchStartRef={touchStart} />
  return os === 'android' ? <AndroidShell onRestart={restart} /> : <IOSShell onRestart={restart} />
}

function MobileBootloader({ selected, setSelected, onBoot }: { selected: number; setSelected: (index: number) => void; onBoot: () => void }) {
  return <main className="mobile-bootloader" tabIndex={0} aria-label="Ammar mobile bootloader">
    <div className="mobile-boot-scanlines" />
    <header><div><Cpu /><span><strong>AMMAR MOBILE BOOT MANAGER</strong><small>MBM 1.4.2 · aarch64</small></span></div><span>DEVICE STATE: <b>UNLOCKED</b></span></header>
    <section className="mobile-device-info"><div className="mobile-boot-symbol"><Smartphone /><i /></div><dl><div><dt>PRODUCT</dt><dd>AmmarPhone Developer Edition</dd></div><div><dt>BOOT SLOT</dt><dd>portfolio_a · verified</dd></div><div><dt>BATTERY</dt><dd>92% · mental resilience nominal</dd></div><div><dt>SERIAL</dt><dd>AMMAR-FAST-2027</dd></div></dl></section>
    <section className="mobile-boot-options"><span>BOOT TARGET</span>{bootOptions.map((option, index) => <button className={selected === index ? 'selected' : ''} key={option.id} onClick={() => setSelected(index)}><i>{index === 0 ? <Bot /> : index === 1 ? <Smartphone /> : <ShieldCheck />}</i><span><strong>{option.label}</strong><small>{option.detail}</small></span>{selected === index && <b>›</b>}</button>)}</section>
    <footer><div><Volume2 /><span>VOLUME UP / DOWN<small>move highlight</small></span></div><div><CirclePower /><span>POWER BUTTON<small>confirm selection</small></span></div></footer>
    <div className="mobile-hardware-buttons" aria-label="Simulated hardware buttons"><button onClick={() => setSelected((selected - 1 + bootOptions.length) % bootOptions.length)} aria-label="Volume up"><ChevronUp /></button><button onClick={() => setSelected((selected + 1) % bootOptions.length)} aria-label="Volume down"><ChevronDown /></button><button onClick={onBoot} aria-label="Power button select"><CirclePower /></button></div>
    <button className="mobile-boot-start" onClick={onBoot}>POWER TO SELECT</button>
  </main>
}

function MobileLoading({ os, reducedMotion }: { os: MobileOS; reducedMotion: boolean }) {
  return <main className={`mobile-os-loading mobile-os-loading-${os}`}><NextImage className="mobile-os-loading-bg" src={os === 'android' ? '/mobile/android-wallpaper.webp' : '/mobile/ios-wallpaper.webp'} fill priority sizes="100vw" alt="" /><div className="mobile-loading-mark">{os === 'android' ? <Bot /> : <span><NextImage src="/ammar-avatar.png" width={120} height={120} alt="Ammar account" /></span>}</div><strong>{os === 'android' ? 'AmmarOS Android' : 'AmmarOS iOS'}</strong><small>{os === 'android' ? 'Optimizing the developer workspace…' : 'Preparing your Home Screen…'}</small><div className={`mobile-loading-progress ${reducedMotion ? 'still' : ''}`}><i /></div></main>
}

type LockProps = { os: MobileOS; now: Date; onUnlock: () => void; onRestart: () => void; touchStartRef: MutableRefObject<number | null> }
function MobileLockScreen({ os, now, onUnlock, onRestart, touchStartRef }: LockProps) {
  return <main className={`mobile-lock-screen mobile-lock-${os}`} onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientY }} onTouchEnd={(event) => { if (touchStartRef.current !== null && touchStartRef.current - event.changedTouches[0].clientY > 45) onUnlock(); touchStartRef.current = null }}><NextImage className="mobile-os-wallpaper" src={os === 'android' ? '/mobile/android-wallpaper.webp' : '/mobile/ios-wallpaper.webp'} fill priority sizes="100vw" alt="" />{os === 'ios' && <div className="ios-lock-island"><i /></div>}<header className="mobile-lock-status"><span>{os === 'android' ? 'AmmarPhone' : 'AmmarOS'}</span><div><Wifi /><BatteryCharging /><small>92</small></div></header><section className="mobile-lock-time"><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></section><section className="mobile-lock-notification"><span><NextImage src="/ammar-avatar.png" width={64} height={64} alt="Ammar account" /></span><div><strong>Portfolio ready</strong><p>Welcome to Muhammad Ammar Asad’s mobile workspace.</p></div><small>now</small></section><button className="mobile-unlock-action" onClick={onUnlock}>{os === 'android' ? <><i className="mobile-fingerprint" />Touch to unlock</> : <>⌃<span>swipe up to open</span></>}</button><button className="mobile-lock-restart" onClick={onRestart}><CirclePower /> Boot options</button></main>
}
