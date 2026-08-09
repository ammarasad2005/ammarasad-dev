'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Code2 } from 'lucide-react'
import { BootSequence, LoadingScreen } from './components/BootSequence'
import { DesktopShell } from './components/DesktopShell'
import { MobilePortfolio } from './components/MobilePortfolio'
import { MobileExperience } from './components/mobile/MobileExperience'
import type { AppPhase, BootChoice, DesktopPlatform } from './types'

function App() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [phase, setPhase] = useState<AppPhase>('boot')
  const [requestedFile, setRequestedFile] = useState('readme')
  const [platform, setPlatform] = useState<DesktopPlatform>('windows')
  const hasAutoOpened = useRef(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMobile = () => setIsMobile(mobileQuery.matches)
    const updateMotion = () => setReducedMotion(motionQuery.matches)
    mobileQuery.addEventListener('change', updateMobile)
    motionQuery.addEventListener('change', updateMotion)
    return () => {
      mobileQuery.removeEventListener('change', updateMobile)
      motionQuery.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    const timer = window.setTimeout(() => setPhase('desktop'), reducedMotion ? 350 : 1300)
    const skip = () => setPhase('desktop')
    window.addEventListener('alexos:skip', skip)
    return () => { window.clearTimeout(timer); window.removeEventListener('alexos:skip', skip) }
  }, [phase, reducedMotion])

  useEffect(() => {
    if (phase !== 'desktop' || hasAutoOpened.current) return
    const timer = window.setTimeout(() => {
      hasAutoOpened.current = true
      setPhase('ide')
    }, reducedMotion ? 100 : 850)
    return () => window.clearTimeout(timer)
  }, [phase, reducedMotion])

  function handleBootChoice(choice: BootChoice) {
    if (choice === 'safe') setPhase('safe')
    else if (choice === 'easter') setPhase('easter')
    else {
      setPlatform(choice)
      setPhase('loading')
    }
  }

  function openIDE(file = 'readme') {
    setRequestedFile(file)
    setPhase('ide')
  }

  function restart() {
    hasAutoOpened.current = false
    setRequestedFile('readme')
    setPhase('boot')
  }

  if (isMobile) return <MobileExperience reducedMotion={reducedMotion} />

  return (
    <div className="app-root">
      <a className="skip-link" href="#portfolio-content">Skip to portfolio</a>
      <AnimatePresence mode="wait">
        {phase === 'boot' && <motion.div key="boot" className="phase-layer" exit={{ opacity: 0 }}><BootSequence onChoose={handleBootChoice} reducedMotion={reducedMotion} /></motion.div>}
        {phase === 'loading' && <motion.div key="loading" className="phase-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoadingScreen reducedMotion={reducedMotion} platform={platform} /></motion.div>}
        {(phase === 'desktop' || phase === 'ide') && <motion.div id="portfolio-content" key={`desktop-${platform}`} className="phase-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DesktopShell platform={platform} ideOpen={phase === 'ide'} initialFile={requestedFile} onOpen={openIDE} onMinimize={() => setPhase('desktop')} onRestart={restart} reducedMotion={reducedMotion} /></motion.div>}
        {phase === 'safe' && <motion.div id="portfolio-content" key="safe" className="phase-layer safe-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><MobilePortfolio safeMode canLaunchFull onLaunchFull={() => { hasAutoOpened.current = false; setPhase('desktop') }} /></motion.div>}
        {phase === 'easter' && <motion.div key="easter" className="phase-layer diagnostic-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="diagnostic-card"><Code2 /><span>AMMAROS MEMORY DIAGNOSTIC</span><h1>All ideas accounted for.</h1><div className="memory-map">{Array.from({ length: 64 }).map((_, index) => <i key={index} style={{ animationDelay: `${index * 20}ms` }} />)}</div><p>65536K tested · 0 errors · builder mode enabled</p><button onClick={() => setPhase('boot')}><ArrowLeft size={16} /> Return to boot menu</button></div>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default App
