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

// 'all' opens the case studies popup with the full list and nothing selected
const caseIds = [...portfolio.caseStudies.map((c) => c.id), 'all']

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { openId, open, close } = useCaseHash(caseIds)
  const openPalette = () => setPaletteOpen(true)
  const { mode, toggle } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-4 top-3 z-[100] -translate-y-[200%] focus:translate-y-0 rounded-full bg-ink text-bg px-4 py-2 text-sm font-medium transition-transform"
      >
        Skip to content
      </a>
      <div id="top" />
      <Header onOpenPalette={openPalette} mode={mode} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <CaseStudies openId={openId} onOpen={open} onClose={close} />
        <Stack />
        <Learning />
        <Photography />
        <Contact mode={mode} />
      </main>
      <Footer onOpenPalette={openPalette} />
      <CommandMenu
        mode={mode}
        onToggleTheme={() => toggle()}
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
