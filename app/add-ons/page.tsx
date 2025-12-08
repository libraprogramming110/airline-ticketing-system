/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingProgressIndicator from "@/components/booking-progress-indicator";
import SeatSelectionModal from "@/components/seat-selection-modal";
import { lockSeatsAction } from "@/server/actions/lockSeat";
import { processPaymentAction } from "@/server/actions/processPayment";
import {
  FaCircleCheck,
  FaClipboardList,
  FaPaperPlane,
  FaSuitcase,
  FaChair,
  FaUtensils,
  FaShield,
  FaPlane,
  FaChevronRight,
  FaXmark,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";

export default function AddOnsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const departingFlightId = searchParams.get('departingFlightId') || '';
  const returningFlightId = searchParams.get('returningFlightId') || '';
  const departureCabinClass = searchParams.get('departureCabinClass') || '';
  const returnCabinClass = searchParams.get('returnCabinClass') || '';
  const cabinClass = searchParams.get('cabinClass') || '';
  const isRoundTrip = !!returningFlightId;

  const handleContinue = () => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    router.push(`/confirmation?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    router.push(`/passenger-details?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <HeaderSection />
      <BookingProgressIndicator currentStep={3} />
      <AddOnsContent 
        onContinue={handleContinue} 
        onBack={handleBack}
        adults={adults}
        children={children}
        departingFlightId={departingFlightId}
        returningFlightId={returningFlightId || undefined}
        departureCabinClass={departureCabinClass || cabinClass}
        returnCabinClass={returnCabinClass}
        isRoundTrip={isRoundTrip}
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

type SelectedAddOn = {
  name: string;
  price: number;
  category: string;
};

function AddOnsContent({
  onContinue,
  onBack,
  adults,
  children,
  departingFlightId,
  returningFlightId,
  departureCabinClass,
  returnCabinClass,
  isRoundTrip,
}: {
  onContinue: () => void;
  onBack: () => void;
  adults: number;
  children: number;
  departingFlightId: string;
  returningFlightId?: string;
  departureCabinClass?: string;
  returnCabinClass?: string;
  isRoundTrip: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [departureSeats, setDepartureSeats] = useState<Array<{ id: string; price: number }>>([]);
  const [returnSeats, setReturnSeats] = useState<Array<{ id: string; price: number }>>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const handleBookingSummary = async () => {
    const totalSeats = departureSeats.length + (isRoundTrip ? returnSeats.length : 0);
    if (totalSeats === 0) {
      setIsModalOpen(true);
      return;
    }

    if (!departingFlightId) {
      setLockError('Flight information is missing');
      return;
    }

    if (isRoundTrip && returnSeats.length === 0) {
      setLockError('Please select seats for your return flight');
      return;
    }

    setIsLocking(true);
    setLockError(null);

    try {
      const allSeatIds = [...departureSeats.map((s) => s.id), ...(isRoundTrip ? returnSeats.map((s) => s.id) : [])];
      const allSeats = [...departureSeats, ...(isRoundTrip ? returnSeats : [])];
      
      const formData = new FormData();
      formData.append('seatIds', JSON.stringify(allSeatIds));
      formData.append('departingFlightId', departingFlightId);
      formData.append('departureSeatIds', JSON.stringify(departureSeats.map((s) => s.id)));
      if (returningFlightId && isRoundTrip) {
        formData.append('returningFlightId', returningFlightId);
        formData.append('returnSeatIds', JSON.stringify(returnSeats.map((s) => s.id)));
      }
      formData.append('adultsCount', adults.toString());
      formData.append('childrenCount', children.toString());
      formData.append('selectedSeats', JSON.stringify(allSeats));
      formData.append('selectedAddOns', JSON.stringify(selectedAddOns));

      const result = await lockSeatsAction(formData);

      if (result.success && result.bookingReference && result.bookingId) {
        setBookingId(result.bookingId);
        setBookingReference(result.bookingReference);
        setIsModalOpen(true);
      } else {
        setLockError(result.error || 'Failed to lock seats');
      }
    } catch (error) {
      setLockError(error instanceof Error ? error.message : 'Failed to lock seats');
    } finally {
      setIsLocking(false);
    }
  };

  const handleConfirm = async () => {
    if (!bookingId) {
      setIsModalOpen(false);
      onContinue();
      return;
    }

    setIsModalOpen(false);
    onContinue();
  };

  const handleSeatSelection = () => {
    setIsSeatModalOpen(true);
  };

  const handleSeatConfirm = (departure: Array<{ id: string; price: number }>, returnSeats: Array<{ id: string; price: number }>) => {
    setDepartureSeats(departure);
    if (isRoundTrip) {
      setReturnSeats(returnSeats);
    }
  };

  const handleAddOnChange = (category: string, name: string | null, price: number | null) => {
    setSelectedAddOns((prev) => {
      const filtered = prev.filter((addon) => addon.category !== category);
      if (name && price !== null) {
        return [...filtered, { name, price, category }];
      }
      return filtered;
    });
  };

  return (
    <>
      <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#001d45]">Add Ons</h1>
            <p className="mt-2 text-sm text-[#6c7aa5]">
              Enhance your travel experience with our optional add-ons
            </p>
          </div>

          <div className="space-y-6">
            <AddOnSection
              icon={FaSuitcase}
              title="Extra Baggage"
              description="Add additional checked baggage allowance"
              category="Extra Baggage"
              options={[
                { name: "10kg Extra Baggage", price: 500 },
                { name: "20kg Extra Baggage", price: 900 },
                { name: "30kg Extra Baggage", price: 1200 },
              ]}
              onSelectionChange={handleAddOnChange}
            />

            <SeatSelectionSection 
              onSelectSeat={handleSeatSelection}
              departureSeats={departureSeats.map((s) => s.id)}
              returnSeats={isRoundTrip ? returnSeats.map((s) => s.id) : []}
              isRoundTrip={isRoundTrip}
            />

            <AddOnSection
              icon={FaUtensils}
              title="Meal Selection"
              description="Pre-order your in-flight meal"
              category="Meal Selection"
              options={[
                { name: "Vegetarian Meal", price: 200 },
                { name: "Halal Meal", price: 200 },
                { name: "Special Meal", price: 250 },
              ]}
              onSelectionChange={handleAddOnChange}
            />

            <AddOnSection
              icon={FaShield}
              title="Travel Insurance"
              description="Protect your journey with travel insurance"
              category="Travel Insurance"
              options={[
                { name: "Basic Coverage", price: 800 },
                { name: "Premium Coverage", price: 1500 },
              ]}
              onSelectionChange={handleAddOnChange}
            />

            <AddOnSection
              icon={FaPlane}
              title="Priority Services"
              description="Enjoy priority check-in and boarding"
              category="Priority Services"
              options={[
                { name: "Priority Check-in", price: 400 },
                { name: "Priority Boarding", price: 300 },
                { name: "Priority Bundle", price: 600 },
              ]}
              onSelectionChange={handleAddOnChange}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#dbe5ff] pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-[#dbe5ff] bg-white px-8 py-3 text-sm font-semibold text-[#6c7aa5] transition hover:bg-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleBookingSummary}
              disabled={isLocking}
              className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocking ? 'Locking Seats...' : 'Booking Summary'}
            </button>
            {lockError && (
              <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{lockError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <BookingSummaryModal
          onClose={() => setIsModalOpen(false)}
          onContinue={handleConfirm}
          selectedAddOns={selectedAddOns}
          departureSeats={departureSeats}
          returnSeats={isRoundTrip ? returnSeats : []}
          isRoundTrip={isRoundTrip}
          bookingId={bookingId}
          bookingReference={bookingReference}
        />
      )}
      <SeatSelectionModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        onConfirm={handleSeatConfirm}
        departingFlightId={departingFlightId}
        returningFlightId={returningFlightId}
        departureCabinClass={departureCabinClass}
        returnCabinClass={returnCabinClass}
        adults={adults}
        children={children}
        isRoundTrip={isRoundTrip}
        initialDepartureSeats={departureSeats}
        initialReturnSeats={returnSeats}
      />
    </>
  );
}

function AddOnSection({
  icon: Icon,
  title,
  description,
  category,
  options,
  onSelectionChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  category: string;
  options: Array<{ name: string; price: number }>;
  onSelectionChange: (category: string, name: string | null, price: number | null) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const selectOption = (name: string, price: number) => {
    if (selectedOption === name) {
      setSelectedOption(null);
      onSelectionChange(category, null, null);
    } else {
      setSelectedOption(name);
      onSelectionChange(category, name, price);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff]">
          <Icon className="h-6 w-6 text-[#0047ab]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#001d45]">{title}</h2>
          <p className="text-sm text-[#6c7aa5]">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOption === option.name;
          return (
            <button
              key={option.name}
              type="button"
              onClick={() => selectOption(option.name, option.price)}
              className={`w-full flex items-center justify-between rounded-xl border-2 p-4 transition ${
                isSelected
                  ? "border-[#0047ab] bg-[#eef2ff]"
                  : "border-[#dbe5ff] bg-white hover:border-[#0047ab]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-[#0047ab] bg-[#0047ab]"
                      : "border-[#6c7aa5] bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-base font-semibold text-[#001d45]">
                  {option.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#0047ab]">
                  {formatPrice(option.price)}
                </span>
                <FaChevronRight
                  className={`h-4 w-4 transition ${
                    isSelected ? "text-[#0047ab]" : "text-[#6c7aa5]"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SeatSelectionSection({
  onSelectSeat,
  departureSeats,
  returnSeats,
  isRoundTrip,
}: {
  onSelectSeat: () => void;
  departureSeats: string[];
  returnSeats: string[];
  isRoundTrip: boolean;
}) {
  const totalSeats = departureSeats.length + returnSeats.length;
  const allSelected = departureSeats.length > 0 && (!isRoundTrip || returnSeats.length > 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff]">
          <FaChair className="h-6 w-6 text-[#0047ab]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#001d45]">Seat Selection</h2>
          <p className="text-sm text-[#6c7aa5]">
            Choose your preferred seats {isRoundTrip && "for both flights"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelectSeat}
        className={`w-full flex items-center justify-between rounded-xl border-2 p-4 transition ${
          allSelected
            ? "border-[#0047ab] bg-[#eef2ff]"
            : "border-[#dbe5ff] bg-white hover:border-[#0047ab]/50 hover:bg-[#f5f7fb]"
        }`}
      >
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold text-[#001d45]">
            {allSelected
              ? `${totalSeats} seat${totalSeats > 1 ? "s" : ""} selected`
              : "Select Seats"}
          </span>
          {allSelected && isRoundTrip && (
            <span className="text-xs text-[#6c7aa5] mt-1">
              {departureSeats.length} departure, {returnSeats.length} return
            </span>
          )}
        </div>
        <FaChevronRight className="h-4 w-4 text-[#6c7aa5]" />
      </button>
    </div>
  );
}

function BookingSummaryModal({
  onClose,
  onContinue,
  selectedAddOns,
  departureSeats,
  returnSeats,
  isRoundTrip,
  bookingId,
  bookingReference,
}: {
  onClose: () => void;
  onContinue: () => void;
  selectedAddOns: SelectedAddOn[];
  departureSeats: Array<{ id: string; price: number }>;
  returnSeats: Array<{ id: string; price: number }>;
  isRoundTrip: boolean;
  bookingId: string | null;
  bookingReference: string | null;
}) {
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const flightSubtotal = 1687.72 + (isRoundTrip ? 6687.72 : 0);
  const departureSeatsSubtotal = departureSeats.reduce((sum, seat) => sum + seat.price, 0);
  const returnSeatsSubtotal = returnSeats.reduce((sum, seat) => sum + seat.price, 0);
  const seatsSubtotal = departureSeatsSubtotal + returnSeatsSubtotal;
  const addOnsSubtotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const taxesAndFees = 3425.80;
  const vatForAddOns = addOnsSubtotal * 0.12;
  const total = flightSubtotal + seatsSubtotal + addOnsSubtotal + taxesAndFees + vatForAddOns;

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
                <p className="text-base font-semibold text-[#0047ab]">Add Ons</p>
                <p className="mt-1 text-sm text-[#6c7aa5]">
                  Selected add-ons for your journey
                </p>
              </div>
              {departureSeats.length === 0 && returnSeats.length === 0 && selectedAddOns.length === 0 ? (
                <div className="text-sm text-[#6c7aa5]">
                  No add-ons selected
                </div>
              ) : (
                <div className="space-y-2">
                  {departureSeats.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-[#0047ab] uppercase mt-2">Departure Seats</p>
                      {departureSeats.map((seat) => (
                        <div
                          key={`dep-${seat.id}`}
                          className="flex items-center justify-between"
                        >
                          <p className="text-sm text-[#001d45]">Seat {seat.id}</p>
                          <p className="text-sm font-semibold text-[#001d45]">
                            {formatPrice(seat.price)}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                  {isRoundTrip && returnSeats.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-[#0047ab] uppercase mt-2">Return Seats</p>
                      {returnSeats.map((seat) => (
                        <div
                          key={`ret-${seat.id}`}
                          className="flex items-center justify-between"
                        >
                          <p className="text-sm text-[#001d45]">Seat {seat.id}</p>
                          <p className="text-sm font-semibold text-[#001d45]">
                            {formatPrice(seat.price)}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                  {selectedAddOns.map((addon) => (
                    <div
                      key={`${addon.category}-${addon.name}`}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm text-[#001d45]">{addon.name}</p>
                      <p className="text-sm font-semibold text-[#001d45]">
                        {formatPrice(addon.price)}
                      </p>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between border-t border-[#dbe5ff] pt-2">
                    <p className="text-sm font-semibold text-[#001d45]">Add-ons Subtotal</p>
                    <p className="text-sm font-semibold text-[#001d45]">
                      {formatPrice(seatsSubtotal + addOnsSubtotal)}
                    </p>
                  </div>
                </div>
              )}
            </div>

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
                  <TaxFeeItem
                    name="VAT for Add-ons"
                    amount={formatPrice(vatForAddOns)}
                  />

                  <div className="mt-4 flex items-center justify-between border-t border-[#dbe5ff] pt-3">
                    <p className="text-sm font-semibold text-[#001d45]">Subtotal</p>
                    <p className="text-sm font-semibold text-[#001d45]">
                      {formatPrice(taxesAndFees + vatForAddOns)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#dbe5ff]" />

            <div className="flex items-center justify-between rounded-lg bg-[#eef2ff] px-4 py-3">
              <p className="text-xl font-bold text-[#0047ab]">Total</p>
              <p className="text-xl font-bold text-[#0047ab]">{formatPrice(total)}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {bookingId && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#001d45] mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                    className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab] disabled:opacity-50"
                  >
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                {paymentError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  if (!bookingId) {
                    onClose();
                    onContinue();
                    return;
                  }

                  setIsProcessing(true);
                  setPaymentError(null);

                  try {
                    const formData = new FormData();
                    formData.append('bookingId', bookingId);
                    formData.append('paymentMethod', paymentMethod);

                    const result = await processPaymentAction(formData);

                    if (result.success) {
                      const params = new URLSearchParams();
                      searchParams.forEach((value, key) => {
                        params.set(key, value);
                      });
                      if (bookingReference) {
                        params.set('bookingReference', bookingReference);
                      }
                      router.push(`/confirmation?${params.toString()}`);
                    } else {
                      setPaymentError(result.error || 'Payment processing failed');
                      setIsProcessing(false);
                    }
                  } catch (error) {
                    setPaymentError(error instanceof Error ? error.message : 'Payment processing failed');
                    setIsProcessing(false);
                  }
                }}
                disabled={isProcessing}
                className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : 'Continue to Confirmation'}
              </button>
            </div>
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

