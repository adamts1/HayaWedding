import { useState, useEffect, useRef } from 'react'

const frameBg = {
  backgroundColor: '#F6F4ED',
}
const frameBorder = 'border-2 border-[#9C7C3C]/40'

// ---- Translations (edit names, venue, date & times here) ----
const STRINGS = {
  he: {
    dir: 'rtl',
    invitationEyebrow: 'הזמנה לחתונה',
    couple: 'עדן ואושר',
    parent1: 'בתם של רונית ויוסי כהן',
    parent2: 'בנם של מירי ודוד לוי',
    whenLabel: 'מתי',
    date: 'יום חמישי, 3 בספטמבר 2026',
    reception: 'קבלת פנים החל מהשעה 18:00',
    whereLabel: 'היכן',
    venueName: 'אולם האירועים',
    venueAddress: 'רחוב הפרחים 12, תל אביב',
    navAria: 'ניווט למקום האירוע',
    calAria: 'הוספה ליומן',
    dressEyebrow: 'קוד לבוש',
    dressTitle: 'ערב חגיגי',
    dressText:
      'נשמח לראות אתכם בלבוש חגיגי בגוונים רכים וטבעיים — ונוחים מספיק כדי לרקוד עד הבוקר.',
    timelineEyebrow: 'סדר הערב',
    timelineTitle: 'לוח זמנים',
    timeline: [
      { time: '18:00', name: 'קבלת פנים' },
      { time: '18:45', name: 'חופה וקידושין' },
      { time: '19:30', name: 'מסיבה' },
      { time: '20:15', name: 'ארוחת ערב' },
      { time: '21:00', name: 'ריקודים' },
      { time: '22:30', name: 'קינוחים' },
      { time: '23:30', name: 'אפטר פארטי' },
    ],
    rsvpEyebrow: 'נשמח לראותכם',
    rsvpTitle: 'אישור הגעה',
    rsvpText: 'אנא אשרו את הגעתכם עד ה-1 באוגוסט 2026.',
    nameLabel: 'שם מלא',
    namePlaceholder: 'השם המלא שלך',
    guestsLabel: 'מספר אורחים',
    phoneLabel: 'טלפון',
    phonePlaceholder: '050-0000000',
    messageLabel: 'ברכה לזוג',
    messagePlaceholder: 'כמה מילים חמות…',
    submit: 'שליחת אישור',
    thanks: 'תודה רבה! האישור בדרך אליכם 💛',
    skip: 'דלג',
    muteOn: 'השתקת מוזיקה',
    muteOff: 'הפעלת מוזיקה',
    gateAria: 'פתחו את ההזמנה',
    gateAlt: 'שער ההזמנה',
    scrollAria: 'גלילה לאישור הגעה',
    eventTitle: 'החתונה של עדן ואושר',
    calDetails: 'נשמח לחגוג אתכם!',
    emailSubject: 'אישור הגעה - ',
    emailName: 'שם',
    emailGuests: 'מספר אורחים',
    emailPhone: 'טלפון',
    emailMessage: 'ברכה',
    switchTo: 'EN',
    switchFlag: '🇬🇧',
  },
  en: {
    dir: 'ltr',
    invitationEyebrow: 'Wedding Invitation',
    couple: 'Eden & Osher',
    parent1: 'Daughter of Ronit & Yossi Cohen',
    parent2: 'Son of Miri & David Levi',
    whenLabel: 'When',
    date: 'Thursday, September 3, 2026',
    reception: 'Reception from 18:00',
    whereLabel: 'Where',
    venueName: 'The Venue',
    venueAddress: '12 HaPrahim St, Tel Aviv',
    navAria: 'Navigate to venue',
    calAria: 'Add to calendar',
    dressEyebrow: 'Dress Code',
    dressTitle: 'Formal Elegant',
    dressText:
      "We'd love to see you dressed to celebrate. Think cocktail attire in soft, earthy tones — and comfortable enough to dance the night away.",
    timelineEyebrow: 'Order of the Evening',
    timelineTitle: 'Timeline',
    timeline: [
      { time: '18:00', name: 'Cocktail Reception' },
      { time: '18:45', name: 'Chuppah & Kiddushin' },
      { time: '19:30', name: 'Party' },
      { time: '20:15', name: 'Dinner' },
      { time: '21:00', name: 'Dancing' },
      { time: '22:30', name: 'Desserts' },
      { time: '23:30', name: 'After Party' },
    ],
    rsvpEyebrow: 'Kindly Reply',
    rsvpTitle: 'RSVP',
    rsvpText: 'Please let us know if you can join the celebration by August 1, 2026.',
    nameLabel: 'Full name',
    namePlaceholder: 'Your full name',
    guestsLabel: 'Number of guests',
    phoneLabel: 'Phone',
    phonePlaceholder: '+972 50-000-0000',
    messageLabel: 'Message for the couple',
    messagePlaceholder: 'A few warm words…',
    submit: 'Send RSVP',
    thanks: 'Thank you! Your reply is on its way. 💛',
    skip: 'Skip',
    muteOn: 'Mute music',
    muteOff: 'Unmute music',
    gateAria: 'Open the invitation',
    gateAlt: 'Wedding invitation gate',
    scrollAria: 'Scroll to RSVP',
    eventTitle: 'Eden & Osher — Wedding',
    calDetails: "We can't wait to celebrate with you!",
    emailSubject: 'Wedding RSVP — ',
    emailName: 'Name',
    emailGuests: 'Number of guests',
    emailPhone: 'Phone',
    emailMessage: 'Message',
    switchTo: 'עב',
    switchFlag: '🇮🇱',
  },
}

// Where RSVP submissions are sent
const RSVP_EMAIL = 'hello@example.com'

export default function App() {
  const [lang, setLang] = useState('he')
  const [started, setStarted] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [rsvpVisible, setRsvpVisible] = useState(false)
  const [muted, setMuted] = useState(false)
  const [form, setForm] = useState({ name: '', guests: '2', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const rsvpRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const t = STRINGS[lang]
  const isRtl = t.dir === 'rtl'

  const mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(t.venueAddress)
  const calUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(t.eventTitle) +
    '&dates=20260903T180000/20260904T020000' +
    '&location=' + encodeURIComponent(t.venueAddress) +
    '&details=' + encodeURIComponent(t.calDetails)

  const toggleLang = () => setLang((l) => (l === 'he' ? 'en' : 'he'))

  const openGate = () => {
    if (started) return
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
      `${t.emailName}: ${form.name}\n` +
      `${t.emailGuests}: ${form.guests}\n` +
      `${t.emailPhone}: ${form.phone}\n` +
      `${t.emailMessage}: ${form.message}`
    window.location.href =
      `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent(t.emailSubject + form.name)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div
      dir={t.dir}
      lang={lang}
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

      {/* ---- Scrollable content ---- */}
      <div className="mx-auto w-full max-w-[480px]">
        <section id="hero" style={frameBg}>
          <div className="relative w-full h-[100dvh] overflow-hidden">
            <img src="/hero.webp" alt={t.couple} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </section>

        {/* 1 — Details */}
        <section id="details" className="py-6 px-2.5" style={frameBg}>
          <div className={`${frameBorder} bg-white/70 px-7 py-12 text-center`}>
            <p className="text-sm tracking-[0.15em] text-[#7E632E]/70">{t.invitationEyebrow}</p>
            <h1 className="mt-4 text-4xl font-serif text-[#3E2F28]">{t.couple}</h1>

            <div className="mt-6 space-y-1 text-sm leading-6 text-[#5D4A41]">
              <p>{t.parent1}</p>
              <p>{t.parent2}</p>
            </div>

            <div className="mx-auto my-8 h-px w-16 bg-[#9C7C3C]/30" />

            <div className="space-y-1">
              <p className="text-xs tracking-[0.15em] text-[#7E632E]/70">{t.whenLabel}</p>
              <p className="text-lg font-serif text-[#3E2F28]">{t.date}</p>
              <p className="text-base text-[#5D4A41]">{t.reception}</p>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-xs tracking-[0.15em] text-[#7E632E]/70">{t.whereLabel}</p>
              <p className="text-lg font-serif text-[#3E2F28]">{t.venueName}</p>
              <p className="text-base text-[#5D4A41]">{t.venueAddress}</p>
            </div>

            <div className="mt-7 flex justify-center gap-4">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t.navAria}
                className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#B1CAA7] bg-white/70 text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </a>
              <a
                href={calUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t.calAria}
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
            <p className="text-xs tracking-[0.15em] text-[#7E632E]/70">{t.dressEyebrow}</p>
            <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">{t.dressTitle}</h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-base leading-7 text-[#5D4A41]">{t.dressText}</p>
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
              <p className="text-xs tracking-[0.15em] text-[#7E632E]/70">{t.timelineEyebrow}</p>
              <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">{t.timelineTitle}</h2>
            </div>

            <ol className={`relative mx-auto mt-9 max-w-[24rem] ${isRtl ? 'border-r-2 pr-7' : 'border-l-2 pl-7'} border-[#9C7C3C]/25`}>
              {t.timeline.map((item) => (
                <li key={item.name} className="relative mb-7 last:mb-0">
                  <span className={`absolute ${isRtl ? '-right-[37px]' : '-left-[37px]'} top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#B1CAA7] bg-white`}>
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
            <p className="text-xs tracking-[0.15em] text-[#7E632E]/70">{t.rsvpEyebrow}</p>
            <h2 className="mt-3 text-3xl font-serif text-[#3E2F28]">{t.rsvpTitle}</h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-base leading-7 text-[#5D4A41]">{t.rsvpText}</p>

            <form onSubmit={handleRsvp} className={`mx-auto mt-7 grid max-w-[420px] gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="block">
                <span className="text-xs tracking-[0.1em] text-[#7E632E]">{t.nameLabel}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  required
                  placeholder={t.namePlaceholder}
                  className="mt-1 w-full rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <label className="block">
                <span className="text-xs tracking-[0.1em] text-[#7E632E]">{t.guestsLabel}</span>
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
                <span className="text-xs tracking-[0.1em] text-[#7E632E]">{t.phoneLabel}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  required
                  placeholder={t.phonePlaceholder}
                  className="mt-1 w-full rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <label className="block">
                <span className="text-xs tracking-[0.1em] text-[#7E632E]">{t.messageLabel}</span>
                <textarea
                  rows="3"
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder={t.messagePlaceholder}
                  className="mt-1 w-full resize-none rounded-2xl border border-[#E7DACC] bg-[#FBF6F1] px-4 py-3 text-base text-[#3E2F28] placeholder:text-[#5D4A41]/40 outline-none transition-colors focus:border-[#B1CAA7]"
                />
              </label>

              <button
                type="submit"
                className="mt-2 rounded-full border-[3px] border-[#B1CAA7] bg-white/70 px-6 py-3 text-sm tracking-[0.1em] text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
              >
                {t.submit}
              </button>

              {sent ? (
                <p className="text-center text-sm text-[#7E632E]">{t.thanks}</p>
              ) : null}
            </form>
          </div>
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

      {/* ---- Language toggle (fixed top-right) ---- */}
      <button
        type="button"
        onClick={toggleLang}
        aria-label={lang === 'he' ? 'Switch to English' : 'החלפה לעברית'}
        className="fixed top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-[#9C7C3C]/40 bg-white/85 text-xl shadow-[0_4px_14px_rgba(124,99,46,0.18)] transition-colors hover:bg-white"
      >
        <span className="leading-none" aria-hidden="true">{t.switchFlag}</span>
      </button>

      {started ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? t.muteOff : t.muteOn}
          className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#9C7C3C]/40 bg-white/80 text-[#75511E] shadow-[0_4px_14px_rgba(124,99,46,0.18)] transition-colors hover:bg-white"
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
          aria-label={t.scrollAria}
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
