export default function SaveTheDate() {
  return (
    <div
      dir="rtl"
      lang="he"
      className="haya-root fixed inset-0 overflow-y-auto overscroll-contain bg-[#F6F4ED]"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <style>{`
        html, body { overflow: hidden; height: 100%; overscroll-behavior: none; }
      `}</style>

      <div className="mx-auto w-full max-w-[480px]">
        <img
          src="/savethedate.png"
          alt="Haya & Aviad — Save the Date"
          className="block w-full h-auto"
        />
      </div>
    </div>
  )
}
