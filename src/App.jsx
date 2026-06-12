import { useState, useEffect, useRef } from 'react'

const frameBg = {
  backgroundColor: '#F6F4ED',
}
const frameBorder = 'border-2 border-[#9C7C3C]/40'

export default function App() {
  // The cinematic intro (gate image -> video) lives in a fixed overlay above the
  // hero. Transitions are crossfades: the gate fades into the video, then the whole
  // overlay fades out to reveal the hero already painted underneath — no flash, no black.
  const [started, setStarted] = useState(false)      // gate tapped -> play video
  const [videoPlaying, setVideoPlaying] = useState(false) // first frame ready -> fade gate out
  const [finished, setFinished] = useState(false)    // video ended -> fade overlay out
  const [removed, setRemoved] = useState(false)       // overlay faded out -> unlock scroll
  const [rsvpVisible, setRsvpVisible] = useState(false)
  const [muted, setMuted] = useState(false)
  const rsvpRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const openGate = () => {
    if (started) return
    // gate tap is a user gesture, so audio is allowed to play with sound
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.6
      const play = audio.play()
      if (play && typeof play.catch === 'function') {
        play.catch(() => {})
      }
    }
    setStarted(true)
  }

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }

  const finishIntro = () => {
    setFinished(true)
  }

  // play the video once the gate is tapped
  useEffect(() => {
    if (!started) return
    const video = videoRef.current
    if (!video) return
    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
  }, [started])

  // after the overlay finishes its fade-out, unmount it and unlock scrolling
  useEffect(() => {
    if (!finished) return
    const t = setTimeout(() => setRemoved(true), 900)
    return () => clearTimeout(t)
  }, [finished])

  // arrow cue: track whether the RSVP section is on screen
  useEffect(() => {
    const el = rsvpRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToRsvp = () => {
    rsvpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className={`haya-root fixed inset-0 overscroll-contain bg-[color:var(--color-cream)] ${
        removed ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <style>{`
        html, body { overflow: hidden; height: 100%; overscroll-behavior: none; }
        .haya-root .text-olive { color: #7E632E !important; }
        .haya-arrow-cue { animation: fade-in 0.5s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* ---- Scrollable content (rendered underneath the intro so the crossfade reveals it) ---- */}
      <div className="mx-auto w-full max-w-[480px]">
        <section id="hero" style={frameBg}>
          <div className="relative w-full h-[100dvh] overflow-hidden">
            <img src="/2.webp" alt="Wedding hero" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </section>

        <section id="details" className="py-6 px-2.5" style={frameBg}>
          <div className={`relative w-full aspect-[1170/2532] overflow-hidden ${frameBorder}`}>
            <div className="absolute inset-0 bg-white/70" />
            <div className="absolute inset-x-0 top-[18%] px-8 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-[#7E632E]/70">Wedding Invitation</p>
              <h1 className="mt-4 text-4xl font-serif text-[#3E2F28]">Haya &amp; Loved One</h1>
              <p className="mx-auto mt-4 max-w-[28rem] text-base leading-7 text-[#5D4A41]">
                Please join us for a joyful celebration of love, family, and new beginnings.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=wedding+venue"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border-[3px] border-[#B1CAA7] bg-white/70 px-6 py-3 text-sm text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
                >
                  Venue details
                </a>
              </div>
            </div>
          </div>
        </section>

        <section ref={rsvpRef} id="rsvp" className="py-6 px-2.5" style={{ ...frameBg, animationDelay: '0.15s' }}>
          <div
            className={`overflow-hidden ${frameBorder}`}
            style={{
              backgroundColor: '#F6F4ED',
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.76))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '520px',
            }}
          >
            <div className="pt-[32%] pb-10 px-5">
              <div className="mx-auto max-w-[420px] rounded-[28px] bg-white/80 p-6 shadow-soft">
                <h2 className="text-2xl font-serif text-[#7E632E]">RSVP</h2>
                <p className="mt-3 text-sm leading-7 text-[#5D4A41]">
                  Let us know if you can join the celebration.
                </p>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl border border-[#E7DACC] bg-[#FBF6F1] p-4">
                    <p className="text-sm text-[#7E632E]">Email</p>
                    <p className="mt-1 text-base font-semibold text-[#3E2F28]">hello@example.com</p>
                  </div>
                  <div className="rounded-3xl border border-[#E7DACC] bg-[#FBF6F1] p-4">
                    <p className="text-sm text-[#7E632E]">Phone</p>
                    <p className="mt-1 text-base font-semibold text-[#3E2F28]">+1 234 567 890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---- Cinematic intro overlay: gate image -> video -> fades out to reveal hero ---- */}
      {!removed ? (
        <div
          className="fixed inset-0 z-40 bg-black"
          style={{
            opacity: finished ? 0 : 1,
            transition: 'opacity 800ms ease-out',
            pointerEvents: finished ? 'none' : 'auto',
          }}
        >
          {/* gate image — fades out as the video's first frame comes in */}
          <button
            type="button"
            onClick={openGate}
            aria-label="Open the invitation"
            className="absolute inset-0 block w-full h-full overflow-hidden cursor-pointer"
            style={{
              opacity: videoPlaying ? 0 : 1,
              transition: 'opacity 600ms ease-out',
              pointerEvents: started ? 'none' : 'auto',
              zIndex: 2,
            }}
          >
            <img src="/1.webp" alt="Wedding invitation gate" className="absolute inset-0 w-full h-full object-cover" />
          </button>

          {/* video — always mounted so it buffers behind the gate; plays on tap, then
              fades in over the gate, and finally the whole overlay fades to the hero */}
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

          {/* skip */}
          {started && !finished ? (
            <button
              type="button"
              onClick={finishIntro}
              className="absolute bottom-4 right-4 z-10 rounded-full border border-white/50 bg-black/30 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/90 transition-colors hover:bg-black/50"
            >
              Skip
            </button>
          ) : null}
        </div>
      ) : null}

      {started ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#9C7C3C]/40 bg-white/80 text-[#75511E] shadow-[0_4px_14px_rgba(124,99,46,0.18)] transition-colors hover:bg-white"
        >
          {muted ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      ) : null}

      {removed && !rsvpVisible ? (
        <button
          type="button"
          onClick={scrollToRsvp}
          aria-label="Scroll to RSVP"
          className="haya-arrow-cue fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-[#75511E]"
        >
          <span className="flex flex-col items-center -space-y-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
      ) : null}
    </div>
  )
}
