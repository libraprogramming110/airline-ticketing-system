"use client";

import { useState, useEffect, useCallback } from "react";
import { FaXmark, FaChair, FaWindowMaximize, FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getSeatsAction } from "@/server/actions/getSeats";

type SeatStatus = "available" | "unavailable" | "selected" | "held";
type SeatType = "window" | "middle" | "aisle";
type CabinClass = "first" | "business" | "economy";

interface Seat {
  id: string;
  row: number;
  letter: string;
  cabinClass: CabinClass;
  status: SeatStatus;
  type: SeatType;
  price: number;
}

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (departureSeats: Array<{ id: string; price: number }>, returnSeats: Array<{ id: string; price: number }>) => void;
  departingFlightId?: string;
  returningFlightId?: string;
  departureCabinClass?: string;
  returnCabinClass?: string;
  adults?: number;
  children?: number;
  isRoundTrip?: boolean;
  initialDepartureSeats?: Array<{ id: string; price: number }>;
  initialReturnSeats?: Array<{ id: string; price: number }>;
}

function getRowRangeForCabin(cabinClass: CabinClass): { minRow: number; maxRow: number } {
  const rowRanges = {
    first: { minRow: 1, maxRow: 5 },
    business: { minRow: 6, maxRow: 15 },
    economy: { minRow: 16, maxRow: 40 },
  };
  return rowRanges[cabinClass];
}

function getSeatLettersForCabin(cabinClass: CabinClass): { left: string[]; right: string[] } {
  const configs = {
    first: { left: ["A"], right: ["B"] },
    business: { left: ["A", "B"], right: ["C", "D"] },
    economy: { left: ["A", "B", "C"], right: ["D", "E", "F"] },
  };
  return configs[cabinClass];
}

function isEmergencyExitRow(row: number, cabinClass: CabinClass): boolean {
  const exitRows = {
    first: [1, 5],
    business: [1, 5, 10],
    economy: [1, 5, 10, 15, 20, 25],
  };
  return exitRows[cabinClass].includes(row);
}

function parseSeatNumber(seatNumber: string): { row: number; letter: string } {
  const match = seatNumber.match(/^(\d+)([A-Z])$/);
  if (!match) {
    throw new Error(`Invalid seat number format: ${seatNumber}`);
  }
  return {
    row: parseInt(match[1], 10),
    letter: match[2],
  };
}

function getSeatType(letter: string, cabinClass: CabinClass): SeatType {
  if (cabinClass === "first") {
    return "window";
  } else if (cabinClass === "business") {
    if (letter === "A" || letter === "D") return "window";
    return "aisle";
  } else {
    if (letter === "A" || letter === "F") return "window";
    if (letter === "C" || letter === "D") return "aisle";
    return "middle";
  }
}

function calculateSeatPrice(
  cabinClass: CabinClass,
  seatType: SeatType,
  row: number
): number {
  const basePrices = {
    first: 2000,
    business: 800,
    economy: 300,
  };

  const typeMultipliers = {
    window: 1.2,
    aisle: 1.1,
    middle: 1.0,
  };

  const exitRowMultiplier = 1.3;
  const isExitRow = isEmergencyExitRow(row, cabinClass);

  const basePrice = basePrices[cabinClass];
  const typeMultiplier = typeMultipliers[seatType];
  const rowMultiplier = isExitRow ? exitRowMultiplier : 1.0;

  return Math.round(basePrice * typeMultiplier * rowMultiplier);
}

function mapDatabaseSeatsToComponentSeats(
  dbSeats: Array<{
    id: string;
    seat_number: string;
    cabin_class: string;
    status: "available" | "held" | "booked";
  }>,
  cabinClass: CabinClass
): Seat[] {
  const cabinClassMap: Record<string, CabinClass> = {
    Economy: "economy",
    "Business Class": "business",
    "First Class": "first",
  };

  const normalizedCabinClass = cabinClassMap[cabinClass] || cabinClass;

  return dbSeats.map((dbSeat) => {
    const { row, letter } = parseSeatNumber(dbSeat.seat_number);
    const seatType = getSeatType(letter, normalizedCabinClass);
    const price = calculateSeatPrice(normalizedCabinClass, seatType, row);

    let status: SeatStatus = "available";
    if (dbSeat.status === "booked") {
      status = "unavailable";
    } else if (dbSeat.status === "held") {
      status = "held";
    }

    return {
      id: dbSeat.id,
      row,
      letter,
      cabinClass: normalizedCabinClass,
      status,
      type: seatType,
      price,
    };
  });
}

function ExitMarker({ row }: { row: number }) {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div className="w-8"></div>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-md shadow-sm">
          <span className="text-sm font-bold text-red-600 uppercase tracking-wide">EXIT</span>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  departingFlightId,
  returningFlightId,
  departureCabinClass = "economy",
  returnCabinClass = "economy",
  adults = 1,
  children = 0,
  isRoundTrip = false,
  initialDepartureSeats = [],
  initialReturnSeats = [],
}: SeatSelectionModalProps) {
  const [currentSlide, setCurrentSlide] = useState<'departure' | 'return'>('departure');
  const [departureSeats, setDepartureSeats] = useState<Array<{ id: string; price: number }>>(initialDepartureSeats);
  const [returnSeats, setReturnSeats] = useState<Array<{ id: string; price: number }>>(initialReturnSeats);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [showSeatType, setShowSeatType] = useState(false);
  const [departureSeatsData, setDepartureSeatsData] = useState<Seat[]>([]);
  const [returnSeatsData, setReturnSeatsData] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  
  const currentSeats = currentSlide === 'departure' ? departureSeatsData : returnSeatsData;
  const currentSelectedSeats = currentSlide === 'departure' ? departureSeats : returnSeats;
  const currentFlightId = currentSlide === 'departure' ? departingFlightId : returningFlightId;
  const currentCabinClass = currentSlide === 'departure' ? departureCabinClass : returnCabinClass;

  const normalizeCabinClass = (cabin: string): string => {
    const cabinClassMap: Record<string, string> = {
      Economy: "Economy",
      "Business Class": "Business Class",
      "First Class": "First Class",
      economy: "Economy",
      business: "Business Class",
      first: "First Class",
    };
    return cabinClassMap[cabin] || cabin;
  };

  const normalizeToComponentCabinClass = (cabin: string): CabinClass => {
    const cabinClassMap: Record<string, CabinClass> = {
      Economy: "economy",
      "Business Class": "business",
      "First Class": "first",
      economy: "economy",
      business: "business",
      first: "first",
    };
    return cabinClassMap[cabin] || "economy";
  };

  const filterSeatsByRowRange = (seats: Seat[], cabinClass: CabinClass): Seat[] => {
    const rowRange = getRowRangeForCabin(cabinClass);
    return seats.filter((seat) => seat.row >= rowRange.minRow && seat.row <= rowRange.maxRow);
  };

  const loadSeatsForSlide = useCallback(async (slide: 'departure' | 'return') => {
    const flightId = slide === 'departure' ? departingFlightId : returningFlightId;
    const cabinClass = slide === 'departure' ? departureCabinClass : returnCabinClass;
    
    if (!flightId) return;
    
    setLoading(true);
    setError(null);
    try {
      const normalizedCabin = normalizeCabinClass(cabinClass);
      const normalizedCabinClassType = normalizeToComponentCabinClass(cabinClass);
      const result = await getSeatsAction(flightId, normalizedCabin);
      if (result.success && result.seats) {
        const mappedSeats = mapDatabaseSeatsToComponentSeats(result.seats, normalizedCabinClassType);
        const filteredSeats = filterSeatsByRowRange(mappedSeats, normalizedCabinClassType);
        if (slide === 'departure') {
          setDepartureSeatsData(filteredSeats);
        } else {
          setReturnSeatsData(filteredSeats);
        }
      } else {
        setError(result.error || 'Failed to load seats');
        const generatedSeats = generateSeats(normalizedCabinClassType);
        const filteredSeats = filterSeatsByRowRange(generatedSeats, normalizedCabinClassType);
        if (slide === 'departure') {
          setDepartureSeatsData(filteredSeats);
        } else {
          setReturnSeatsData(filteredSeats);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load seats');
      const normalizedCabinClassType = normalizeToComponentCabinClass(cabinClass);
      const generatedSeats = generateSeats(normalizedCabinClassType);
      const filteredSeats = filterSeatsByRowRange(generatedSeats, normalizedCabinClassType);
      if (slide === 'departure') {
        setDepartureSeatsData(filteredSeats);
      } else {
        setReturnSeatsData(filteredSeats);
      }
    } finally {
      setLoading(false);
    }
  }, [departingFlightId, returningFlightId, departureCabinClass, returnCabinClass]);

  const totalPassengers = adults + children;
  const canProceedToReturn = departureSeats.length === totalPassengers;
  const canConfirm = departureSeats.length === totalPassengers && (!isRoundTrip || returnSeats.length === totalPassengers);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide('departure');
      setHasAutoAdvanced(false);
      if (departingFlightId) {
        loadSeatsForSlide('departure');
      }
      if (isRoundTrip && returningFlightId) {
        loadSeatsForSlide('return');
      }
    }
  }, [isOpen, departingFlightId, returningFlightId, departureCabinClass, returnCabinClass, isRoundTrip, loadSeatsForSlide]);

  useEffect(() => {
    if (isOpen && currentSlide === 'return' && returnSeatsData.length === 0 && returningFlightId) {
      loadSeatsForSlide('return');
    }
  }, [currentSlide, isOpen, returningFlightId, returnSeatsData.length, loadSeatsForSlide]);

  useEffect(() => {
    if (isRoundTrip && currentSlide === 'departure' && canProceedToReturn && !hasAutoAdvanced) {
      const timer = setTimeout(() => {
        setCurrentSlide('return');
        setHasAutoAdvanced(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [departureSeats.length, totalPassengers, isRoundTrip, currentSlide, canProceedToReturn, hasAutoAdvanced]);

  if (!isOpen) return null;

  const normalizedCurrentCabinClass = normalizeToComponentCabinClass(currentCabinClass);
  const seatLetters = getSeatLettersForCabin(normalizedCurrentCabinClass);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSeatClick = (seatId: string, status: SeatStatus, price: number) => {
    if (status === "unavailable" || status === "held") return;

    if (currentSlide === 'departure') {
      setDepartureSeats((prev) => {
        const existingIndex = prev.findIndex((s) => s.id === seatId);
        if (existingIndex >= 0) {
          return prev.filter((s) => s.id !== seatId);
        }
        if (prev.length >= totalPassengers) {
          return prev;
        }
        return [...prev, { id: seatId, price }];
      });
    } else {
      setReturnSeats((prev) => {
        const existingIndex = prev.findIndex((s) => s.id === seatId);
        if (existingIndex >= 0) {
          return prev.filter((s) => s.id !== seatId);
        }
        if (prev.length >= totalPassengers) {
          return prev;
        }
        return [...prev, { id: seatId, price }];
      });
    }
  };

  const handleNext = () => {
    if (currentSlide === 'departure' && isRoundTrip && canProceedToReturn) {
      setCurrentSlide('return');
    }
  };


  const handlePrevious = () => {
    if (currentSlide === 'return') {
      setCurrentSlide('departure');
      setHasAutoAdvanced(true); // Prevent auto-advance when user manually goes back
    }
  };

  const handleConfirm = () => {
    onConfirm(departureSeats, isRoundTrip ? returnSeats : []);
    onClose();
  };

  const currentSelectedSeatsTotal = currentSelectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const currentSelectedSeatIds = currentSelectedSeats.map((s) => s.id);

  const getSeatColor = (status: SeatStatus, isHovered: boolean, seatId: string) => {
    const isSelected = currentSelectedSeatIds.includes(seatId);
    if (isSelected) {
      return isHovered ? "bg-blue-400" : "bg-blue-500";
    }
    if (status === "unavailable" || status === "held") {
      return "bg-red-500";
    }
    if (status === "available") {
      return isHovered ? "bg-green-400" : "bg-green-500";
    }
    return "bg-gray-300";
  };

  const getSeatTypeIcon = (type: SeatType) => {
    switch (type) {
      case "window":
        return <FaWindowMaximize className="h-3 w-3" />;
      case "aisle":
        return <FaUser className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCabinClassDisplay = (cabin: string): { name: string; color: string; bgColor: string } => {
    const normalizedCabin = normalizeCabinClass(cabin);
    if (normalizedCabin === "First Class") {
      return { name: "First Class", color: "text-[#d4af37]", bgColor: "bg-[#d4af37]/20" };
    } else if (normalizedCabin === "Business Class") {
      return { name: "Business Class", color: "text-[#0047ab]", bgColor: "bg-[#0047ab]/20" };
    } else {
      return { name: "Economy Class", color: "text-[#10b981]", bgColor: "bg-[#10b981]/20" };
    }
  };

  const getRowRangeDisplay = (cabinClass: CabinClass): string => {
    const rowRange = getRowRangeForCabin(cabinClass);
    return `Rows ${rowRange.minRow}-${rowRange.maxRow}`;
  };

  const groupedSeats = groupSeatsByRow(currentSeats);
  const cabinDisplay = getCabinClassDisplay(currentCabinClass);
  const rowRangeDisplay = getRowRangeDisplay(normalizedCurrentCabinClass);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[90vh] flex flex-col rounded-lg bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[#001d45]">
                Select Your Seats
                {isRoundTrip && (
                  <span className="text-lg text-[#6c7aa5] ml-2">
                    ({currentSlide === 'departure' ? 'Departure' : 'Return'} Flight)
                  </span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-[#6c7aa5]">
                Click on available seats to select them • Only {cabinDisplay.name.toLowerCase()} seats are shown
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Legend />
            <button
              onClick={() => setShowSeatType(!showSeatType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                showSeatType
                  ? 'bg-[#0047ab] text-white border-[#0047ab] hover:bg-[#003d9e]'
                  : 'border-[#dbe5ff] bg-white text-sm font-semibold text-[#0047ab] hover:bg-[#eef2ff]'
              }`}
            >
              Show Seat Type
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#6c7aa5] hover:bg-[#f5f7fb] transition"
              aria-label="Close modal"
            >
              <FaXmark className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative min-h-0 flex">
          <div className="flex h-full w-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide === 'departure' ? 0 : 100}%)` }}>
            {/* Departure Slide */}
            <div className="min-w-full flex-shrink-0 w-full overflow-y-auto p-6">
              {loading && currentSlide === 'departure' && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[#6c7aa5]">Loading departure seats...</p>
                </div>
              )}
              {!loading && (
                <SeatMapContent
                  seats={departureSeatsData}
                  selectedSeats={currentSlide === 'departure' ? currentSelectedSeatIds : []}
                  hoveredSeat={hoveredSeat}
                  onSeatClick={handleSeatClick}
                  onSeatHover={setHoveredSeat}
                  showSeatType={showSeatType}
                  getSeatColor={getSeatColor}
                  getSeatTypeIcon={getSeatTypeIcon}
                  cabinDisplay={getCabinClassDisplay(departureCabinClass)}
                  rowRangeDisplay={getRowRangeDisplay(normalizeToComponentCabinClass(departureCabinClass))}
                  seatLetters={getSeatLettersForCabin(normalizeToComponentCabinClass(departureCabinClass))}
                  normalizedCabinClass={normalizeToComponentCabinClass(departureCabinClass)}
                />
              )}
            </div>

            {/* Return Slide */}
            {isRoundTrip && (
              <div className="min-w-full flex-shrink-0 w-full overflow-y-auto p-6">
                {loading && currentSlide === 'return' && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-[#6c7aa5]">Loading return seats...</p>
                  </div>
                )}
                {!loading && (
                  <SeatMapContent
                    seats={returnSeatsData}
                    selectedSeats={currentSlide === 'return' ? currentSelectedSeatIds : []}
                    hoveredSeat={hoveredSeat}
                    onSeatClick={handleSeatClick}
                    onSeatHover={setHoveredSeat}
                    showSeatType={showSeatType}
                    getSeatColor={getSeatColor}
                    getSeatTypeIcon={getSeatTypeIcon}
                    cabinDisplay={getCabinClassDisplay(returnCabinClass)}
                    rowRangeDisplay={getRowRangeDisplay(normalizeToComponentCabinClass(returnCabinClass))}
                    seatLetters={getSeatLettersForCabin(normalizeToComponentCabinClass(returnCabinClass))}
                    normalizedCabinClass={normalizeToComponentCabinClass(returnCabinClass)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {isRoundTrip && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentSlide === 'departure'}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-white shadow-lg border border-gray-200 transition ${
                  currentSlide === 'departure' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                aria-label="Previous slide"
              >
                <FaChevronLeft className="h-5 w-5 text-[#0047ab]" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === 'return' || !canProceedToReturn}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-white shadow-lg border border-gray-200 transition ${
                  currentSlide === 'return' || !canProceedToReturn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                aria-label="Next slide"
              >
                <FaChevronRight className="h-5 w-5 text-[#0047ab]" />
              </button>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 bg-[#f5f7fb] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {currentSelectedSeats.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaChair className="h-5 w-5 text-[#0047ab]" />
                    <span className="text-sm font-semibold text-[#001d45]">
                      {currentSelectedSeats.length} / {totalPassengers} seat{totalPassengers > 1 ? "s" : ""} selected
                      {isRoundTrip && (
                        <span className="text-xs text-[#6c7aa5] ml-2">
                          ({currentSlide === 'departure' ? 'Departure' : 'Return'})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-[#6c7aa5]">
                      ({currentSelectedSeatIds.join(", ")})
                    </span>
                    <span className="text-sm font-semibold text-[#0047ab]">
                      • {formatPrice(currentSelectedSeatsTotal)}
                    </span>
                  </div>
                  {currentSelectedSeats.length >= totalPassengers && (
                    <span className="text-xs font-semibold text-green-600">
                      Maximum reached
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (currentSlide === 'departure') {
                        setDepartureSeats([]);
                      } else {
                        setReturnSeats([]);
                      }
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 underline transition"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
              {currentSelectedSeats.length === 0 && (
                <div className="text-sm text-[#6c7aa5]">
                  Select {totalPassengers} seat{totalPassengers > 1 ? "s" : ""} ({adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""})
                </div>
              )}
              {isRoundTrip && (
                <div className="text-xs text-[#6c7aa5]">
                  Departure: {departureSeats.length}/{totalPassengers} • Return: {returnSeats.length}/{totalPassengers}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#dbe5ff] bg-white px-6 py-2 text-sm font-semibold text-[#6c7aa5] hover:bg-[#f5f7fb] transition"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                {isRoundTrip && currentSlide === 'departure' && canProceedToReturn && (
                  <button
                    onClick={handleNext}
                    className="rounded-lg bg-[#0047ab] px-6 py-2 text-sm font-semibold text-white hover:bg-[#003d9e] transition"
                  >
                    Continue to Return Flight →
                  </button>
                )}
                {(!isRoundTrip || currentSlide === 'return') && (
                  <>
                    {currentSelectedSeats.length > 0 && (
                      <span className="text-sm font-semibold text-[#001d45]">
                        Total: {formatPrice(departureSeats.reduce((s, seat) => s + seat.price, 0) + returnSeats.reduce((s, seat) => s + seat.price, 0))}
                      </span>
                    )}
                    <button
                      onClick={handleConfirm}
                      disabled={!canConfirm}
                      className="rounded-lg bg-[#0047ab] px-6 py-2 text-sm font-semibold text-white hover:bg-[#003d9e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Selection
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SeatRow({
  row,
  seats,
  selectedSeats,
  hoveredSeat,
  onSeatClick,
  onSeatHover,
  showSeatType,
  getSeatColor,
  getSeatTypeIcon,
}: {
  row: number;
  seats: Seat[];
  selectedSeats: string[];
  hoveredSeat: string | null;
  onSeatClick: (seatId: string, status: SeatStatus, price: number) => void;
  onSeatHover: (seatId: string | null) => void;
  showSeatType: boolean;
  getSeatColor: (status: SeatStatus, isHovered: boolean, seatId: string) => string;
  getSeatTypeIcon: (type: SeatType) => React.ReactNode;
}) {
  const cabinClass = seats[0]?.cabinClass;
  const isFirstClass = cabinClass === "first";
  const isBusiness = cabinClass === "business";
  const isEconomy = cabinClass === "economy";

  const leftSeats = seats.filter((_, idx) => 
    isFirstClass ? idx < 1 : isBusiness ? idx < 2 : idx < 3
  );
  const rightSeats = seats.filter((_, idx) => 
    isFirstClass ? idx >= 1 : isBusiness ? idx >= 2 : idx >= 3
  );

  return (
    <div className="flex items-center justify-center gap-2 mb-1">
      <div className="w-8 text-right text-xs font-semibold text-[#6c7aa5]">
        {row}
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {leftSeats.map((seat) => (
            <SeatButton
              key={seat.id}
              seat={seat}
              selectedSeats={selectedSeats}
              hoveredSeat={hoveredSeat}
              onSeatClick={onSeatClick}
              onSeatHover={onSeatHover}
              showSeatType={showSeatType}
              getSeatColor={getSeatColor}
              getSeatTypeIcon={getSeatTypeIcon}
            />
          ))}
        </div>
        <div className="w-6 text-center text-[10px] text-[#6c7aa5] font-bold">||</div>
        <div className="flex gap-0.5">
          {rightSeats.map((seat) => (
            <SeatButton
              key={seat.id}
              seat={seat}
              selectedSeats={selectedSeats}
              hoveredSeat={hoveredSeat}
              onSeatClick={onSeatClick}
              onSeatHover={onSeatHover}
              showSeatType={showSeatType}
              getSeatColor={getSeatColor}
              getSeatTypeIcon={getSeatTypeIcon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  selectedSeats,
  hoveredSeat,
  onSeatClick,
  onSeatHover,
  showSeatType,
  getSeatColor,
  getSeatTypeIcon,
}: {
  seat: Seat;
  selectedSeats: string[];
  hoveredSeat: string | null;
  onSeatClick: (seatId: string, status: SeatStatus, price: number) => void;
  onSeatHover: (seatId: string | null) => void;
  showSeatType: boolean;
  getSeatColor: (status: SeatStatus, isHovered: boolean, seatId: string) => string;
  getSeatTypeIcon: (type: SeatType) => React.ReactNode;
}) {
  const isSelected = selectedSeats.includes(seat.id);
  const isHovered = hoveredSeat === seat.id;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onSeatClick(seat.id, seat.status, seat.price)}
        onMouseEnter={() => onSeatHover(seat.id)}
        onMouseLeave={() => onSeatHover(null)}
        disabled={seat.status === "unavailable" || seat.status === "held"}
        className={`
          relative w-8 h-8 rounded border border-gray-400 transition-all
          ${getSeatColor(seat.status, isHovered, seat.id)}
          ${seat.status === "unavailable" || seat.status === "held" 
            ? "cursor-not-allowed" 
            : "cursor-pointer hover:scale-110 hover:shadow-md"}
          ${isSelected ? "ring-2 ring-blue-600 ring-offset-1" : ""}
          flex items-center justify-center text-white text-[10px] font-semibold
        `}
        title={`${seat.id} - ${seat.type} - ${formatPrice(seat.price)}`}
      >
        {showSeatType && getSeatTypeIcon(seat.type)}
        {!showSeatType && seat.letter}
      </button>
      {isHovered && seat.status === "available" && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#001d45] text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none">
          {formatPrice(seat.price)}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#001d45]"></div>
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-500"></div>
        <span className="text-[#6c7aa5]">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-500"></div>
        <span className="text-[#6c7aa5]">Unavailable</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-500"></div>
        <span className="text-[#6c7aa5]">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-300"></div>
        <span className="text-[#6c7aa5]">Default</span>
      </div>
    </div>
  );
}

function generateSeats(cabinClass: CabinClass): Seat[] {
  const configs = {
    first: { rows: 5, seatsPerRow: 2, startRow: 1, letters: ["A", "B"], layout: "1-1" },
    business: { rows: 10, seatsPerRow: 4, startRow: 1, letters: ["A", "B", "C", "D"], layout: "2-2" },
    economy: { rows: 25, seatsPerRow: 6, startRow: 1, letters: ["A", "B", "C", "D", "E", "F"], layout: "3-3" },
  };

  const basePrices = {
    first: 2000,
    business: 800,
    economy: 300,
  };

  const typeMultipliers = {
    window: 1.2,
    aisle: 1.1,
    middle: 1.0,
  };

  const exitRowMultiplier = 1.3;

  const config = configs[cabinClass];
  const seats: Seat[] = [];
  const exitRows = {
    first: [1, 5],
    business: [1, 5, 10],
    economy: [1, 5, 10, 15, 20, 25],
  };

  for (let row = config.startRow; row < config.startRow + config.rows; row++) {
    for (let i = 0; i < config.seatsPerRow; i++) {
      const letter = config.letters[i];
      const seatId = `${row}${letter}`;
      
      let type: SeatType = "middle";
      if (cabinClass === "first") {
        type = "window";
      } else if (cabinClass === "business") {
        if (i === 0 || i === 3) type = "window";
        else type = "aisle";
      } else {
        if (i === 0 || i === 5) type = "window";
        else if (i === 2 || i === 3) type = "aisle";
        else type = "middle";
      }
      
      const status: SeatStatus = Math.random() > 0.7 ? "unavailable" : "available";
      
      const isExitRow = exitRows[cabinClass].includes(row);
      const basePrice = basePrices[cabinClass];
      const typeMultiplier = typeMultipliers[type];
      const rowMultiplier = isExitRow ? exitRowMultiplier : 1.0;
      const price = Math.round(basePrice * typeMultiplier * rowMultiplier);

      seats.push({
        id: seatId,
        row,
        letter,
        cabinClass,
        status,
        type,
        price,
      });
    }
  }

  return seats;
}

function groupSeatsByRow(seats: Seat[]): Record<number, Seat[]> {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);
}

function SeatMapContent({
  seats,
  selectedSeats,
  hoveredSeat,
  onSeatClick,
  onSeatHover,
  showSeatType,
  getSeatColor,
  getSeatTypeIcon,
  cabinDisplay,
  rowRangeDisplay,
  seatLetters,
  normalizedCabinClass,
}: {
  seats: Seat[];
  selectedSeats: string[];
  hoveredSeat: string | null;
  onSeatClick: (seatId: string, status: SeatStatus, price: number) => void;
  onSeatHover: (seatId: string | null) => void;
  showSeatType: boolean;
  getSeatColor: (status: SeatStatus, isHovered: boolean, seatId: string) => string;
  getSeatTypeIcon: (type: SeatType) => React.ReactNode;
  cabinDisplay: { name: string; color: string; bgColor: string };
  rowRangeDisplay: string;
  seatLetters: { left: string[]; right: string[] };
  normalizedCabinClass: CabinClass;
}) {
  const groupedSeats = groupSeatsByRow(seats);

  return (
    <div className="flex flex-col items-center">
      <div className={`w-full max-w-2xl mb-4 rounded-lg ${cabinDisplay.bgColor} border-2 ${cabinDisplay.color.replace('text-', 'border-')} p-3`}>
        <div className="flex items-center justify-center gap-2">
          <FaChair className={`h-5 w-5 ${cabinDisplay.color}`} />
          <p className={`text-sm font-bold ${cabinDisplay.color}`}>
            {cabinDisplay.name} Section
          </p>
        </div>
        <p className="text-xs text-[#6c7aa5] text-center mt-1">
          You are selecting seats for {cabinDisplay.name.toLowerCase()}. Only {rowRangeDisplay} are available for your selected flight.
        </p>
      </div>
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="w-8"></div>
        <div className="flex gap-0.5">
          {seatLetters.left.map((letter) => (
            <span key={letter} className="w-8 text-center text-xs font-semibold text-[#6c7aa5]">
              {letter}
            </span>
          ))}
        </div>
        <div className="w-6"></div>
        <div className="flex gap-0.5">
          {seatLetters.right.map((letter) => (
            <span key={letter} className="w-8 text-center text-xs font-semibold text-[#6c7aa5]">
              {letter}
            </span>
          ))}
        </div>
      </div>
      <div className="w-full max-w-2xl">
        {Object.entries(groupedSeats).map(([row, rowSeats]) => {
          const rowNum = parseInt(row);
          const isExitRow = isEmergencyExitRow(rowNum, normalizedCabinClass);
          return (
            <div key={row}>
              <SeatRow
                row={rowNum}
                seats={rowSeats}
                selectedSeats={selectedSeats}
                hoveredSeat={hoveredSeat}
                onSeatClick={onSeatClick}
                onSeatHover={onSeatHover}
                showSeatType={showSeatType}
                getSeatColor={getSeatColor}
                getSeatTypeIcon={getSeatTypeIcon}
              />
              {isExitRow && <ExitMarker row={rowNum} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

