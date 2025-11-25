/* eslint-disable @next/next/no-img-element */

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#001d45] px-8 py-16 text-white md:px-16"
      style={{ backgroundImage: "url(/img/background.svg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/airline-logo.svg" alt="Omnira Airlines" className="h-auto w-56" />
        </div>

        <div className="mt-12 grid w-full gap-8 text-2xl font-semibold md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
          <span className="text-white text-2xl md:text-[48px] leading-tight">
            Book Faster
          </span>

          <div
            className="mx-auto hidden h-[360px] w-[320px] md:block"
            aria-hidden="true"
          >
            {/* reserved space so background window sits centered */}
          </div>

          <span className="text-white text-2xl md:text-[48px] leading-tight md:text-right whitespace-nowrap">
            Travel Smarter
          </span>
        </div>

        <a href="/get-started" className="mt-12 inline-flex items-center gap-2 rounded-full bg-[#0047ab] px-10 py-3 text-lg font-semibold text-white shadow-lg shadow-[#0047ab]/40 transition hover:-translate-y-0.5 hover:bg-[#1d5ed6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="stroke-current">
            <path d="M5 12h14m0 0-5-5m5 5-5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          </a>
        </div>
      </main>
  );
}
