import { ReactNode } from "react";
import { FaCircleCheck, FaClipboardList, FaPaperPlane } from "react-icons/fa6";

type NavLink = { label: string; href: string };

export function SiteHeader({ navLinks = [] }: { navLinks?: NavLink[] }) {
  return (
    <header
      className="relative bg-[#001d45] px-8 py-6 text-white md:px-16"
      style={{
        backgroundImage: "url(/img/background.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/get-started" aria-label="Omnira Airlines home">
          <img
            src="/airline-logo.svg"
            alt="Omnira Airlines"
            className="h-auto w-40"
          />
        </a>

        <nav className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wide text-white/80">
          <ManageDropdown />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ManageDropdown() {
  return (
    <div className="relative group">
      <button className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        MANAGE
      </button>
      <div className="absolute left-1/2 top-full z-20 flex -translate-x-1/2 flex-col pt-4 opacity-0 pointer-events-none translate-y-2 transition group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-100">
        <div className="min-w-[360px] rounded-3xl bg-white/95 p-6 text-left text-[#001d45] shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
          <div className="grid gap-6 md:grid-cols-3">
            <ManageLink
              href="/check-in"
              icon={<FaCircleCheck className="h-6 w-6 text-[#0047ab]" aria-hidden="true" />}
              label="Check in"
            />
            <ManageLink
              href="/manage-booking"
              icon={<FaClipboardList className="h-6 w-6 text-[#0047ab]" aria-hidden="true" />}
              label="Manage Booking"
            />
            <ManageLink
              href="/flight-status"
              icon={<FaPaperPlane className="h-6 w-6 text-[#0047ab]" aria-hidden="true" />}
              label="Flight Status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-3 text-center transition hover:text-[#0047ab]"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047ab]">
        {icon}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-[#0047ab]">
        {label}
      </span>
    </a>
  );
}

