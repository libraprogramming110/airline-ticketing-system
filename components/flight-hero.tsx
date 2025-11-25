"use client";

import { useState } from "react";
import {
  FaPlaneDeparture,
  FaRightLeft,
  FaMagnifyingGlass,
} from "react-icons/fa6";

export default function FlightHero() {
  const [tripType, setTripType] = useState<"roundtrip" | "one-way">("roundtrip");
  const isRoundTrip = tripType === "roundtrip";

  return (
    <div className="mt-16 flex flex-col items-center gap-12 md:mt-20">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0047ab] px-2 py-3 shadow-[0_20px_45px_rgba(0,0,0,.45)] md:max-w-6xl md:px-4 md:py-4">
        <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wide">
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="h-5 w-5" aria-hidden="true" />
            Flights
          </div>
          <div className="flex gap-3 rounded-full bg-white/10 p-1 text-xs font-semibold">
            <TripToggle
              label="Roundtrip"
              active={isRoundTrip}
              onClick={() => setTripType("roundtrip")}
            />
            <TripToggle
              label="One-way"
              active={!isRoundTrip}
              onClick={() => setTripType("one-way")}
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white px-1.5 py-6 text-[#001d45] md:px-2 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex flex-1 items-center gap-3 md:gap-4">
              <Field label="From" value="Select Origin" className="flex-1" />
              <div className="hidden shrink-0 items-center justify-center rounded-full bg-[#eef2ff] p-2 md:flex">
                <FaRightLeft
                  className="h-4 w-4 text-[#1e3a8a]"
                  aria-hidden="true"
                />
              </div>
              <Field
                label="To"
                value="Select Destination"
                className="flex-1"
              />
            </div>

            <div className="hidden h-16 w-px border-l border-dashed border-[#a8bff1] md:block" />

            <div className="flex flex-1 items-center gap-3 md:gap-4">
              <Field label="Departure" value="16 Nov 2025" className="flex-1" />
              {isRoundTrip && (
                <Field label="Return" value="Return Date" className="flex-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-full bg-[#0047ab] px-8 py-3 text-lg font-semibold shadow-lg shadow-[#0047ab]/40 transition hover:-translate-y-0.5 hover:bg-[#1d5ed6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Search Flights
        <FaMagnifyingGlass className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

type TripToggleProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function TripToggle({ label, active, onClick }: TripToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1 transition ${
        active ? "bg-white text-[#0047ab]" : "text-white"
      }`}
    >
      {label}
    </button>
  );
}

type FieldProps = {
  label: string;
  value: string;
  className?: string;
};

function Field({ label, value, className = "" }: FieldProps) {
  return (
    <div className={`rounded-2xl border border-[#dbe5ff] px-4 py-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#001d45]">{value}</p>
    </div>
  );
}

