'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import airports from '@/lib/data/airports.json';
import CabinSelectionModal from '@/components/cabin-selection-modal';
import {
  FaPlane,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaClock,
} from 'react-icons/fa6';

type Flight = {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  cabin_class: string;
};

type DatePrice = {
  date: string;
  lowest_price: number;
};

type FlightResultsProps = {
  flights: Flight[];
  datePrices: DatePrice[];
  departureDate: string;
  origin?: string;
  destination?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  isSelectingReturn?: boolean;
  departureFlightId?: string;
  departureOrigin?: string;
  departureDestination?: string;
  departureDateParam?: string;
  departureTime?: string;
  departureArrivalTime?: string;
  departurePrice?: string;
  departureCabinClass?: string;
};

export default function FlightResults({ 
  flights: initialFlights, 
  datePrices, 
  departureDate,
  origin = '',
  destination = '',
  returnDate = '',
  adults = 1,
  children = 0,
  isSelectingReturn = false,
  departureFlightId,
  departureOrigin,
  departureDestination,
  departureDateParam,
  departureTime,
  departureArrivalTime,
  departurePrice,
  departureCabinClass,
}: FlightResultsProps) {
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(initialFlights);
  const [isCabinModalOpen, setIsCabinModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    setFilteredFlights(initialFlights);
  }, [initialFlights]);

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent<Flight[]>) => {
      setFilteredFlights(event.detail);
    };

    window.addEventListener('flightFiltersChanged', handleFilterChange as EventListener);

    return () => {
      window.removeEventListener('flightFiltersChanged', handleFilterChange as EventListener);
    };
  }, []);

  const getLowestPriceForDate = (date: string): number | null => {
    const datePrice = datePrices.find((dp) => dp.date === date);
    return datePrice ? datePrice.lowest_price : null;
  };

  const lowestPrice = getLowestPriceForDate(departureDate);

  if (filteredFlights.length === 0) {
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

  const router = useRouter();

  const handleCabinSelect = (cabinClass: string) => {
    if (!selectedFlight) return;
    const params = new URLSearchParams();
    
    if (isSelectingReturn && departureFlightId) {
      params.set('departureFlightId', departureFlightId);
      params.set('departureOrigin', departureOrigin || '');
      params.set('departureDestination', departureDestination || '');
      params.set('departureDate', departureDateParam || '');
      params.set('departureTime', departureTime || '');
      params.set('departureArrivalTime', departureArrivalTime || '');
      params.set('departurePrice', departurePrice || '');
      params.set('departureCabinClass', departureCabinClass || '');
      params.set('returnFlightId', selectedFlight.id);
      params.set('returnOrigin', origin || selectedFlight.origin);
      params.set('returnDestination', destination || selectedFlight.destination);
      params.set('returnDate', selectedFlight.departure_date);
      params.set('returnTime', selectedFlight.departure_time);
      params.set('returnArrivalTime', selectedFlight.arrival_time);
      params.set('returnPrice', selectedFlight.price.toString());
      params.set('returnCabinClass', cabinClass);
      params.set('adults', adults.toString());
      params.set('children', children.toString());
      router.push(`/passenger-details?${params.toString()}`);
    } else if (returnDate && !isSelectingReturn) {
      params.set('selectingReturn', 'true');
      params.set('departureFlightId', selectedFlight.id);
      params.set('departureOrigin', origin || selectedFlight.origin);
      params.set('departureDestination', destination || selectedFlight.destination);
      params.set('departureDateParam', selectedFlight.departure_date);
      params.set('departureTime', selectedFlight.departure_time);
      params.set('departureArrivalTime', selectedFlight.arrival_time);
      params.set('departurePrice', selectedFlight.price.toString());
      params.set('departureCabinClass', cabinClass);
      params.set('origin', destination || selectedFlight.destination);
      params.set('destination', origin || selectedFlight.origin);
      params.set('departureDate', returnDate);
      params.set('originalDepartureDate', returnDate);
      params.set('returnDate', returnDate);
      params.set('adults', adults.toString());
      params.set('children', children.toString());
      router.push(`/search-flights?${params.toString()}`);
    } else {
      params.set('flightId', selectedFlight.id);
      params.set('origin', origin || selectedFlight.origin);
      params.set('destination', destination || selectedFlight.destination);
      params.set('departureDate', selectedFlight.departure_date);
      params.set('departureTime', selectedFlight.departure_time);
      params.set('arrivalTime', selectedFlight.arrival_time);
      params.set('price', selectedFlight.price.toString());
      params.set('cabinClass', cabinClass);
      params.set('adults', adults.toString());
      params.set('children', children.toString());
      router.push(`/passenger-details?${params.toString()}`);
    }
    
    setIsCabinModalOpen(false);
    setSelectedFlight(null);
  };

  return (
    <>
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {filteredFlights.map((flight) => {
          const isLowestPrice = 
            lowestPrice !== null && 
            flight.departure_date === departureDate && 
            flight.price === lowestPrice;
          
          return (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              isLowestPrice={isLowestPrice}
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
                onSelectFlight={(flight) => {
                  setSelectedFlight(flight);
                  setIsCabinModalOpen(true);
                }}
            />
          );
        })}
      </div>
    </div>
      {selectedFlight && (
        <CabinSelectionModal
          isOpen={isCabinModalOpen}
          onClose={() => {
            setIsCabinModalOpen(false);
            setSelectedFlight(null);
          }}
          onSelect={handleCabinSelect}
          flightId={selectedFlight.id}
          flightPrice={selectedFlight.price}
          adults={adults}
          children={children}
        />
      )}
    </>
  );
}

function FlightCard({ 
  flight, 
  isLowestPrice = false,
  origin = '',
  destination = '',
  returnDate = '',
  adults = 1,
  children = 0,
  isSelectingReturn = false,
  departureFlightId,
  departureOrigin,
  departureDestination,
  departureDateParam,
  departureTime,
  departureArrivalTime,
  departurePrice,
  departureCabinClass,
  onSelectFlight,
}: { 
  flight: Flight; 
  isLowestPrice?: boolean;
  origin?: string;
  destination?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  isSelectingReturn?: boolean;
  departureFlightId?: string;
  departureOrigin?: string;
  departureDestination?: string;
  departureDateParam?: string;
  departureTime?: string;
  departureArrivalTime?: string;
  departurePrice?: string;
  departureCabinClass?: string;
  onSelectFlight?: (flight: Flight) => void;
}) {
  const originAirport = airports.find((a) => a.code === flight.origin);
  const destinationAirport = airports.find((a) => a.code === flight.destination);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${
      isLowestPrice ? 'ring-2 ring-[#0047ab] ring-offset-2' : ''
    }`}>
      <div className="flex flex-col divide-y divide-[#dbe5ff]">
        <FlightCardTopSection flight={flight} />
        <FlightCardMiddleSection
          flight={flight}
          originAirport={originAirport}
          destinationAirport={destinationAirport}
          formatTime={formatTime}
          calculateDuration={calculateDuration}
        />
        <FlightCardBottomSection 
          flight={flight} 
          formatPrice={formatPrice} 
          isLowestPrice={isLowestPrice}
          onSelectFlight={onSelectFlight}
        />
      </div>
    </div>
  );
}

function FlightCardTopSection({ flight }: { flight: Flight }) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#eef2ff]">
          <FaPlane className="h-6 w-6 text-[#0047ab]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#001d45]">
            Flight {flight.id.slice(0, 8).toUpperCase()}
          </h3>
          <p className="text-sm text-[#6c7aa5]">Select cabin class after booking</p>
        </div>
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
  flight: Flight;
  originAirport: any;
  destinationAirport: any;
  formatTime: (time: string) => string;
  calculateDuration: (dep: string, arr: string) => string;
}) {
  return (
    <div className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
      <div className="flex flex-1 flex-col">
        <p className="text-2xl font-bold text-[#001d45]">
          {formatTime(flight.departure_time)}
        </p>
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
          <div className="h-px flex-1 bg-[#0047ab]" />
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
        <p className="text-2xl font-bold text-[#001d45]">
          {formatTime(flight.arrival_time)}
        </p>
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

function FlightCardBottomSection({
  flight,
  formatPrice,
  isLowestPrice = false,
  onSelectFlight,
}: {
  flight: Flight;
  formatPrice: (price: number) => string;
  isLowestPrice?: boolean;
  onSelectFlight?: (flight: Flight) => void;
}) {
  const handleSelectFlight = () => {
    if (onSelectFlight) {
      onSelectFlight(flight);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-[#001d45]">Available Seats</p>
        <div className="mt-2 inline-block rounded-lg bg-[#fbbf24]/20 px-3 py-1">
          <span className="text-sm font-semibold text-[#001d45]">
            {flight.available_seats} seats left
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <p className="text-2xl font-bold text-[#001d45]">{formatPrice(flight.price)}</p>
            {isLowestPrice && (
              <span className="rounded-full bg-[#10b981] px-2 py-1 text-xs font-semibold text-white">
                Best Price
              </span>
            )}
          </div>
          <p className="text-sm text-[#6c7aa5]">All-in fare/passenger</p>
        </div>
        <button 
          onClick={handleSelectFlight}
          className="rounded-lg bg-[#0047ab] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e]"
        >
          Select
        </button>
      </div>
    </div>
  );
}

