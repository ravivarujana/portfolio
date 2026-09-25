import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { About } from './components/About'
import { CaseStudies } from './components/CaseStudies'
import { CommandMenu } from './components/CommandMenu'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Learning } from './components/Learning'
import { Photography } from './components/Photography'
import { Stack } from './components/Stack'
import { portfolio } from './data'
import { useCaseHash } from './hooks/useCaseHash'
import { useTheme } from './hooks/useTheme'

const caseIds = portfolio.caseStudies.map((c) => c.id)

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { openId, open, close } = useCaseHash(caseIds)
  const openPalette = () => setPaletteOpen(true)
  const { mode, palette, setMode, setPalette } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-4 top-3 z-[100] -translate-y-[200%] focus:translate-y-0 rounded-[4px] border-2 border-edge bg-accent px-3.5 py-2.5 font-semibold text-accent-ink transition-transform"
      >
        Skip to content
      </a>
      <div id="top" />
      <Header onOpenPalette={openPalette} mode={mode} palette={palette} onMode={setMode} onPalette={setPalette} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <CaseStudies openId={openId} onOpen={open} onClose={close} />
        <Stack />
        <Learning />
        <Photography />
        <Contact />
      </main>
      <Footer onOpenPalette={openPalette} />
      <CommandMenu
        mode={mode}
        onMode={setMode}
        onPalette={setPalette}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onOpenCase={(id) => {
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
          open(id)
        }}
      />
    </MotionConfig>
  )
}
