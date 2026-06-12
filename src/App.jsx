import { useState, useEffect, useRef } from 'react'

const frameBg = {
  backgroundColor: '#F6F4ED',
}
const frameBorder = 'border-2 border-[#9C7C3C]/40'

// Order of the evening — adjust the times to your schedule
const TIMELINE = [
  { time: '18:00', name: 'Cocktail Reception' },
  { time: '18:45', name: 'Chuppah & Kiddushin' },
  { time: '19:30', name: 'Party' },
  { time: '20:15', name: 'Dinner' },
  { time: '21:00', name: 'Dancing' },
  { time: '22:30', name: 'Desserts' },
  { time: '23:30', name: 'After Party' },
]

// Update with the venue's address / coordinates
const VENUE_NAME = 'The Venue'
const VENUE_ADDRESS = '123 Celebration Ave, City'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(VENUE_ADDRESS)

// Add-to-calendar (Google Calendar template) — adjust title & dates to match the event
const EVENT_TITLE = 'Haya & Loved One — Wedding'
const CAL_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent(EVENT_TITLE) +
  '&dates=20260903T180000/20260904T020000' +
  '&location=' + encodeURIComponent(VENUE_ADDRESS) +
  '&details=' + encodeURIComponent("We can't wait to celebrate with you!")

// Where RSVP submissions are sent
const RSVP_EMAIL = 'hello@example.com'

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
  const [form, setForm] = useState({ name: '', guests: '2', phone: '', message: '' })
  const [sent, setSent] = useState(false)
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

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleRsvp = (e) => {
    e.preventDefault()
    const body =
      `Name: ${form.name}\n` +
      `Number of guests: ${form.guests}\n` +
      `Phone: ${form.phone}\n` +
      `Message: ${form.message}`
    window.location.href =
      `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent('Wedding RSVP — ' + form.name)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
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

        {/* 1 — Details: parents, date & time, place + navigate */}
        <section id="details" className="py-6 px-2.5" style={frameBg}>
          <div className={`${frameBorder} bg-white/70 px-7 py-12 text-center`}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#7E632E]/70">Wedding Invitation</p>
            <h1 className="mt-4 text-4xl font-serif text-[#3E2F28]">Haya &amp; Loved One</h1>

            <div className="mt-6 space-y-1 text-sm leading-6 text-[#5D4A41]">
              <p>Daughter of Mr. &amp; Mrs. Cohen</p>
              <p>Son of Mr. &amp; Mrs. Levi</p>
            </div>

            <div className="mx-auto my-8 h-px w-16 bg-[#9C7C3C]/30" />

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7E632E]/70">When</p>
              <p className="text-lg font-serif text-[#3E2F28]">Thursday, September 3, 2026</p>
              <p className="text-base text-[#5D4A41]">Reception from 18:00</p>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7E632E]/70">Where</p>
              <p className="text-lg font-serif text-[#3E2F28]">{VENUE_NAME}</p>
              <p className="text-base text-[#5D4A41]">{VENUE_ADDRESS}</p>
            </div>

            <div className="mt-7 flex justify-center gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Navigate to venue"
                className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#B1CAA7] bg-white/70 text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </a>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Add to calendar"
                className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#B1CAA7] bg-white/70 text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* 2 — Dress code */}
        <section id="dress-code" className="py-6 px-2.5" style={frameBg}>
          <div className={`${frameBorder} bg-white/70 px-7 py-12 text-center`}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7E632E]/70">Dress Code</p>
            <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">Formal Elegant</h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-base leading-7 text-[#5D4A41]">
              We&apos;d love to see you dressed to celebrate. Think cocktail attire in soft,
              earthy tones — and comfortable enough to dance the night away.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              {['#7E632E', '#B1CAA7', '#E7DACC', '#3E2F28'].map((c) => (
                <span
                  key={c}
                  className="h-9 w-9 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3 — Timeline */}
        <section id="timeline" className="py-6 px-2.5" style={frameBg}>
          <div className={`${frameBorder} bg-white/70 px-7 py-12`}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7E632E]/70">Order of the Evening</p>
              <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">Timeline</h2>
            </div>

            <ol className="relative mx-auto mt-9 max-w-[24rem] border-l-2 border-[#9C7C3C]/25 pl-7">
              {TIMELINE.map((item) => (
                <li key={item.name} className="relative mb-7 last:mb-0">
                  <span className="absolute -left-[37px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#B1CAA7] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7E632E]" />
                  </span>
                  <p className="text-sm font-semibold tracking-wide text-[#7E632E]">{item.time}</p>
                  <p className="text-lg font-serif text-[#3E2F28]">{item.name}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4 — RSVP */}
        <section ref={rsvpRef} id="rsvp" className="py-6 px-2.5" style={frameBg}>
          <div className={`${frameBorder} bg-white/70 px-7 py-12 text-center`}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7E632E]/70">Kindly Reply</p>
            <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">RSVP</h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-base leading-7 text-[#5D4A41]">
              Please let us know if you can join the celebration by August 1, 2026.
            </p>

            <form onSubmit={handleRsvp} className="mx-auto mt-7 grid max-w-[420px] gap-4 text-left">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-[#7E632E]">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  required
                  placeholder="Your full name"
                  className="mt-1 w-full rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-[#7E632E]">Number of guests</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.guests}
                  onChange={updateField('guests')}
                  required
                  className="mt-1 w-full rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-[#7E632E]">Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  required
                  placeholder="+1 234 567 890"
                  className="mt-1 w-full rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-[#7E632E]">Message for the couple</span>
                <textarea
                  rows="3"
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder="A few warm words…"
                  className="mt-1 w-full resize-none rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <button
                type="submit"
                className="mt-2 rounded-full border-[3px] border-[#B1CAA7] bg-white/70 px-6 py-3 text-sm uppercase tracking-[0.2em] text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
              >
                Send RSVP
              </button>

              {sent ? (
                <p className="text-center text-sm text-[#7E632E]">
                  Thank you! Your reply is on its way. 💛
                </p>
              ) : null}
            </form>
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
