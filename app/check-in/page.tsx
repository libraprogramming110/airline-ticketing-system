"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { FaPlane, FaCheck } from "react-icons/fa6";

export default function CheckInPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f7f9fc] px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-7xl">
          <BackNavigation />
          <div className="grid gap-8 md:grid-cols-2">
            <CheckInInfoCard />
            <CheckInFormCard />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function BackNavigation() {
  return (
    <header className="mb-12">
      <a
        href="/get-started"
        aria-label="Back to home"
        className="inline-flex items-center gap-3 transition hover:opacity-80"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#0047ab]"
        >
          <path
            d="M19 12H5M5 12l6-6m-6 6l6 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-[#0047ab]">
          Back to Home
        </span>
      </a>
    </header>
  );
}

function CheckInInfoCard() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
      <h2 className="mb-6 text-2xl font-semibold">
        Fly easy and check in ahead of your flight!
      </h2>

        <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0047ab] text-white">
              <FaCheck className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-[#4a5b82]">
              Online check-in is available from:
            </p>
          </div>

          <div className="ml-8 space-y-3">
            <div className="flex items-start gap-3">
              <FaPlane className="mt-1 h-4 w-4 shrink-0 text-[#0047ab]" />
              <div>
                <span className="text-sm font-semibold text-[#001d45]">
                  Domestic:
                </span>
                <span className="ml-2 text-sm text-[#4a5b82]">
                  48 hours up to 1 hour before flight
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaPlane className="mt-1 h-4 w-4 shrink-0 text-[#0047ab]" />
              <div>
                <span className="text-sm font-semibold text-[#001d45]">
                  International:
                </span>
                <span className="ml-2 text-sm text-[#4a5b82]">
                  48 hours up to 2 hours before flight
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0047ab] text-white">
            <FaCheck className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm text-[#4a5b82]">
            You can make changes or buy add-ons for your flight after checking
            in.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckInFormCard() {
  const [bookingRef, setBookingRef] = useState("");
  const [lastNameOrEmail, setLastNameOrEmail] = useState("");
  const isFormValid = bookingRef.trim() !== "" && lastNameOrEmail.trim() !== "";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
      <h2 className="mb-2 text-2xl font-semibold">Check-in</h2>
      <p className="mb-8 text-sm text-[#6c7aa5]">
        Type in your details to check in for your flight
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="booking-ref"
            className="mb-2 block text-sm font-semibold text-[#001d45]"
          >
            Booking Reference Number
          </label>
          <div className="relative">
            <input
              id="booking-ref"
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g 1AB234C or 0123456789"
              className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0047ab] transition hover:text-[#1d5ed6]"
              aria-label="Help"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="lastname-email"
            className="mb-2 block text-sm font-semibold text-[#001d45]"
          >
            Last name or email address
          </label>
          <input
            id="lastname-email"
            type="text"
            value={lastNameOrEmail}
            onChange={(e) => setLastNameOrEmail(e.target.value)}
            placeholder="Enter last name or email address"
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full rounded-full py-3 text-sm font-semibold transition ${
            isFormValid
              ? "bg-[#0047ab] text-white hover:bg-[#1d5ed6]"
              : "bg-[#eef2ff] text-[#6c7aa5] cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

