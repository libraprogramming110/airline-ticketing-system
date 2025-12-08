"use client";

import { useState } from "react";
import {
  FaPlaneDeparture,
  FaCalendar,
  FaUser,
  FaMagnifyingGlass,
  FaPlane,
  FaArrowRight,
  FaCircleInfo,
} from "react-icons/fa6";

const bookingSteps = [
  { label: "Search Flights", active: true },
  { label: "Passenger Details", active: false },
  { label: "Confirmation", active: false },
];

const dates = [
  { date: "1 Dec 2025", price: "PHP 1,687.72", selected: true },
  { date: "2 Dec 2025", price: "PHP 2,687.72", selected: false },
  { date: "3 Dec 2025", price: "PHP 3,687.72", selected: false },
  { date: "4 Dec 2025", price: "PHP 4,687.72", selected: false },
  { date: "5 Dec 2025", price: "PHP 5,687.72", selected: false },
  { date: "6 Dec 2025", price: "PHP 6,687.72", selected: false },
];

const timeFilters = [
  { label: "All Flights", active: true },
  { label: "Morning (6:00 AM - 12:00 PM)", active: false },
  { label: "Afternoon (1:00 PM - 6:00 PM)", active: false },
  { label: "Evening (6:00 PM+)", active: false },
];

const cabinFilters = [
  { label: "All Cabins", active: true },
  { label: "Economy", active: false },
  { label: "Business Class", active: false },
  { label: "First Class", active: false },
];

const flights = [
  {
    id: 1,
    flightNumber: "MSU101",
    aircraft: "Airbus A320",
    departure: { time: "6:00 AM", city: "Cagayan de Oro", code: "CGY" },
    arrival: { time: "7:30 AM", city: "Manila", code: "MNL" },
    duration: "1h 30m",
    stops: "Non-stop",
    seatsLeft: 10,
    baggage: "15kg checked baggage",
    price: "PHP 1,678.72",
    cabin: "Economy",
    hasDiscount: true,
  },
  {
    id: 2,
    flightNumber: "MSU101",
    aircraft: "Airbus A320",
    departure: { time: "6:00 AM", city: "Cagayan de Oro", code: "CGY" },
    firstLeg: { duration: "5h 30m" },
    layover: { time: "1:00 PM", city: "Cebu", code: "CEB", duration: "1h" },
    secondLeg: { duration: "1h 0m" },
    arrival: { time: "2:00 PM", city: "Manila", code: "MNL" },
    totalDuration: "5h 30m",
    stops: "1 stop",
    seatsLeft: 20,
    price: "PHP 5,800.23",
    cabin: "Economy",
    hasDiscount: true,
    layoverNote: "This flight has a 1h 30m layover in Cebu, which requires you to collect and check in your baggage again.",
  },
  {
    id: 3,
    flightNumber: "MSU101",
    aircraft: "Airbus A320",
    departure: { time: "6:00 AM", city: "Cagayan de Oro", code: "CGY" },
    arrival: { time: "7:30 AM", city: "Manila", code: "MNL" },
    duration: "1h 30m",
    stops: "Non-stop",
    price: "PHP 10,867.98",
    cabin: "Business Class",
    hasDiscount: false,
  },
];

export default function SearchFlightsContent() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All Flights");
  const [selectedCabinFilter, setSelectedCabinFilter] = useState("All Cabins");

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 md:px-16">
      <BookingProgress />
      <SearchCriteriaCard />
      <RouteAndDateSelector dates={dates} />
      <FilterSection
        timeFilters={timeFilters}
        cabinFilters={cabinFilters}
        selectedTimeFilter={selectedTimeFilter}
        selectedCabinFilter={selectedCabinFilter}
        onTimeFilterChange={setSelectedTimeFilter}
        onCabinFilterChange={setSelectedCabinFilter}
      />
      <FlightsList flights={flights} />
    </div>
  );
}

function BookingProgress() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        {bookingSteps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step.active
                    ? "bg-[#0047ab] text-white"
                    : "bg-[#eef2ff] text-[#6c7aa5]"
                }`}
              >
                {step.active ? (
                  <FaPlaneDeparture className="h-5 w-5" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-[#6c7aa5]" />
                )}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step.active ? "text-[#0047ab]" : "text-[#6c7aa5]"
                }`}
              >
                {step.label}
              </span>
              {step.active && (
                <div className="h-1 w-full rounded-full bg-[#0047ab]" />
              )}
            </div>
            {index < bookingSteps.length - 1 && (
              <div className="h-0.5 w-16 border-t-2 border-dashed border-[#6c7aa5]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchCriteriaCard() {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <FaPlane className="h-5 w-5 text-[#0047ab]" />
            <span className="font-semibold text-[#001d45]">
              Cagayan de Oro → Manila
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar className="h-5 w-5 text-[#0047ab]" />
            <span className="font-semibold text-[#001d45]">December 15, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="h-5 w-5 text-[#0047ab]" />
            <span className="font-semibold text-[#001d45]">1 Passenger(s)</span>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#0047ab] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1d5ed6]">
          <FaMagnifyingGlass className="h-4 w-4" />
          Modify Search
        </button>
      </div>
    </div>
  );
}

function RouteAndDateSelector({
  dates,
}: {
  dates: Array<{ date: string; price: string; selected: boolean }>;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-semibold text-[#001d45]">
        Select your departing flight
      </h3>
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="font-semibold text-[#001d45]">Cagayan de Oro</span>
        <FaPlane className="h-4 w-4 text-[#0047ab]" />
        <span className="font-semibold text-[#001d45]">Manila</span>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date.date}
            className={`flex shrink-0 flex-col rounded-xl border-2 px-4 py-3 transition ${
              date.selected
                ? "border-[#0047ab] bg-[#eef2ff]"
                : "border-[#dbe5ff] bg-white hover:border-[#0047ab]/50"
            }`}
          >
            <span className="text-sm font-semibold text-[#001d45]">{date.date}</span>
            <span className="text-xs text-[#6c7aa5]">{date.price}</span>
          </button>
        ))}
        <button className="shrink-0 rounded-full bg-[#0047ab] p-2 text-white transition hover:bg-[#1d5ed6]">
          <FaArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FilterSection({
  timeFilters,
  cabinFilters,
  selectedTimeFilter,
  selectedCabinFilter,
  onTimeFilterChange,
  onCabinFilterChange,
}: {
  timeFilters: Array<{ label: string; active: boolean }>;
  cabinFilters: Array<{ label: string; active: boolean }>;
  selectedTimeFilter: string;
  selectedCabinFilter: string;
  onTimeFilterChange: (filter: string) => void;
  onCabinFilterChange: (filter: string) => void;
}) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <p className="mb-3 text-sm font-semibold text-[#001d45]">Filter by</p>
        <div className="flex flex-wrap gap-3">
          {timeFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => onTimeFilterChange(filter.label)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                selectedTimeFilter === filter.label
                  ? "bg-[#0047ab] text-white"
                  : "bg-white text-[#001d45] hover:bg-[#eef2ff]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-[#001d45]">Cabins</p>
        <div className="flex flex-wrap gap-3">
          {cabinFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => onCabinFilterChange(filter.label)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                selectedCabinFilter === filter.label
                  ? "bg-[#0047ab] text-white"
                  : "bg-white text-[#001d45] hover:bg-[#eef2ff]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlightsList({ flights }: { flights: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#001d45]">Available Flights</h2>
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({ flight }: { flight: any }) {
  const cabinColors = {
    Economy: "bg-[#00C951]",
    "Business Class": "bg-[#0047ab]",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2">
            <FaPlane className="h-5 w-5 text-[#0047ab]" />
            <span className="font-semibold text-[#001d45]">
              {flight.flightNumber} {flight.aircraft}
            </span>
          </div>

          <div className="space-y-4">
            <FlightSegment flight={flight} />
            {flight.baggage && (
              <p className="text-sm text-[#6c7aa5]">{flight.baggage}</p>
            )}
            {flight.layover && (
              <div className="flex items-start gap-2 rounded-lg bg-[#eef2ff] p-3">
                <FaCircleInfo className="h-4 w-4 shrink-0 text-[#0047ab] mt-0.5" />
                <p className="text-xs text-[#6c7aa5]">{flight.layoverNote}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 lg:min-w-[200px]">
          {flight.seatsLeft && (
            <span className="text-sm font-semibold text-[#FFE008]">
              {flight.seatsLeft} seats left
            </span>
          )}
          <div className="text-right">
            {flight.hasDiscount && (
              <p className="text-xs font-semibold text-[#00C951]">Discounted Fare!</p>
            )}
            <p className="text-2xl font-semibold text-[#001d45]">{flight.price}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                cabinColors[flight.cabin as keyof typeof cabinColors] || "bg-[#6c7aa5]"
              }`}
            >
              {flight.cabin}
            </span>
            <button className="rounded-lg bg-[#0047ab] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1d5ed6]">
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightSegment({ flight }: { flight: any }) {
  if (flight.layover) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-[#001d45]">
              {flight.departure.time}
            </span>
            <span className="text-sm text-[#6c7aa5]">
              {flight.departure.city} {flight.departure.code}
            </span>
          </div>
          <div className="flex-1">
            <div className="relative flex items-center">
              <div className="h-0.5 w-full bg-[#dbe5ff]" />
              <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
                <FaPlane className="h-4 w-4 text-[#0047ab]" />
              </div>
            </div>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#6c7aa5]">
              <span>{flight.firstLeg?.duration || flight.duration}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#001d45]">
              {flight.firstLeg?.arrival?.time || flight.layover.time}
            </span>
            <span className="text-xs text-[#6c7aa5]">
              {flight.layover.city} {flight.layover.code}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#001d45]">
              {flight.layover.time}
            </span>
            <span className="text-xs text-[#6c7aa5]">
              {flight.layover.city} {flight.layover.code}
            </span>
            <span className="text-xs text-[#6c7aa5]">
              {flight.layover.duration} layover
            </span>
          </div>
          <div className="flex-1">
            <div className="relative flex items-center">
              <div className="h-0.5 w-full bg-[#dbe5ff]" />
              <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
                <FaPlane className="h-4 w-4 text-[#0047ab]" />
              </div>
            </div>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#6c7aa5]">
              <span>{flight.secondLeg?.duration || "1h 0m"}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-[#001d45]">
              {flight.arrival.time}
            </span>
            <span className="text-sm text-[#6c7aa5]">
              {flight.arrival.city} {flight.arrival.code}
            </span>
          </div>
        </div>
        <div className="text-center text-xs text-[#6c7aa5]">
          <span>{flight.totalDuration || flight.duration}</span>
          <span className="mx-2">•</span>
          <span>{flight.stops}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-[#001d45]">{flight.departure.time}</span>
        <span className="text-sm text-[#6c7aa5]">
          {flight.departure.city} {flight.departure.code}
        </span>
      </div>
      <div className="flex-1">
        <div className="relative flex items-center">
          <div className="h-0.5 w-full bg-[#dbe5ff]" />
          <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
            <FaPlane className="h-4 w-4 text-[#0047ab]" />
          </div>
        </div>
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#6c7aa5]">
          <span>{flight.duration}</span>
          <span>•</span>
          <span>{flight.stops}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-[#001d45]">{flight.arrival.time}</span>
        <span className="text-sm text-[#6c7aa5]">
          {flight.arrival.city} {flight.arrival.code}
        </span>
      </div>
    </div>
  );
}

