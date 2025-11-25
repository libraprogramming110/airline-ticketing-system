/* eslint-disable @next/next/no-img-element */

import FlightHero from "@/components/flight-hero";
import Footer from "@/components/footer";
import {
  FaCircleCheck,
  FaClipboardList,
  FaPaperPlane,
} from "react-icons/fa6";
import { chooseIcon } from "@/lib/icons";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Sign In", href: "/sign-in" },
];

const manageOptions = [
  {
    label: "Check in",
    icon: FaCircleCheck,
  },
  {
    label: "Manage Booking",
    icon: FaClipboardList,
  },
  {
    label: "Flight Status",
    icon: FaPaperPlane,
  },
];

const offers = [
  {
    label: "40% OFF",
    title: "Winter Sale",
    description: "Get up to 40% off on selected international flights",
    validity: "Valid until Dec 15, 2025",
    accent: "#66B2FF",
  },
  {
    label: "35% OFF",
    title: "Early Bird Special",
    description: "Book 60 days in advance and save big",
    validity: "Valid until Dec 10, 2025",
    accent: "#FFE008",
  },
  {
    label: "25% OFF",
    title: "Weekend Getaway",
    description: "Special weekend rates for domestic flights",
    validity: "Valid until Nov 30, 2025",
    accent: "#00C951",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <section
        className="relative min-h-dvh bg-[#001d45] px-8 py-8 text-white md:px-16"
        style={{
          backgroundImage: "url(/img/background.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-12">
          <header className="flex items-center justify-between">
            <a href="/get-started" aria-label="Omnira Airlines home">
              <img
                src="/airline-logo.svg"
                alt="Omnira Airlines"
                className="h-auto w-40"
              />
            </a>
            <nav className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wide text-white/80">
              <div className="relative group">
                <button className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  MANAGE
                </button>
                <div className="absolute left-1/2 top-full z-20 flex -translate-x-1/2 flex-col pt-4 opacity-0 pointer-events-none translate-y-2 transition group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-100">
                  <div className="min-w-[360px] rounded-3xl bg-white/95 p-6 text-left text-[#001d45] shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
                    <div className="grid gap-6 md:grid-cols-3">
                    {manageOptions.map(({ label, icon: Icon }) => (
                      <a
                        key={label}
                        href="#"
                        className="flex flex-col items-center gap-3 text-center transition hover:text-[#0047ab]"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047ab]">
                          <Icon
                            className="h-6 w-6 text-[#0047ab]"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#0047ab]">
                          {label}
                        </span>
                      </a>
                    ))}
                    </div>
                  </div>
                </div>
              </div>
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <div className="flex flex-1 flex-col justify-center">
            <FlightHero />
          </div>
        </div>
      </section>
      <OffersSection />
      <WhyChooseSection />
      <Footer />
    </>
  );
}

function OffersSection() {
  return (
    <section className="bg-white px-8 py-16 text-[#001d45] md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Special Offers</h2>
          <p className="mt-2 text-sm text-[#6c7aa5]">
            Don&apos;t miss out on our exclusive deals and limited-time
            promotions
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className="rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
            >
              <div
                className="h-2 rounded-t-3xl"
                style={{ backgroundColor: offer.accent }}
              />
              <div className="space-y-5 p-6">
                <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#001d45]">
                  {offer.label}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{offer.title}</h3>
                  <p className="text-sm text-[#4a5b82]">{offer.description}</p>
                  <p className="text-xs text-[#8a96b7]">{offer.validity}</p>
                </div>
                <button className="w-full rounded-full bg-[#0047ab] py-3 text-sm font-semibold text-white transition hover:bg-[#1d5ed6]">
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const whyChoose = [
  {
    title: "Safe & Secure",
    description: "Your safety is our priority with enhanced security measures",
    icon: "shield",
  },
  {
    title: "Convenience and Confidence",
    description:
      "Omnira offers an end-to-end digital experience designed for speed and reliability",
    icon: "check",
  },
  {
    title: "Control and Efficiency",
    description:
      "Omnira equips staff with centralized tools to manage operations efficiently and securely",
    icon: "thumb",
  },
  {
    title: "Best Price Guarantee",
    description: "We guarantee the most competitive prices on all flights",
    icon: "tag",
  },
];

function WhyChooseSection() {
  return (
    <section className="bg-[#f7f9fc] px-8 py-16 text-[#001d45] md:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold">Why Choose Omnira</h2>
        <p className="mt-2 text-sm text-[#6c7aa5]">
          Experience smooth service and unmatched comfort on every journey
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {whyChoose.map(({ title, description, icon }) => (
            <article key={title} className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047AB]">
                {chooseIcon(icon)}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-[#4a5b82]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


