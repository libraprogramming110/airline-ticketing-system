/* eslint-disable @next/next/no-img-element */

import {
  FaPlaneDeparture,
  FaCalendar,
  FaUsers,
  FaMagnifyingGlass,
  FaPlane,
  FaArrowRight,
  FaChevronDown,
  FaClock,
  FaPlaneArrival,
  FaCircleInfo,
  FaCircleCheck,
  FaClipboardList,
  FaPaperPlane,
} from "react-icons/fa6";
import Footer from "@/components/footer";
import DateSelectionCards from "@/components/date-selection-cards";
import FlightFilters from "@/components/flight-filters";
import FlightResults from "@/components/flight-results";
import BookingProgressIndicator from "@/components/booking-progress-indicator";
import { searchFlights, getLowestPricesByDate } from "@/server/services/flightService";
import airports from "@/lib/data/airports.json";

type SearchParams = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  originalDepartureDate?: string;
  returnDate?: string;
  adults?: string;
  children?: string;
  selectingReturn?: string;
  departureFlightId?: string;
  departureOrigin?: string;
  departureDestination?: string;
  departureTime?: string;
  departureArrivalTime?: string;
  departurePrice?: string;
  departureCabinClass?: string;
};

function FlightFiltersAndResults({ 
  flights, 
  datePrices, 
  departureDate,
  origin,
  destination,
  returnDate,
  adults,
  children,
  isSelectingReturn = false,
  departureFlightId,
  departureOrigin,
  departureDestination,
  departureDateParam,
  departureTime,
  departureArrivalTime,
  departurePrice,
  departureCabinClass,
}: { 
  flights: any[];
  datePrices: Array<{ date: string; lowest_price: number }>;
  departureDate: string;
  origin: string;
  destination: string;
  returnDate: string;
  adults: number;
  children: number;
  isSelectingReturn?: boolean;
  departureFlightId?: string;
  departureOrigin?: string;
  departureDestination?: string;
  departureDateParam?: string;
  departureTime?: string;
  departureArrivalTime?: string;
  departurePrice?: string;
  departureCabinClass?: string;
}) {
  return (
    <>
      <FlightFilters flights={flights} />
      <FlightResults 
        flights={flights} 
        datePrices={datePrices} 
        departureDate={departureDate}
        origin={origin}
        destination={destination}
        returnDate={returnDate}
        adults={adults}
        children={children}
        isSelectingReturn={isSelectingReturn}
        departureFlightId={departureFlightId}
        departureOrigin={departureOrigin}
        departureDestination={departureDestination}
        departureDateParam={departureDateParam}
        departureTime={departureTime}
        departureArrivalTime={departureArrivalTime}
        departurePrice={departurePrice}
        departureCabinClass={departureCabinClass}
      />
    </>
  );
}

export default async function SearchFlightsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isSelectingReturn = params.selectingReturn === 'true';
  const origin = params.origin || "";
  const destination = params.destination || "";
  const departureDate = params.departureDate || "";
  const originalDepartureDate = params.originalDepartureDate || departureDate;
  const returnDate = params.returnDate || "";
  const adults = parseInt(params.adults || "1");
  const children = parseInt(params.children || "0");
  const passengerCount = adults + children;

  let departingFlights: any[] = [];
  let returningFlights: any[] = [];
  let datePrices: Array<{ date: string; lowest_price: number }> = [];
  let flightsToShow: any[] = [];

  if (origin && destination && departureDate) {
    try {
      const validOriginalDate = originalDepartureDate || departureDate;
      if (isSelectingReturn) {
        returningFlights = await searchFlights(origin, destination, departureDate, passengerCount);
        datePrices = await getLowestPricesByDate(origin, destination, validOriginalDate);
        flightsToShow = returningFlights;
      } else {
        departingFlights = await searchFlights(origin, destination, departureDate, passengerCount);
        datePrices = await getLowestPricesByDate(origin, destination, validOriginalDate);
        flightsToShow = departingFlights;
        if (returnDate) {
          returningFlights = await searchFlights(destination, origin, returnDate, passengerCount);
        }
      }
    } catch (error) {
      console.error('Flight search error:', error);
      // Error handled silently - will show "No flights found" message
    }
  }

  const originAirport = airports.find((a) => a.code === origin);
  const destinationAirport = airports.find((a) => a.code === destination);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <HeaderSection />
      <BookingProgressIndicator currentStep={1} />
      <AvailableFlightsSection
        origin={originAirport?.name || origin}
        destination={destinationAirport?.name || destination}
        departureDate={departureDate}
        passengerCount={passengerCount}
        isSelectingReturn={isSelectingReturn}
      />
      <DepartingFlightSection
        origin={originAirport?.name || origin}
        destination={destinationAirport?.name || destination}
        originCode={origin}
        destinationCode={destination}
        selectedDate={departureDate}
        originalDepartureDate={originalDepartureDate}
        datePrices={datePrices}
        adults={adults}
        children={children}
      />
      <FlightFiltersAndResults 
        flights={flightsToShow} 
        datePrices={datePrices}
        departureDate={departureDate}
        origin={origin}
        destination={destination}
        returnDate={returnDate}
        adults={adults}
        children={children}
        isSelectingReturn={isSelectingReturn}
        departureFlightId={params.departureFlightId}
        departureOrigin={params.departureOrigin}
        departureDestination={params.departureDestination}
        departureDateParam={params.departureDate}
        departureTime={params.departureTime}
        departureArrivalTime={params.departureArrivalTime}
        departurePrice={params.departurePrice}
        departureCabinClass={params.departureCabinClass}
      />
      <Footer />
    </div>
  );
}

function HeaderSection() {
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
          <div className="relative group">
            <button className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              MANAGE
            </button>
            <div className="absolute left-1/2 top-full z-20 flex -translate-x-1/2 flex-col pt-4 opacity-0 pointer-events-none translate-y-2 transition group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-100">
              <div className="min-w-[360px] rounded-3xl bg-white/95 p-6 text-left text-[#001d45] shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
                <div className="grid gap-6 md:grid-cols-3">
                  <a
                    href="/check-in"
                    className="flex flex-col items-center gap-3 text-center transition hover:text-[#0047ab]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047ab]">
                      <FaCircleCheck
                        className="h-6 w-6 text-[#0047ab]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#0047ab]">
                      Check in
                    </span>
                  </a>
                  <a
                    href="/manage-booking"
                    className="flex flex-col items-center gap-3 text-center transition hover:text-[#0047ab]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047ab]">
                      <FaClipboardList
                        className="h-6 w-6 text-[#0047ab]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#0047ab]">
                      Manage Booking
                    </span>
                  </a>
                  <a
                    href="/flight-status"
                    className="flex flex-col items-center gap-3 text-center transition hover:text-[#0047ab]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66B2FF]/50 text-[#0047ab]">
                      <FaPaperPlane
                        className="h-6 w-6 text-[#0047ab]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#0047ab]">
                      Flight Status
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a
            href="/blog"
            className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Blog
          </a>
          <a
            href="/sign-in"
            className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
}


function AvailableFlightsSection({
  origin,
  destination,
  departureDate,
  passengerCount,
  isSelectingReturn = false,
}: {
  origin: string;
  destination: string;
  departureDate: string;
  passengerCount: number;
  isSelectingReturn?: boolean;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-lg bg-white shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 rounded-tl-lg rounded-bl-lg bg-[#0047ab]" />
          <div className="flex flex-col gap-6 p-6 pl-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-6">
              <h2 className="text-2xl font-bold text-[#001d45]">Available Flights</h2>
              <div className="flex flex-wrap items-center gap-6">
                <FlightInfo
                  icon={FaPlaneDeparture}
                  text={`${origin} — ${destination}`}
                />
                <FlightInfo icon={FaCalendar} text={formatDate(departureDate)} />
                <FlightInfo icon={FaUsers} text={`${passengerCount} Passenger(s)`} />
              </div>
            </div>
            <ModifySearchButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightInfo({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#0047ab]" />
      <span className="text-sm text-[#6c7aa5]">{text}</span>
    </div>
  );
}

function ModifySearchButton() {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-[#dbe5ff] px-6 py-3 text-sm font-semibold text-[#6c7aa5] transition hover:bg-[#f5f7fb]">
      <FaMagnifyingGlass className="h-4 w-4" />
      <span>Modify Search</span>
    </button>
  );
}

function DepartingFlightSection({
  origin,
  destination,
  originCode,
  destinationCode,
  selectedDate,
  originalDepartureDate,
  datePrices,
  adults,
  children,
}: {
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  selectedDate: string;
  originalDepartureDate: string;
  datePrices: Array<{ date: string; lowest_price: number }>;
  adults: number;
  children: number;
}) {
  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="mb-2 text-sm text-[#6c7aa5]">Select your departing flight</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-[#001d45]">{origin}</h3>
            <FaPlane className="h-5 w-5 text-[#0047ab]" />
            <h3 className="text-2xl font-bold text-[#001d45]">{destination}</h3>
          </div>
        </div>
        <DateSelectionCards
          originCode={originCode}
          destinationCode={destinationCode}
          selectedDate={selectedDate}
          originalDepartureDate={originalDepartureDate}
          datePrices={datePrices}
          adults={adults}
          children={children}
        />
      </div>
    </div>
  );
}

function FlightFiltersSection() {
  const cabins = [
    { label: "All Cabins", selected: true },
    { label: "Economy", selected: false },
    { label: "Business Class", selected: false },
    { label: "First Class", selected: false },
  ];

  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4 flex-nowrap">
              <h3 className="text-base font-semibold text-[#001d45] whitespace-nowrap">Filter by</h3>
              <div className="relative flex-shrink-0 min-w-[250px] max-w-[400px]">
                <select className="w-full appearance-none rounded-lg border border-[#dbe5ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#001d45] outline-none transition focus:border-[#0047ab]">
                  <option value="all">All Flights</option>
                  <option value="morning">Morning (6:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (1:00 PM - 6:00 PM)</option>
                  <option value="evening">Evening (6:00 PM+)</option>
                </select>
                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7aa5]" />
              </div>
            </div>
            <div className="h-10 self-stretch border-l border-dashed border-[#dbe5ff]" />
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {cabins.map((cabin) => (
                  <FilterChip
                    key={cabin.label}
                    label={cabin.label}
                    selected={cabin.selected}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  selected,
}: {
  label: string;
  selected: boolean;
}) {
  return (
    <button
      className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
        selected
          ? "bg-[#eef2ff] text-[#0047ab]"
          : "bg-[#f5f7fb] text-[#001d45] hover:bg-[#eef2ff]"
      }`}
    >
      {label}
    </button>
  );
}

function FlightResultsSection({ flights }: { flights: any[] }) {
  if (flights.length === 0) {
    return (
      <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <p className="text-lg font-semibold text-[#001d45]">No flights found</p>
            <p className="mt-2 text-sm text-[#6c7aa5]">Please try different search criteria</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({ flight }: { flight: any }) {
  const originAirport = airports.find((a) => a.code === flight.origin);
  const destinationAirport = airports.find((a) => a.code === flight.destination);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = (depTime: string, arrTime: string) => {
    const dep = new Date(`2000-01-01T${depTime}`);
    const arr = new Date(`2000-01-01T${arrTime}`);
    if (arr < dep) {
      arr.setDate(arr.getDate() + 1);
    }
    const diff = arr.getTime() - dep.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-col divide-y divide-[#dbe5ff]">
        <FlightCardTopSection flight={flight} />
        <FlightCardMiddleSection
          flight={flight}
          originAirport={originAirport}
          destinationAirport={destinationAirport}
          formatTime={formatTime}
          calculateDuration={calculateDuration}
        />
        <FlightCardBottomSection flight={flight} />
      </div>
    </div>
  );
}

function FlightCardTopSection({ flight }: { flight: any }) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#eef2ff]">
          <FaPlane className="h-6 w-6 text-[#0047ab]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#001d45]">Flight {flight.id.slice(0, 8).toUpperCase()}</h3>
          <p className="text-sm text-[#6c7aa5]">Economy Class</p>
        </div>
      </div>
      <div className="rounded-lg bg-[#10b981] px-4 py-2">
        <span className="text-sm font-semibold text-white">Economy</span>
      </div>
    </div>
  );
}

function FlightCardMiddleSection({
  flight,
  originAirport,
  destinationAirport,
  formatTime,
  calculateDuration,
}: {
  flight: any;
  originAirport: any;
  destinationAirport: any;
  formatTime: (time: string) => string;
  calculateDuration: (dep: string, arr: string) => string;
}) {
  return (
    <div className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
      <div className="flex flex-1 flex-col">
        <p className="text-2xl font-bold text-[#001d45]">{formatTime(flight.departure_time)}</p>
        <p className="mt-1 text-base font-semibold text-[#001d45]">
          {originAirport?.name || flight.origin} {flight.origin}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <FaPlaneDeparture className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm text-[#6c7aa5]">Departure</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <FaPlane className="mb-2 h-6 w-6 text-[#0047ab]" />
        <div className="flex w-full items-center">
          <div className="h-2 w-2 rounded-full bg-[#0047ab]" />
          <div className="h-0.5 flex-1 bg-[#0047ab]" />
          <div className="h-2 w-2 rounded-full bg-[#0047ab]" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <FaClock className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm font-semibold text-[#001d45]">
            {calculateDuration(flight.departure_time, flight.arrival_time)}
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6c7aa5]">Non-stop</p>
      </div>
      <div className="flex flex-1 flex-col items-end">
        <p className="text-2xl font-bold text-[#001d45]">{formatTime(flight.arrival_time)}</p>
        <p className="mt-1 text-base font-semibold text-[#001d45]">
          {destinationAirport?.name || flight.destination} {flight.destination}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <FaPlaneArrival className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm text-[#6c7aa5]">Arrival</span>
        </div>
      </div>
    </div>
  );
}

function FlightCardBottomSection({ flight }: { flight: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-[#001d45]">Available Seats</p>
        <div className="mt-2 inline-block rounded-lg bg-[#fbbf24] px-3 py-1">
          <span className="text-sm font-semibold text-[#001d45]">
            {flight.available_seats} seats left
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        {flight.price < 2000 && (
          <div className="rounded-lg bg-[#10b981] px-4 py-2">
            <span className="text-sm font-semibold text-white">Discounted Fare!</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-2xl font-bold text-[#001d45]">{formatPrice(flight.price)}</p>
          <p className="text-sm text-[#6c7aa5]">All-in fare/passenger</p>
        </div>
        <button className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e]">
          Select
        </button>
      </div>
    </div>
  );
}

function LayoverFlightCard() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-col divide-y divide-[#dbe5ff]">
        <LayoverFlightCardTopSection />
        <LayoverFlightCardMiddleSection />
        <LayoverFlightCardBottomSection />
      </div>
    </div>
  );
}

function LayoverFlightCardTopSection() {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#eef2ff]">
          <FaPlane className="h-6 w-6 text-[#0047ab]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#001d45]">MSU101</h3>
          <p className="text-sm text-[#6c7aa5]">Airbus A320</p>
        </div>
      </div>
      <div className="rounded-lg bg-[#10b981] px-4 py-2">
        <span className="text-sm font-semibold text-white">Economy</span>
      </div>
    </div>
  );
}

function LayoverFlightCardMiddleSection() {
  return (
    <div className="flex flex-col gap-8 py-6">
      <FlightSegment
        departureTime="6:00 AM"
        departureCity="Cagayan de Oro CGY"
        arrivalTime="7:30 AM"
        arrivalCity="Cebu CEB"
        duration="5h 30m"
      />
      <FlightSegment
        departureTime="1:00 PM"
        departureCity="Cebu CEB"
        arrivalTime="1:10 PM"
        arrivalCity="Manila MNL"
        duration="1h"
      />
    </div>
  );
}

function FlightSegment({
  departureTime,
  departureCity,
  arrivalTime,
  arrivalCity,
  duration,
}: {
  departureTime: string;
  departureCity: string;
  arrivalTime: string;
  arrivalCity: string;
  duration: string;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="flex flex-1 flex-col">
        <p className="text-2xl font-bold text-[#001d45]">{departureTime}</p>
        <p className="mt-1 text-base font-semibold text-[#001d45]">{departureCity}</p>
        <div className="mt-2 flex items-center gap-2">
          <FaPlaneDeparture className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm text-[#6c7aa5]">Departure</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <FaPlane className="mb-2 h-6 w-6 text-[#0047ab]" />
        <div className="flex w-full items-center">
          <div className="h-2 w-2 rounded-full bg-[#0047ab]" />
          <div className="h-0.5 flex-1 bg-[#0047ab]" />
          <div className="h-2 w-2 rounded-full bg-[#0047ab]" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <FaClock className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm font-semibold text-[#001d45]">{duration}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-end">
        <p className="text-2xl font-bold text-[#001d45]">{arrivalTime}</p>
        <p className="mt-1 text-base font-semibold text-[#001d45]">{arrivalCity}</p>
        <div className="mt-2 flex items-center gap-2">
          <FaPlaneArrival className="h-4 w-4 text-[#0047ab]" />
          <span className="text-sm text-[#6c7aa5]">Arrival</span>
        </div>
      </div>
    </div>
  );
}

function LayoverFlightCardBottomSection() {
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-[#001d45]">Available Seats</p>
          <div className="mt-2 inline-block rounded-lg bg-[#fbbf24] px-3 py-1">
            <span className="text-sm font-semibold text-[#001d45]">20 seats left</span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-lg bg-[#10b981] px-4 py-2">
            <span className="text-sm font-semibold text-white">Discounted Fare!</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-[#001d45]">PHP 5,800.23</p>
            <p className="text-sm text-[#6c7aa5]">All-in fare/passenger</p>
          </div>
          <button className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e]">
            Select
          </button>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-lg bg-[#eef2ff] p-4">
        <FaCircleInfo className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0047ab]" />
        <p className="text-sm text-[#001d45]">
          This flight has a 5h 30m layover in Cebu, which requires you to collect and check in your baggage again.
        </p>
      </div>
    </div>
  );
}
