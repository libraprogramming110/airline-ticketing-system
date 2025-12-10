"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlaneDeparture,
  FaRightLeft,
  FaMagnifyingGlass,
  FaChevronDown,
  FaCalendar,
} from "react-icons/fa6";
import airports from "@/lib/data/airports.json";
import { searchFlightsAction } from "@/server/actions/searchFlights";

export default function FlightHero() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"roundtrip" | "one-way">("roundtrip");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const isRoundTrip = tripType === "roundtrip";

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate || adults === 0) {
      alert("Please fill in all required fields (Origin, Destination, Departure Date, and at least 1 Adult)");
      return;
    }

    if (isRoundTrip && !returnDate) {
      alert("Please select a return date for round trip flights");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("origin", origin);
    formData.append("destination", destination);
    formData.append("departureDate", departureDate);
    if (returnDate) formData.append("returnDate", returnDate);
    formData.append("adults", adults.toString());
    formData.append("children", children.toString());

    const result = await searchFlightsAction(formData);

    setIsLoading(false);

    if (result.success) {
      const params = new URLSearchParams({
        origin,
        destination,
        departureDate,
        originalDepartureDate: departureDate,
        adults: adults.toString(),
        children: children.toString(),
      });
      if (returnDate) params.append("returnDate", returnDate);
      
      router.push(`/search-flights?${params.toString()}`);
    } else {
      alert(result.error || "Failed to search flights");
    }
  };

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
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-3 md:gap-4">
              <AirportDropdown
                label="From"
                value={origin}
                onChange={setOrigin}
                excludeCode={destination}
                className="flex-1"
              />
              <button
                onClick={handleSwapAirports}
                className="hidden shrink-0 items-center justify-center rounded-full bg-[#eef2ff] p-2 transition hover:bg-[#dbe5ff] md:flex"
                aria-label="Swap origin and destination"
              >
                <FaRightLeft
                  className="h-4 w-4 text-[#1e3a8a]"
                  aria-hidden="true"
                />
              </button>
              <AirportDropdown
                label="To"
                value={destination}
                onChange={setDestination}
                excludeCode={origin}
                className="flex-1"
              />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <PassengerDropdown 
                  label="Adult" 
                  value={adults.toString()} 
                  onChange={(val) => setAdults(parseInt(val) || 0)}
                  helperText="12+ years old" 
                  max={10} 
                />
                <PassengerDropdown 
                  label="Children" 
                  value={children.toString()} 
                  onChange={(val) => setChildren(parseInt(val) || 0)}
                  helperText="2-11 years old, Infants 0-1" 
                  max={10} 
                />
              </div>
            </div>

            <div className="hidden h-auto w-px border-l border-dashed border-[#a8bff1] md:block" />

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-3 md:gap-4">
              <DateField
                label="Departure"
                value={departureDate}
                onChange={setDepartureDate}
                minDate={new Date().toISOString().split('T')[0]}
                className="flex-1"
              />
              {isRoundTrip && (
                <DateField
                  label="Return"
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={departureDate || new Date().toISOString().split('T')[0]}
                  className="flex-1"
                />
              )}
              </div>
              <PromoCodeField />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSearch}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-full bg-[#0047ab] px-8 py-3 text-lg font-semibold shadow-lg shadow-[#0047ab]/40 transition hover:-translate-y-0.5 hover:bg-[#1d5ed6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Searching..." : "Search Flights"}
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

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  className?: string;
};

function DateField({
  label,
  value,
  onChange,
  minDate,
  className = "",
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const tryShowPicker = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      // Some browsers may block showPicker; fail quietly.
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return `Select ${label.toLowerCase()}`;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`rounded-2xl border border-[#dbe5ff] px-4 py-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
        {label}
      </p>
      <div className="relative mt-1">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-[#001d45] min-h-[1.5rem] flex-1">
            {value ? (
              <span className="text-[#001d45]">{formatDate(value)}</span>
            ) : (
              <span className="text-[#6c7aa5]">{formatDate("")}</span>
            )}
          </div>
          <FaCalendar className="h-5 w-5 text-[#6c7aa5] pointer-events-none shrink-0 ml-2" />
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate}
          ref={inputRef}
          onFocus={tryShowPicker}
          onPointerDown={tryShowPicker}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ fontSize: '1.125rem', zIndex: 20 }}
        />
      </div>
    </div>
  );
}

type AirportDropdownProps = {
  label: string;
  value: string;
  onChange: (code: string) => void;
  excludeCode?: string;
  className?: string;
};

function AirportDropdown({
  label,
  value,
  onChange,
  excludeCode,
  className = "",
}: AirportDropdownProps) {
  const selectedAirport = airports.find((a) => a.code === value);
  const displayValue = selectedAirport ? selectedAirport.name : `Select ${label.toLowerCase()}`;

  return (
    <div className={`rounded-2xl border border-[#dbe5ff] px-4 py-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
        {label}
      </p>
      <div className="relative mt-1 flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none text-lg font-semibold text-[#001d45] outline-none"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {airports.map((airport) => {
            if (airport.code === excludeCode) return null;
            return (
              <option key={airport.code} value={airport.code}>
                {airport.name}
              </option>
            );
          })}
        </select>
        <FaChevronDown className="absolute right-0 h-4 w-4 text-[#6c7aa5] pointer-events-none" />
      </div>
    </div>
  );
}

type PassengerDropdownProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText: string;
  max?: number;
};

function PassengerDropdown({ label, value, onChange, helperText, max = 10 }: PassengerDropdownProps) {
  const options = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="rounded-2xl border border-[#dbe5ff] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
        {label}
      </p>
      <div className="relative mt-1 flex items-center">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none text-lg font-semibold text-[#001d45] outline-none"
        >
          {options.map((num) => (
            <option key={num} value={num}>
              {num === 0 ? value : num}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-0 h-4 w-4 text-[#6c7aa5] pointer-events-none" />
      </div>
      <p className="mt-1 text-xs text-[#6c7aa5]">{helperText}</p>
    </div>
  );
}

function PromoCodeField() {
  return (
    <div className="rounded-2xl border border-[#dbe5ff] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c7aa5]">
        Enter promo code
      </p>
      <input
        type="text"
        placeholder="Promo code (Optional)"
        className="mt-1 w-full text-lg font-semibold text-[#001d45] outline-none placeholder:text-[#6c7aa5] placeholder:font-normal"
      />
    </div>
  );
}

