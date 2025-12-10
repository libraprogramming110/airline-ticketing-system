/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingProgressIndicator from "@/components/booking-progress-indicator";
import SeatSelectionModal from "@/components/seat-selection-modal";
import { lockSeatsAction } from "@/server/actions/lockSeat";
import { processPaymentAction } from "@/server/actions/processPayment";
import { supabase } from "@/lib/supabase/client";
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
  return (
    <Suspense fallback={<div className="p-4 text-[#001d45]">Loading add-ons...</div>}>
      <AddOnsPageContent />
    </Suspense>
  );
}

function AddOnsPageContent() {
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
  const passengerIdsParam = searchParams.get('passengerIds');
  const passengerIds = passengerIdsParam ? JSON.parse(passengerIdsParam) : [];

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
        passengerIds={passengerIds}
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

type PassengerMeta = {
  id: string;
  label: string;
};

type SeatSelectionsByPassenger = Record<
  string,
  {
    status: 'selected' | 'pending';
    departureSeatIds: string[];
    returnSeatIds: string[];
  }
>;

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
  passengerIds,
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
  passengerIds: string[];
}) {
  // Build passenger list (use provided IDs or generate placeholders)
  const fallbackTotal = Math.max(1, adults + children);
  const initialPassengers: PassengerMeta[] = (passengerIds.length > 0 ? passengerIds : Array.from({ length: fallbackTotal }, (_, i) => `passenger-${i + 1}`)).map(
    (id, index) => ({
      id,
      label: `Passenger ${index + 1}`,
    })
  );

  const [passengers, setPassengers] = useState<PassengerMeta[]>(initialPassengers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [departureSeats, setDepartureSeats] = useState<Array<{ id: string; price: number }>>([]);
  const [returnSeats, setReturnSeats] = useState<Array<{ id: string; price: number }>>([]);
  const [seatSelectionsByPassenger, setSeatSelectionsByPassenger] = useState<SeatSelectionsByPassenger>(() =>
    initialPassengers.reduce((acc, p) => {
      acc[p.id] = { status: 'pending', departureSeatIds: [], returnSeatIds: [] };
      return acc;
    }, {} as SeatSelectionsByPassenger)
  );
  const [selectedAddOnsByPassenger, setSelectedAddOnsByPassenger] = useState<Record<string, SelectedAddOn[]>>(() =>
    passengers.reduce((acc, p) => {
      acc[p.id] = [];
      return acc;
    }, {} as Record<string, SelectedAddOn[]>)
  );
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [departingFlight, setDepartingFlight] = useState<{
    id: string;
    origin: string;
    destination: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
  } | null>(null);
  const [returningFlight, setReturningFlight] = useState<{
    id: string;
    origin: string;
    destination: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
  } | null>(null);
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [applyToAllChecked, setApplyToAllChecked] = useState(false);
  const totalPassengers = passengers.length;

  // Fetch passenger names when IDs are available
  useEffect(() => {
    const fetchPassengers = async () => {
      if (!passengerIds.length) return;
      const { data, error } = await supabase
        .from('passengers')
        .select('id, first_name, last_name')
        .in('id', passengerIds);

      if (error || !data) {
        console.error('Failed to fetch passengers:', error?.message);
        return;
      }

      const nameMap = new Map<string, string>();
      data.forEach((p) => {
        const firstName = (p as any).first_name || '';
        const lastName = (p as any).last_name || '';
        const label = firstName ? firstName : lastName ? lastName : '';
        nameMap.set((p as any).id, label || '');
      });

      setPassengers((prev) => {
        // Preserve ordering based on passengerIds
        return passengerIds.map((id, idx) => ({
          id,
          label: nameMap.get(id) || prev.find((p) => p.id === id)?.label || `Passenger ${idx + 1}`,
        }));
      });
    };

    fetchPassengers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengerIds.join(',')]);

  useEffect(() => {
    setSeatSelectionsByPassenger((prev) => {
      const next: SeatSelectionsByPassenger = { ...prev };
      passengers.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = { status: 'pending', departureSeatIds: [], returnSeatIds: [] };
        }
      });
      return next;
    });
  }, [passengers]);

  const handleBookingSummary = async () => {
    if (!departingFlightId) {
      setLockError('Flight information is missing');
      return;
    }

    if (passengerIds.length === 0) {
      setLockError('Passenger details are required. Please go back and fill in passenger information.');
      return;
    }

    setIsLocking(true);
    setLockError(null);

    try {
      const allSeatIds = [...departureSeats.map((s) => s.id), ...(isRoundTrip ? returnSeats.map((s) => s.id) : [])];
      const allSeats = [...departureSeats, ...(isRoundTrip ? returnSeats : [])];

      // Flatten add-ons for legacy compatibility
      const allAddOns = Object.values(selectedAddOnsByPassenger).flat();
      
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
      formData.append('selectedAddOns', JSON.stringify(allAddOns)); // legacy flat list
      formData.append('selectedAddOnsByPassenger', JSON.stringify(selectedAddOnsByPassenger));
      formData.append('seatSelectionsByPassenger', JSON.stringify(seatSelectionsByPassenger));
      if (passengerIds.length > 0) {
        formData.append('passengerIds', JSON.stringify(passengerIds));
      }

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

  const handlePassengerSelect = (index: number) => {
    setCurrentPassengerIndex(index);
  };

  const handleAddOnChangeForPassenger = (passengerId: string, category: string, name: string | null, price: number | null) => {
    setSelectedAddOnsByPassenger((prev) => {
      const current = prev[passengerId] || [];
      const filtered = current.filter((addon) => addon.category !== category);
      const updated = name && price !== null ? [...filtered, { name, price, category }] : filtered;
      const nextState = { ...prev, [passengerId]: updated };

      // If selections diverge, uncheck "apply to all"
      const selections = Object.values(nextState);
      const allSame =
        selections.length > 0 &&
        selections.every((sel) => sel.length === selections[0].length && sel.every((a, idx) => {
          const base = selections[0][idx];
          return base && a && base.name === a.name && base.category === a.category && base.price === a.price;
        }));

      if (!allSame && applyToAllChecked) {
        setApplyToAllChecked(false);
      }

      return nextState;
    });
  };

  const applyCurrentSelectionToAll = () => {
    const currentPassenger = passengers[currentPassengerIndex];
    const currentSelection = selectedAddOnsByPassenger[currentPassenger.id] || [];
    setSelectedAddOnsByPassenger(
      passengers.reduce((acc, p) => {
        acc[p.id] = [...currentSelection];
        return acc;
      }, {} as Record<string, SelectedAddOn[]>)
    );
  };

  const currentPassenger = passengers[currentPassengerIndex];
  const currentPassengerAddOns = selectedAddOnsByPassenger[currentPassenger.id] || [];
  const allAddOnsFlat = Object.values(selectedAddOnsByPassenger).flat();
  const perPassengerSubtotal = currentPassengerAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const totalAddOns = allAddOnsFlat.reduce((sum, addon) => sum + addon.price, 0);

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoadingFlights(true);
      try {
        if (departingFlightId) {
          const { data: depFlight, error: depError } = await supabase
            .from('flights')
            .select('id, origin, destination, departure_date, departure_time, arrival_time, price')
            .eq('id', departingFlightId)
            .single();

          if (depError || !depFlight) {
            console.error('Error fetching departing flight:', depError);
          } else {
            setDepartingFlight(depFlight);
          }
        }

        if (returningFlightId && isRoundTrip) {
          const { data: retFlight, error: retError } = await supabase
            .from('flights')
            .select('id, origin, destination, departure_date, departure_time, arrival_time, price')
            .eq('id', returningFlightId)
            .single();

          if (retError || !retFlight) {
            console.error('Error fetching returning flight:', retError);
          } else {
            setReturningFlight(retFlight);
          }
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoadingFlights(false);
      }
    };

    if (departingFlightId) {
      fetchFlights();
    }
  }, [departingFlightId, returningFlightId, isRoundTrip]);

  const handleSeatSelection = () => {
    setIsSeatModalOpen(true);
  };

  const handleSeatConfirm = (payload: {
    seatSelectionsByPassenger: SeatSelectionsByPassenger;
    departureSeats: Array<{ id: string; price: number }>;
    returnSeats: Array<{ id: string; price: number }>;
  }) => {
    setSeatSelectionsByPassenger(payload.seatSelectionsByPassenger);
    setDepartureSeats(payload.departureSeats);
    setReturnSeats(isRoundTrip ? payload.returnSeats : []);
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

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {passengers.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePassengerSelect(idx)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    currentPassengerIndex === idx
                      ? "bg-[#0047ab] text-white"
                      : "bg-white text-[#0047ab] border border-[#dbe5ff] hover:bg-[#f5f7fb]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-[#001d45] font-semibold ml-auto">
              {currentPassenger.label} add-ons: {perPassengerSubtotal > 0 ? `₱${perPassengerSubtotal.toLocaleString()}` : "None"}
            </div>
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
              onSelectionChange={(category, name, price) =>
                handleAddOnChangeForPassenger(currentPassenger.id, category, name, price)
              }
              selectedAddOns={currentPassengerAddOns}
            />

            <SeatSelectionSection 
              onSelectSeat={handleSeatSelection}
              departureSeats={departureSeats.map((s) => s.id)}
              returnSeats={isRoundTrip ? returnSeats.map((s) => s.id) : []}
              isRoundTrip={isRoundTrip}
              passengers={passengers}
              seatSelectionsByPassenger={seatSelectionsByPassenger}
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
              onSelectionChange={(category, name, price) =>
                handleAddOnChangeForPassenger(currentPassenger.id, category, name, price)
              }
              selectedAddOns={currentPassengerAddOns}
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
              onSelectionChange={(category, name, price) =>
                handleAddOnChangeForPassenger(currentPassenger.id, category, name, price)
              }
              selectedAddOns={currentPassengerAddOns}
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
              onSelectionChange={(category, name, price) =>
                handleAddOnChangeForPassenger(currentPassenger.id, category, name, price)
              }
              selectedAddOns={currentPassengerAddOns}
            />

            {passengers.length > 1 && (
              <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#0047ab]">
                <input
                  type="checkbox"
                  checked={applyToAllChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setApplyToAllChecked(checked);
                    if (checked) {
                      applyCurrentSelectionToAll();
                    }
                  }}
                  className="h-4 w-4 rounded border-[#dbe5ff] text-[#0047ab] focus:ring-[#0047ab]"
                />
                <span>Apply this selection to all passengers</span>
              </label>
            )}
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
          selectedAddOns={allAddOnsFlat}
          departureSeats={departureSeats}
          returnSeats={isRoundTrip ? returnSeats : []}
          isRoundTrip={isRoundTrip}
          bookingId={bookingId}
          bookingReference={bookingReference}
          departingFlight={departingFlight}
          returningFlight={returningFlight}
          adults={adults}
          children={children}
          passengers={passengers}
          seatSelectionsByPassenger={seatSelectionsByPassenger}
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
        passengers={passengers}
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
  selectedAddOns,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  category: string;
  options: Array<{ name: string; price: number }>;
  onSelectionChange: (category: string, name: string | null, price: number | null) => void;
  selectedAddOns: SelectedAddOn[];
}) {
  const selectOption = (name: string, price: number) => {
    const isSelected = selectedAddOns.some((addon) => addon.category === category && addon.name === name);
    if (isSelected) {
      onSelectionChange(category, null, null);
    } else {
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
          const isSelected = selectedAddOns.some((addon) => addon.category === category && addon.name === option.name);
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
  passengers,
  seatSelectionsByPassenger,
}: {
  onSelectSeat: () => void;
  departureSeats: string[];
  returnSeats: string[];
  isRoundTrip: boolean;
  passengers: PassengerMeta[];
  seatSelectionsByPassenger: SeatSelectionsByPassenger;
}) {
  const totalSeats = departureSeats.length + returnSeats.length;
  const anySelected = totalSeats > 0;
  const pendingCount = passengers.filter((p) => seatSelectionsByPassenger[p.id]?.status === 'pending').length;

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
          anySelected
            ? "border-[#0047ab] bg-[#eef2ff]"
            : "border-[#dbe5ff] bg-white hover:border-[#0047ab]/50 hover:bg-[#f5f7fb]"
        }`}
      >
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold text-[#001d45]">
            {anySelected
              ? `${totalSeats} seat${totalSeats > 1 ? "s" : ""} selected`
              : "Select Seats"}
          </span>
          {isRoundTrip && anySelected && (
            <span className="text-xs text-[#6c7aa5] mt-1">
              {departureSeats.length} departure, {returnSeats.length} return
            </span>
          )}
          {pendingCount > 0 && (
            <span className="text-xs text-[#6c7aa5] mt-1">
              {pendingCount} passenger{pendingCount === 1 ? '' : 's'} pending assignment
            </span>
          )}
        </div>
        <FaChevronRight className="h-4 w-4 text-[#6c7aa5]" />
      </button>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {passengers.map((p) => {
          const choice = seatSelectionsByPassenger[p.id];
          const depSeat = choice?.departureSeatIds[0];
          const retSeat = choice?.returnSeatIds[0];
          const isPending = choice?.status === 'pending';
          return (
            <div key={p.id} className="rounded-lg border border-[#dbe5ff] bg-[#f8faff] px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#001d45]">{p.label}</span>
                <span className={`text-xs font-semibold ${isPending ? 'text-[#a16207]' : 'text-[#0047ab]'}`}>
                  {isPending ? 'Pending' : 'Selected'}
                </span>
              </div>
              <div className="text-xs text-[#6c7aa5] mt-1">
                {isPending && 'Seat assignment pending'}
                {!isPending && (
                  <>
                    {depSeat && <span className="mr-2">Departure: {depSeat}</span>}
                    {isRoundTrip && retSeat && <span>Return: {retSeat}</span>}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
  departingFlight,
  returningFlight,
  adults,
  children,
  passengers,
  seatSelectionsByPassenger,
}: {
  onClose: () => void;
  onContinue: () => void;
  selectedAddOns: SelectedAddOn[];
  departureSeats: Array<{ id: string; price: number }>;
  returnSeats: Array<{ id: string; price: number }>;
  isRoundTrip: boolean;
  bookingId: string | null;
  bookingReference: string | null;
  departingFlight: {
    id: string;
    origin: string;
    destination: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
  } | null;
  returningFlight: {
    id: string;
    origin: string;
    destination: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
  } | null;
  adults: number;
  children: number;
  passengers: PassengerMeta[];
  seatSelectionsByPassenger: SeatSelectionsByPassenger;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const totalPassengers = adults + children;
  const passengerLabel = totalPassengers === 1 
    ? `${adults > 0 ? 'Adult' : 'Child'} 1`
    : `${adults} ${adults === 1 ? 'Adult' : 'Adults'}${children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''}`;

  const departingFlightPrice = departingFlight ? parseFloat(departingFlight.price.toString()) * totalPassengers : 0;
  const returningFlightPrice = returningFlight && isRoundTrip ? parseFloat(returningFlight.price.toString()) * totalPassengers : 0;
  const flightSubtotal = departingFlightPrice + returningFlightPrice;
  
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
            {!departingFlight ? (
              <div className="text-center py-4 text-[#6c7aa5]">
                Loading flight information...
              </div>
            ) : (
              <>
                <FlightSummaryItem
                  route={`${departingFlight.origin} - ${departingFlight.destination}`}
                  dateTime={`${formatDate(departingFlight.departure_date)} • ${formatTime(departingFlight.departure_time)} - ${formatTime(departingFlight.arrival_time)}`}
                  passenger={passengerLabel}
                  price={formatPrice(departingFlightPrice)}
                />
                {isRoundTrip && returningFlight && (
                  <>
                    <div className="border-t border-[#dbe5ff]" />
                    <FlightSummaryItem
                      route={`${returningFlight.origin} - ${returningFlight.destination}`}
                      dateTime={`${formatDate(returningFlight.departure_date)} • ${formatTime(returningFlight.departure_time)} - ${formatTime(returningFlight.arrival_time)}`}
                      passenger={passengerLabel}
                      price={formatPrice(returningFlightPrice)}
                    />
                  </>
                )}
                <div className="border-t border-[#dbe5ff]" />
              </>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-base font-semibold text-[#0047ab]">Add Ons</p>
                <p className="mt-1 text-sm text-[#6c7aa5]">
                  Selected add-ons for your journey
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#0047ab] uppercase">Seat Assignments</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {passengers.map((p) => {
                    const choice = seatSelectionsByPassenger[p.id];
                    const isPending = choice?.status === 'pending';
                    return (
                      <div key={p.id} className="rounded-lg border border-[#dbe5ff] bg-[#f8faff] p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#001d45]">{p.label}</span>
                          <span className={`text-xs font-semibold ${isPending ? 'text-[#a16207]' : 'text-[#0047ab]'}`}>
                            {isPending ? 'Pending' : 'Selected'}
                          </span>
                        </div>
                        <div className="text-xs text-[#6c7aa5] mt-1">
                          {isPending && 'Seat assignment pending'}
                          {!isPending && (
                            <>
                              {choice?.departureSeatIds[0] && <span className="mr-2">Departure: {choice.departureSeatIds[0]}</span>}
                              {isRoundTrip && choice?.returnSeatIds[0] && <span>Return: {choice.returnSeatIds[0]}</span>}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {departureSeats.length === 0 && returnSeats.length === 0 && selectedAddOns.length === 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-[#6c7aa5]">
                    No add-ons selected
                  </div>
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                    <p className="text-sm font-semibold text-yellow-800">Seat Assignment Pending</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Seats will be randomly assigned when the flight is fully booked.
                    </p>
                  </div>
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
                  {selectedAddOns.map((addon, idx) => (
                    <div
                      key={`${addon.category}-${addon.name}-${idx}`}
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

