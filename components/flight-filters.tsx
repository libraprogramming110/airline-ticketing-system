'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

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

type FlightFiltersProps = {
  flights: Flight[];
};

export default function FlightFilters({ flights }: FlightFiltersProps) {
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const filterFlights = useCallback((time: string) => {
    if (!flights || flights.length === 0) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('flightFiltersChanged', { detail: [] })
        );
      }
      return;
    }

    let filtered = [...flights];

    if (time !== 'all') {
      filtered = filtered.filter((flight) => {
        if (!flight.departure_time) return false;
        
        const [hours] = flight.departure_time.split(':');
        const hour = parseInt(hours, 10);

        if (isNaN(hour)) return false;

        if (time === 'morning') {
          return hour >= 6 && hour < 12;
        } else if (time === 'afternoon') {
          return hour >= 13 && hour < 18;
        } else if (time === 'evening') {
          return hour >= 18;
        }
        return true;
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('flightFiltersChanged', { detail: filtered })
      );
    }
  }, [flights]);

  useEffect(() => {
    filterFlights(timeFilter);
  }, [filterFlights, timeFilter]);

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    filterFlights(value);
  };

  return (
    <div className="bg-[#f5f7fb] px-8 py-8 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4 flex-nowrap">
              <h3 className="text-base font-semibold text-[#001d45] whitespace-nowrap">
                Filter by Time
              </h3>
              <div className="relative flex-shrink-0 min-w-[250px] max-w-[400px]">
                <select
                  value={timeFilter}
                  onChange={(e) => handleTimeFilterChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#dbe5ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#001d45] outline-none transition focus:border-[#0047ab]"
                >
                  <option value="all">All Flights</option>
                  <option value="morning">Morning (6:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (1:00 PM - 6:00 PM)</option>
                  <option value="evening">Evening (6:00 PM+)</option>
                </select>
                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7aa5]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


