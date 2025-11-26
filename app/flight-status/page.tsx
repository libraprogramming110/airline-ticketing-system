"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { FaRightLeft, FaXmark } from "react-icons/fa6";

export default function FlightStatusPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f7f9fc] px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <InstructionText />
          <FlightStatusFormCard />
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

function InstructionText() {
  return (
    <div className="mb-8 space-y-2 text-center">
      <p className="text-sm text-[#4a5b82]">
        Check the flight status for departures and arrivals within 24 hours.
      </p>
      <p className="text-sm text-[#6c7aa5]">
        The info is displayed in each airport&apos;s local time and may change.
        Final timings will be announced at the airport.
      </p>
    </div>
  );
}

function FlightStatusFormCard() {
  const [searchType, setSearchType] = useState<"route" | "flight">("route");
  const [from, setFrom] = useState("Manila MNL");
  const [to, setTo] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDateByNumber, setFlightDateByNumber] = useState("");

  const isFormValid =
    searchType === "route"
      ? from.trim() !== "" && to.trim() !== "" && flightDate.trim() !== ""
      : flightNumber.trim() !== "" && flightDateByNumber.trim() !== "";

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
      <div className="mb-6 flex gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="search-type"
            value="route"
            checked={searchType === "route"}
            onChange={(e) => setSearchType(e.target.value as "route" | "flight")}
            className="h-4 w-4 accent-[#0047ab]"
          />
          <span className="text-sm font-semibold text-[#001d45]">By route</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="search-type"
            value="flight"
            checked={searchType === "flight"}
            onChange={(e) => setSearchType(e.target.value as "route" | "flight")}
            className="h-4 w-4 accent-[#0047ab]"
          />
          <span className="text-sm font-semibold text-[#001d45]">
            Flight No.
          </span>
        </label>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {searchType === "route" && (
          <>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label
                  htmlFor="from"
                  className="mb-2 block text-sm font-semibold text-[#001d45]"
                >
                  From<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="from"
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Select Origin"
                    className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
                  />
                  {from && (
                    <button
                      type="button"
                      onClick={() => setFrom("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7aa5] transition hover:text-[#001d45]"
                      aria-label="Clear"
                    >
                      <FaXmark className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="mb-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe5ff] bg-white text-[#0047ab] transition hover:bg-[#eef2ff] md:mb-2"
                aria-label="Swap origin and destination"
              >
                <FaRightLeft className="h-4 w-4" />
              </button>

              <div>
                <label
                  htmlFor="to"
                  className="mb-2 block text-sm font-semibold text-[#001d45]"
                >
                  To<span className="text-red-500">*</span>
                </label>
                <input
                  id="to"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Select Destination"
                  className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="flight-date"
                className="mb-2 block text-sm font-semibold text-[#001d45]"
              >
                Flight Date<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="flight-date"
                  type="text"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  placeholder="Select"
                  className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute right-3 top-1/2 -translate-y-1/2 stroke-[#6c7aa5]"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </>
        )}

        {searchType === "flight" && (
          <>
            <div>
              <label
                htmlFor="flight-number"
                className="mb-2 block text-sm font-semibold text-[#001d45]"
              >
                Flight No.<span className="text-red-500">*</span>
              </label>
              <input
                id="flight-number"
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g. 5J123 / DG456"
                className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
              />
            </div>

            <div>
              <label
                htmlFor="flight-date-number"
                className="mb-2 block text-sm font-semibold text-[#001d45]"
              >
                Flight Date<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="flight-date-number"
                  type="text"
                  value={flightDateByNumber}
                  onChange={(e) => setFlightDateByNumber(e.target.value)}
                  placeholder="Select"
                  className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20"
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute right-3 top-1/2 -translate-y-1/2 stroke-[#6c7aa5]"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
              isFormValid
                ? "bg-[#0047ab] text-white hover:bg-[#1d5ed6]"
                : "bg-[#eef2ff] text-[#6c7aa5] cursor-not-allowed"
            }`}
          >
            Check status
          </button>
        </div>
      </form>
    </div>
  );
}

