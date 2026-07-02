export default function SaveTheDate() {
  return (
    <div
      dir="rtl"
      lang="he"
      className="haya-root fixed inset-0 overflow-hidden overscroll-contain bg-[#F6F4ED]"
    >
      <style>{`
        html, body { overflow: hidden; height: 100%; overscroll-behavior: none; }
      `}</style>

      <div className="mx-auto w-full max-w-[480px]">
        <section className="relative w-full h-[100dvh] overflow-hidden">
          <img
            src="/savethedate.png"
            alt="Haya & Aviad — Save the Date"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </section>
      </div>
    </div>
  )
}
