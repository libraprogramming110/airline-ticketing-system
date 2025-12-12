"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { FaRightLeft, FaXmark } from "react-icons/fa6";
import { getFlightStatusAction } from "@/server/actions/getFlightStatus";
import airports from "@/lib/data/airports.json";

type FlightStatus = {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  status: string;
};

export default function FlightStatusPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f7f9fc] px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <InstructionText />
          <FlightStatusContent />
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

function FlightStatusContent() {
  const [searchType, setSearchType] = useState<"route" | "flight">("route");
  const [from, setFrom] = useState("Manila");
  const [to, setTo] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDateByNumber, setFlightDateByNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FlightStatus[]>([]);

  const isFormValid =
    searchType === "route"
      ? from.trim() !== "" && to.trim() !== "" && flightDate.trim() !== ""
      : flightNumber.trim() !== "" && flightDateByNumber.trim() !== "";

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const toCode = (input: string) => {
    const normalized = (input || "").trim();
    if (!normalized) return "";
    const lower = normalized.toLowerCase();
    const match = (airports as Array<{ code?: string; city?: string; name?: string }>).find((a) => {
      const code = (a.code || "").toLowerCase();
      const city = (a.city || "").toLowerCase();
      const name = (a.name || "").toLowerCase();
      return code === lower || city === lower || name === lower;
    });
    return match && match.code ? match.code : normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const formData = new FormData();
      formData.append("mode", searchType);
      if (searchType === "route") {
        formData.append("origin", toCode(from));
        formData.append("destination", toCode(to));
        formData.append("date", flightDate.trim());
      } else {
        formData.append("flightNumber", flightNumber.trim());
        formData.append("date", flightDateByNumber.trim());
      }
      const result = await getFlightStatusAction(formData);
      if (result.success && result.flights) {
        setResults(result.flights);
      } else {
        setError(result.error || "No flights found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

        <form className="space-y-6" onSubmit={handleSubmit}>
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
                      placeholder="e.g. Manila"
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
                    placeholder="e.g. Cebu"
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
                    placeholder="YYYY-MM-DD"
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
                    placeholder="YYYY-MM-DD"
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
              disabled={!isFormValid || isLoading}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                isFormValid && !isLoading
                  ? "bg-[#0047ab] text-white hover:bg-[#1d5ed6]"
                  : "bg-[#eef2ff] text-[#6c7aa5] cursor-not-allowed"
              }`}
            >
              {isLoading ? "Searching..." : "Check status"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((flight) => (
            <div
              key={flight.id}
              className="rounded-2xl border border-[#dbe5ff] bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
                    Flight
                  </p>
                  <p className="text-lg font-bold text-[#0047ab]">{flight.flightNumber}</p>
                  <p className="text-sm font-semibold text-[#001d45]">
                    {flight.origin} → {flight.destination}
                  </p>
                </div>
                <StatusBadge status={flight.status} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <InfoBlock label="Date" value={flight.departure_date} />
                <InfoBlock label="Time" value={`${flight.departure_time} - ${flight.arrival_time}`} />
                <InfoBlock label="Price" value={`PHP ${flight.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && !isLoading && results.length === 0 && (
        <div className="rounded-2xl border border-[#dbe5ff] bg-white p-6 text-center text-sm text-[#6c7aa5]">
          No flights found. Try another search.
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const color =
    normalized === "delayed" ? "bg-yellow-100 text-yellow-800" :
    normalized === "cancelled" ? "bg-red-100 text-red-800" :
    "bg-green-100 text-green-800";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">{label}</p>
      <p className="text-sm font-semibold text-[#001d45]">{value}</p>
    </div>
  );
}
