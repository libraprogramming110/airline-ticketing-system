/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import airports from "@/lib/data/airports.json";
import BookingProgressIndicator from "@/components/booking-progress-indicator";
import { savePassengersAction } from "@/server/actions/savePassengers";
import {
  FaUser,
  FaPlane,
  FaLocationDot,
  FaCreditCard,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaXmark,
  FaCircleCheck,
  FaClipboardList,
  FaPaperPlane,
} from "react-icons/fa6";
import Flag from "react-flagkit";

export default function PassengerDetailsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-[#001d45]">Loading passenger details...</div>}>
      <PassengerDetailsContent />
    </Suspense>
  );
}

function PassengerDetailsContent() {
  const searchParams = useSearchParams();
  
  // Round trip: has both departure and return flight IDs
  const departureFlightIdParam = searchParams.get('departureFlightId');
  const returnFlightIdParam = searchParams.get('returnFlightId');
  const isRoundTrip = departureFlightIdParam !== null && returnFlightIdParam !== null;
  
  const flightId = searchParams.get('flightId') || '';
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const departureTime = searchParams.get('departureTime') || '';
  const arrivalTime = searchParams.get('arrivalTime') || '';
  const price = searchParams.get('price') || '';
  const cabinClass = searchParams.get('cabinClass') || '';
  
  const departureFlightId = searchParams.get('departureFlightId') || '';
  const departureOrigin = searchParams.get('departureOrigin') || '';
  const departureDestination = searchParams.get('departureDestination') || '';
  const departureDateParam = searchParams.get('departureDate') || '';
  const departureTimeParam = searchParams.get('departureTime') || '';
  const departureArrivalTime = searchParams.get('departureArrivalTime') || '';
  const departurePrice = searchParams.get('departurePrice') || '';
  const departureCabinClass = searchParams.get('departureCabinClass') || '';
  
  const returnFlightId = searchParams.get('returnFlightId') || '';
  const returnOrigin = searchParams.get('returnOrigin') || '';
  const returnDestination = searchParams.get('returnDestination') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const returnTime = searchParams.get('returnTime') || '';
  const returnArrivalTime = searchParams.get('returnArrivalTime') || '';
  const returnPrice = searchParams.get('returnPrice') || '';
  const returnCabinClass = searchParams.get('returnCabinClass') || '';
  
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <HeaderSection />
      <BookingProgressIndicator currentStep={2} />
      <FlightSummarySection 
        isRoundTrip={isRoundTrip}
        origin={isRoundTrip ? departureOrigin : origin}
        destination={isRoundTrip ? departureDestination : destination}
        departureDate={isRoundTrip ? departureDateParam : departureDate}
        returnOrigin={returnOrigin}
        returnDestination={returnDestination}
        returnDate={returnDate}
        formatDate={formatDate}
        adults={adults}
        children={children}
      />
      <PassengerBookingForm 
        isRoundTrip={isRoundTrip}
        origin={isRoundTrip ? departureOrigin : origin}
        destination={isRoundTrip ? departureDestination : destination}
        departureDate={isRoundTrip ? departureDateParam : departureDate}
        departureTime={isRoundTrip ? departureTimeParam : departureTime}
        departureArrivalTime={isRoundTrip ? departureArrivalTime : arrivalTime}
        returnOrigin={returnOrigin}
        returnDestination={returnDestination}
        returnDate={returnDate}
        returnTime={returnTime}
        returnArrivalTime={returnArrivalTime}
        formatDate={formatDate}
        formatTime={formatTime}
        adults={adults}
        children={children}
      />
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


function FlightSummarySection({
  isRoundTrip,
  origin,
  destination,
  departureDate,
  returnOrigin,
  returnDestination,
  returnDate,
  formatDate,
  adults,
  children,
}: {
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate: string;
  formatDate: (date: string) => string;
  adults: number;
  children: number;
}) {
  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-lg bg-white p-6 shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 rounded-tl-lg rounded-bl-lg bg-[#0047ab]" />
          <div className="flex flex-col gap-8 pl-8 md:flex-row md:justify-start md:gap-12">
            <SelectedFlightColumn 
              isRoundTrip={isRoundTrip}
              origin={origin}
              destination={destination}
              departureDate={departureDate}
              returnOrigin={returnOrigin}
              returnDestination={returnDestination}
              returnDate={returnDate}
              formatDate={formatDate}
            />
            <PassengersColumn adults={adults} children={children} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedFlightColumn({
  isRoundTrip,
  origin,
  destination,
  departureDate,
  returnOrigin,
  returnDestination,
  returnDate,
  formatDate,
}: {
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate: string;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="flex-1">
      <h3 className="mb-4 text-sm font-semibold text-[#6c7aa5]">Selected Flight</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="mb-3 text-base font-bold text-[#001d45]">Departing Flight</h4>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#001d45]">
              {origin} - {destination}
            </span>
            <FaPlane className="h-4 w-4 text-[#0047ab]" />
          </div>
          <p className="mt-1 text-sm text-[#6c7aa5]">{formatDate(departureDate)}</p>
        </div>
        {isRoundTrip && returnOrigin && returnDestination && (
          <div>
            <h4 className="mb-3 text-base font-bold text-[#001d45]">Returning Flight</h4>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[#001d45]">
                {returnOrigin} - {returnDestination}
              </span>
              <FaPlane className="h-4 w-4 text-[#0047ab]" />
            </div>
            <p className="mt-1 text-sm text-[#6c7aa5]">{formatDate(returnDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PassengersColumn({ adults, children }: { adults: number; children: number }) {
  const passengerText = [];
  if (adults > 0) {
    passengerText.push(`${adults} ${adults === 1 ? 'Adult' : 'Adults'}`);
  }
  if (children > 0) {
    passengerText.push(`${children} ${children === 1 ? 'Child' : 'Children'}`);
  }

  return (
    <div className="flex-1">
      <h3 className="mb-4 text-sm font-semibold text-[#6c7aa5]">Passenger(s)</h3>
      <p className="text-lg font-bold text-[#001d45]">
        {passengerText.length > 0 ? passengerText.join(', ') : '1 Adult'}
      </p>
    </div>
  );
}

function PassengerBookingForm({
  isRoundTrip,
  origin,
  destination,
  departureDate,
  departureTime,
  departureArrivalTime,
  returnOrigin,
  returnDestination,
  returnDate,
  returnTime,
  returnArrivalTime,
  formatDate,
  formatTime,
  adults,
  children,
}: {
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  departureArrivalTime: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate: string;
  returnTime?: string;
  returnArrivalTime?: string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  adults: number;
  children: number;
}) {
  const originAirport = airports.find((a) => a.code === origin);
  const destinationAirport = airports.find((a) => a.code === destination);
  const returnOriginAirport = returnOrigin ? airports.find((a) => a.code === returnOrigin) : null;
  const returnDestinationAirport = returnDestination ? airports.find((a) => a.code === returnDestination) : null;

  const totalPassengers = Math.max(1, adults + children);

  type PassengerInfo = {
    firstName: string;
    lastName: string;
    middleInitial: string;
    contactNumber: string;
    email: string;
    sex: string;
    birthDate: string;
  };

  const buildPassengerLabels = () => {
    const labels: string[] = [];
    for (let i = 0; i < adults; i += 1) {
      labels.push(`Adult ${i + 1}`);
    }
    for (let i = 0; i < children; i += 1) {
      labels.push(`Child ${i + 1}`);
    }
    if (labels.length === 0) {
      labels.push("Passenger 1");
    }
    return labels;
  };

  const passengerLabels = buildPassengerLabels();

  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [passengerInfos, setPassengerInfos] = useState<PassengerInfo[]>(() =>
    Array.from({ length: totalPassengers }, () => ({
      firstName: "",
      lastName: "",
      middleInitial: "",
      contactNumber: "",
      email: "",
      sex: "Male",
      birthDate: "",
    }))
  );

  const activePassenger = passengerInfos[activePassengerIndex] || passengerInfos[0];

  const handlePassengerChange = (field: keyof PassengerInfo, value: string) => {
    setPassengerInfos((prev) =>
      prev.map((info, idx) => (idx === activePassengerIndex ? { ...info, [field]: value } : info))
    );
  };

  const goToPreviousPassenger = () => {
    setActivePassengerIndex((idx) => Math.max(0, idx - 1));
  };

  const goToNextPassenger = () => {
    setActivePassengerIndex((idx) => Math.min(totalPassengers - 1, idx + 1));
  };

  const validatePassengers = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    passengerInfos.forEach((passenger, index) => {
      const label = passengerLabels[index] || `Passenger ${index + 1}`;
      
      if (!passenger.firstName.trim()) {
        errors.push(`${label}: First name is required`);
      }
      if (!passenger.lastName.trim()) {
        errors.push(`${label}: Last name is required`);
      }
      if (!passenger.email.trim()) {
        errors.push(`${label}: Email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        errors.push(`${label}: Valid email is required`);
      }
      if (!passenger.birthDate) {
        errors.push(`${label}: Date of birth is required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return (
    <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <PersonalInformationSection
              passengerLabel={passengerLabels[activePassengerIndex] || `Passenger ${activePassengerIndex + 1}`}
              passengerIndex={activePassengerIndex}
              totalPassengers={totalPassengers}
              passengerInfo={activePassenger}
              onChange={handlePassengerChange}
              onPrev={goToPreviousPassenger}
              onNext={goToNextPassenger}
            />
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-md space-y-8">
            <FlightDetailsSection 
              isRoundTrip={isRoundTrip}
              origin={originAirport?.name || origin}
              destination={destinationAirport?.name || destination}
              departureDate={departureDate}
              departureTime={departureTime}
              departureArrivalTime={departureArrivalTime}
              returnOrigin={returnOriginAirport?.name || returnOrigin}
              returnDestination={returnDestinationAirport?.name || returnDestination}
              returnDate={returnDate}
              returnTime={returnTime}
              returnArrivalTime={returnArrivalTime}
              formatDate={formatDate}
              formatTime={formatTime}
            />
            <PaymentMethodSection />
            <FormActionButtons 
              passengerInfos={passengerInfos}
              adults={adults}
              children={children}
              validatePassengers={validatePassengers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInformationSection({
  passengerLabel,
  passengerIndex,
  totalPassengers,
  passengerInfo,
  onChange,
  onPrev,
  onNext,
}: {
  passengerLabel: string;
  passengerIndex: number;
  totalPassengers: number;
  passengerInfo: {
    firstName: string;
    lastName: string;
    middleInitial: string;
    contactNumber: string;
    email: string;
    sex: string;
    birthDate: string;
  };
  onChange: (field: keyof typeof passengerInfo, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader icon={FaUser} title="Personal Information" />
        {totalPassengers > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={passengerIndex === 0}
              className={`flex items-center justify-center rounded-full border border-[#dbe5ff] p-2 text-[#0047ab] transition ${
                passengerIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#f5f7fb]"
              }`}
              aria-label="Previous passenger"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold text-[#001d45]">
              {passengerLabel} ({passengerIndex + 1} of {totalPassengers})
            </div>
            <button
              type="button"
              onClick={onNext}
              disabled={passengerIndex === totalPassengers - 1}
              className={`flex items-center justify-center rounded-full border border-[#dbe5ff] p-2 text-[#0047ab] transition ${
                passengerIndex === totalPassengers - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#f5f7fb]"
              }`}
              aria-label="Next passenger"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField label="First Name" required>
          <input
            type="text"
            placeholder="Enter first name"
            value={passengerInfo.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Last Name" required>
          <input
            type="text"
            placeholder="Enter last name"
            value={passengerInfo.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="M.I (Optional)">
          <input
            type="text"
            placeholder="Enter middle initial"
            value={passengerInfo.middleInitial}
            onChange={(e) => onChange("middleInitial", e.target.value)}
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <ContactNumberField
          value={passengerInfo.contactNumber}
          onChange={(value) => onChange("contactNumber", value)}
        />
        <FormField label="Email Address" required>
          <input
            type="email"
            placeholder="Enter email address"
            value={passengerInfo.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Sex" required>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
              value={passengerInfo.sex}
              onChange={(e) => onChange("sex", e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7aa5]" />
          </div>
        </FormField>
        <FormField label="Date of Birth" required>
          <div className="relative">
            <input
              type="text"
              placeholder="December 15, 2000"
              value={passengerInfo.birthDate}
              onChange={(e) => onChange("birthDate", e.target.value)}
              className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 pr-10 text-base outline-none transition focus:border-[#0047ab]"
            />
            <FaCalendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6c7aa5]" />
          </div>
        </FormField>
      </div>
    </div>
  );
}

function FlightDetailsSection({
  isRoundTrip,
  origin,
  destination,
  departureDate,
  departureTime,
  departureArrivalTime,
  returnOrigin,
  returnDestination,
  returnDate,
  returnTime,
  returnArrivalTime,
  formatDate,
  formatTime,
}: {
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  departureArrivalTime: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate: string;
  returnTime?: string;
  returnArrivalTime?: string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
}) {
  const departureDateTime = departureDate && departureTime 
    ? `${formatDate(departureDate)} • ${formatTime(departureTime)} - ${formatTime(departureArrivalTime)}`
    : formatDate(departureDate);
  
  const returnDateTime = returnDate && returnTime && returnArrivalTime
    ? `${formatDate(returnDate)} • ${formatTime(returnTime)} - ${formatTime(returnArrivalTime)}`
    : formatDate(returnDate);

  return (
    <div className="mb-8">
      <SectionHeader icon={FaLocationDot} title="Flight Details" />
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField label="From" required>
          <input
            type="text"
            value={origin}
            readOnly
            className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Destination" required>
          <input
            type="text"
            value={destination}
            readOnly
            className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Departure Date" required>
          <div className="relative">
            <input
              type="text"
              value={departureDateTime}
              readOnly
              className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 pr-10 text-base outline-none transition focus:border-[#0047ab]"
            />
            <FaCalendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6c7aa5]" />
          </div>
        </FormField>
        <FormField label="Return From" required>
          <input
            type="text"
            value={returnOrigin || ''}
            readOnly
            className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Return Destination" required>
          <input
            type="text"
            value={returnDestination || ''}
            readOnly
            className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
          />
        </FormField>
        <FormField label="Return Date" required>
          <div className="relative">
            <input
              type="text"
              value={returnDateTime || returnDate || ''}
              readOnly
              className="w-full rounded-xl border border-[#dbe5ff] bg-[#f5f7fb] px-4 py-3 pr-10 text-base outline-none transition focus:border-[#0047ab]"
            />
            <FaCalendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6c7aa5]" />
          </div>
        </FormField>
      </div>
    </div>
  );
}

function PaymentMethodSection() {
  return (
    <div>
      <SectionHeader icon={FaCreditCard} title="Payment Method" />
      <div className="mt-6 space-y-5">
        <FormField label="Select Payment Method" required>
          <div className="relative">
            <select className="w-full appearance-none rounded-xl border border-[#dbe5ff] px-4 py-3 text-base text-[#6c7aa5] outline-none transition focus:border-[#0047ab]">
              <option>Choose payment option</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>PayPal</option>
              <option>Bank Transfer</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7aa5]" />
          </div>
        </FormField>
        <PrivacyPolicyCheckbox />
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff]">
        <Icon className="h-5 w-5 text-[#0047ab]" />
      </div>
      <h2 className="text-xl font-bold text-[#001d45]">{title}</h2>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function ContactNumberField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>
        Contact Number<span className="text-red-500">*</span>
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-[#dbe5ff] bg-white px-4 py-3 transition focus-within:border-[#0047ab]">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Flag country="PH" size={20} />
        </div>
        <select className="shrink-0 appearance-none border-none bg-transparent text-base font-semibold text-[#001d45] outline-none">
          <option>(+63)</option>
        </select>
        <input
          type="tel"
          placeholder="912 345 6789"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-base outline-none"
        />
      </div>
    </label>
  );
}

function PrivacyPolicyCheckbox() {
  return (
    <label className="flex items-start gap-3 text-sm text-[#4a5b82]">
      <input
        type="checkbox"
        className="mt-1 rounded border-[#dbe5ff]"
      />
      <span>
        I confirm that I have read, understood, and agree to the updated Omnira Airlines Privacy Policy. I consent to the collection, use, processing and sharing of my personal information in accordance therewith.
      </span>
    </label>
  );
}

function FormActionButtons({
  passengerInfos,
  adults,
  children,
  validatePassengers,
}: {
  passengerInfos: Array<{
    firstName: string;
    lastName: string;
    middleInitial: string;
    contactNumber: string;
    email: string;
    sex: string;
    birthDate: string;
  }>;
  adults: number;
  children: number;
  validatePassengers: () => { isValid: boolean; errors: string[] };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleBack = () => {
    const params = new URLSearchParams();
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');

    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    if (departureDate) params.set('departureDate', departureDate);
    if (returnDate) params.set('returnDate', returnDate);
    if (adultsParam) params.set('adults', adultsParam);
    if (childrenParam) params.set('children', childrenParam);

    window.location.href = `/search-flights?${params.toString()}`;
  };

  const handleContinueToAddOns = async () => {
    setValidationError(null);
    
    const validation = validatePassengers();
    if (!validation.isValid) {
      setValidationError(validation.errors.join('. '));
      return;
    }

    setIsSaving(true);

    try {
      const passengersToSave = passengerInfos.map((passenger, index) => {
        const passengerType = index < adults ? 'adult' : 'child';
        return {
          firstName: passenger.firstName.trim(),
          lastName: passenger.lastName.trim(),
          middleInitial: passenger.middleInitial?.trim() || undefined,
          email: passenger.email.trim(),
          contactNumber: passenger.contactNumber?.trim() || undefined,
          sex: passenger.sex,
          birthDate: passenger.birthDate,
          passengerType,
        };
      });

      const result = await savePassengersAction(passengersToSave);

      if (!result.success || !result.passengerIds) {
        setValidationError(result.error || 'Failed to save passenger details');
        setIsSaving(false);
        return;
      }

      const params = new URLSearchParams();
      
      const departureFlightId = searchParams.get('departureFlightId') || '';
      const returnFlightId = searchParams.get('returnFlightId') || '';
      const flightId = searchParams.get('flightId') || '';
      
      const isRoundTrip = departureFlightId !== '' && returnFlightId !== '';
      
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
      
      if (isRoundTrip) {
        if (departureFlightId) {
          params.set('departingFlightId', departureFlightId);
        }
        if (returnFlightId) {
          params.set('returningFlightId', returnFlightId);
        }
      } else {
        if (flightId) {
          params.set('departingFlightId', flightId);
        }
      }
      
      params.set('passengerIds', JSON.stringify(result.passengerIds));
      
      router.push(`/add-ons?${params.toString()}`);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to save passenger details');
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-8 space-y-4 border-t border-[#dbe5ff] pt-6">
      {validationError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-semibold text-red-800">Validation Error</p>
          <p className="text-sm text-red-700 mt-1">{validationError}</p>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSaving}
          className="rounded-lg border border-[#dbe5ff] bg-white px-8 py-3 text-sm font-semibold text-[#6c7aa5] transition hover:bg-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinueToAddOns}
          disabled={isSaving}
          className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function BookingSummaryModal({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#6c7aa5] transition hover:bg-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
          aria-label="Close modal"
        >
          <FaXmark className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto rounded-lg bg-white p-6">
          <h2 className="mb-6 text-2xl font-bold text-[#001d45]">Booking Summary</h2>

          <div className="space-y-4">
            <FlightSummaryItem
              route="CGY - MNL"
              dateTime="01 Dec 2025 • 6:00 AM - 7:30 AM"
              passenger="Adult 1"
              price="PHP 1,687.72"
            />
            
            <div className="border-t border-[#dbe5ff]" />
            
            <FlightSummaryItem
              route="CGY - MNL"
              dateTime="05 Dec 2025 • 6:00 AM - 7:30 AM"
              passenger="Adult 1"
              price="PHP 6,687.72"
            />
            
            <div className="border-t border-[#dbe5ff]" />
            
            <div className="space-y-3">
              <div>
                <p className="text-base font-semibold text-[#0047ab]">All Flights</p>
                <p className="mt-1 text-sm text-[#6c7aa5]">
                  The following are applied across all flights
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#001d45]">Taxes and Fees</p>
                <button
                  onClick={() => setShowTaxDetails(!showTaxDetails)}
                  className="flex items-center gap-1 text-sm font-semibold text-[#0047ab] transition hover:text-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
                >
                  {showTaxDetails ? "Hide Details" : "Show Details"}
                  {showTaxDetails ? (
                    <FaChevronUp className="h-3 w-3" />
                  ) : (
                    <FaChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              
              {showTaxDetails && (
                <div className="mt-4 space-y-2 border-t border-[#dbe5ff] pt-4">
                  <TaxFeeItem name="Administrative Fee" amount="PHP 900.00" />
                  <TaxFeeItem name="Fuel Surcharge" amount="PHP 592.00" />
                  <TaxFeeItem name="Aviation Security Fee" amount="PHP 15.00" />
                  <TaxFeeItem
                    name="CGY Domestic Passenger Service Charge"
                    amount="PHP 300.00"
                  />
                  <TaxFeeItem
                    name="Domestic Passenger Service Charge - ASF"
                    amount="PHP 15.00"
                  />
                  <TaxFeeItem
                    name="MNL Domestic Passenger Service Charge"
                    amount="PHP 375.00"
                  />
                  <TaxFeeItem name="PH Value Added Tax" amount="PHP 1,120.80" />
                  <TaxFeeItem name="VAT for Add-ons" amount="PHP 108.00" />
                  
                  <div className="mt-4 flex items-center justify-between border-t border-[#dbe5ff] pt-3">
                    <p className="text-sm font-semibold text-[#001d45]">Subtotal</p>
                    <p className="text-sm font-semibold text-[#001d45]">PHP 3,425.80</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-[#dbe5ff]" />
            
            <div className="flex items-center justify-between rounded-lg bg-[#eef2ff] px-4 py-3">
              <p className="text-xl font-bold text-[#0047ab]">Total</p>
              <p className="text-xl font-bold text-[#0047ab]">PHP 12,173.80</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onContinue();
              }}
              className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
            >
              Continue to Add Ons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightSummaryItem({
  route,
  dateTime,
  passenger,
  price,
}: {
  route: string;
  dateTime: string;
  passenger: string;
  price: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-base font-semibold text-[#0047ab]">{route}</p>
        <p className="mt-1 text-sm text-[#6c7aa5]">{dateTime}</p>
        <p className="mt-2 text-sm font-semibold text-[#001d45]">{passenger}</p>
      </div>
      <p className="ml-4 text-base font-semibold text-[#0047ab]">{price}</p>
    </div>
  );
}

function TaxFeeItem({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#001d45]">{name}</p>
      <p className="text-sm text-[#001d45]">{amount}</p>
    </div>
  );
}

