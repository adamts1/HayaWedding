import { useState, useEffect, useRef } from 'react'

const frameBg = {
  backgroundColor: '#F6F4ED',
}

// ---- Text (edit names here) ----
const t = {
  dir: 'rtl',
  couple: 'עדן ואושר',
  skip: 'דלג',
  gateAria: 'פתחו את ההזמנה',
  gateAlt: 'שער ההזמנה',
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [removed, setRemoved] = useState(false)
  const videoRef = useRef(null)

  const openGate = () => {
    if (started) return
    setStarted(true)
  }

  const finishIntro = () => {
    setFinished(true)
  }

  useEffect(() => {
    if (!started) return
    const video = videoRef.current
    if (!video) return
    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
  }, [started])

  useEffect(() => {
    if (!finished) return
    const t2 = setTimeout(() => setRemoved(true), 900)
    return () => clearTimeout(t2)
  }, [finished])

  return (
    <div
      dir={t.dir}
      lang="he"
      className="haya-root fixed inset-0 overflow-y-auto overscroll-contain bg-[color:var(--color-cream)]"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <style>{`
        html, body { overflow: hidden; height: 100%; overscroll-behavior: none; }
      `}</style>

      {/* ---- Hero ---- */}
      <div className="mx-auto w-full max-w-[480px]">
        <section id="hero" style={frameBg}>
          <img src="/hero.webp" alt={t.couple} className="block w-full h-auto" />
        </section>
      </div>

      {/* ---- Cinematic intro overlay ---- */}
      {!removed ? (
        <div
          className="fixed inset-0 z-40 bg-black"
          style={{
            opacity: finished ? 0 : 1,
            transition: 'opacity 800ms ease-out',
            pointerEvents: finished ? 'none' : 'auto',
          }}
        >
          <button
            type="button"
            onClick={openGate}
            aria-label={t.gateAria}
            className="absolute inset-0 block w-full h-full overflow-hidden cursor-pointer"
            style={{
              opacity: videoPlaying ? 0 : 1,
              transition: 'opacity 600ms ease-out',
              pointerEvents: started ? 'none' : 'auto',
              zIndex: 2,
            }}
          >
            <img src="/1.webp" alt={t.gateAlt} className="absolute inset-0 w-full h-full object-cover" />
          </button>

          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: videoPlaying ? 1 : 0, transition: 'opacity 600ms ease-out', zIndex: 1 }}
            playsInline
            muted
            preload="auto"
            onPlaying={() => setVideoPlaying(true)}
            onEnded={finishIntro}
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>

          {started && !finished ? (
            <button
              type="button"
              onClick={finishIntro}
              className="absolute bottom-4 left-4 z-10 rounded-full border border-white/50 bg-black/30 px-4 py-1.5 text-xs tracking-[0.1em] text-white/90 transition-colors hover:bg-black/50"
            >
              {t.skip}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
