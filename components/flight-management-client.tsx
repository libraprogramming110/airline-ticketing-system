"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlane, FaPenToSquare, FaXmark, FaPlus, FaMagnifyingGlass, FaFilter } from "react-icons/fa6";
import EditFlightModal from "./edit-flight-modal";
import AddFlightModal from "./add-flight-modal";
import { cancelFlightAction } from "@/server/actions/cancelFlight";

type FlightData = {
  id: string;
  flight: string;
  price: string;
  route: string;
  departure: string;
  arrival: string;
  seats: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  priceNumber: number;
  status: string;
};

type FlightManagementClientProps = {
  flights: FlightData[];
};

export default function FlightManagementClient({ flights }: FlightManagementClientProps) {
  const router = useRouter();
  const [editingFlight, setEditingFlight] = useState<FlightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cancellingFlightId, setCancellingFlightId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      searchTerm === "" ||
      flight.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.price.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterValue === "All" || flight.status === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (flight: FlightData) => {
    setEditingFlight(flight);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFlight(null);
  };

  const handleCancel = async (flightId: string) => {
    if (!confirm("Are you sure you want to cancel this flight? This action cannot be undone.")) {
      return;
    }

    setCancellingFlightId(flightId);

    const formData = new FormData();
    formData.append("flightId", flightId);

    const result = await cancelFlightAction(formData);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to cancel flight");
    }

    setCancellingFlightId(null);
  };

  return (
    <>
      <section className="rounded-3xl bg-white shadow-sm">
        <div className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-white">Flight Management</h2>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1 md:min-w-[280px]">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                <input
                  type="text"
                  placeholder="Search flight, route, date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative w-fit">
                <FaFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-fit appearance-none rounded-lg border border-white/20 bg-white/10 px-8 py-2 pr-8 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="All" className="bg-white text-[#001d45]">All</option>
                  <option value="Active" className="bg-white text-[#001d45]">Active</option>
                  <option value="Cancelled" className="bg-white text-[#001d45]">Cancelled</option>
                  <option value="Delayed" className="bg-white text-[#001d45]">Delayed</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90"
              >
                <FaPlus className="h-4 w-4" />
                Add Flight
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {filteredFlights.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#6c7aa5]">
                {flights.length === 0 ? "No flights available" : "No flights match your search/filter"}
              </div>
            ) : (
              filteredFlights.map((flight, index) => {
                const departureFormatted = flight.departure.replace(" • ", ", ");
                const arrivalFormatted = flight.arrival.replace(" • ", ", ");
                const routeFormatted = flight.route.replace(" ➜ ", " → ");

                return (
                  <article
                    key={`${flight.id}-${index}`}
                    className="rounded-2xl border border-[#eef2ff] bg-white p-6 shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_1fr_1fr_1fr] md:gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#66B2FF]/20 text-[#0047ab]">
                        <FaPlane className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Flight Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#001d45]">{flight.flight}</p>
                          {flight.status === 'cancelled' && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                              Cancelled
                            </span>
                          )}
                          {flight.status === 'delayed' && (
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                              Delayed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Route</p>
                        <p className="text-sm text-[#001d45]">{routeFormatted}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Departure</p>
                        <p className="text-sm text-[#001d45]">{departureFormatted}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Arrival</p>
                        <p className="text-sm text-[#001d45]">{arrivalFormatted}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:gap-6 md:pl-[72px]">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Price</p>
                        <p className="text-sm text-[#001d45]">{flight.price}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Available Seats</p>
                        <p className="text-sm text-[#001d45]">{flight.seats}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(flight)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0b5ed7] transition hover:bg-[#0b5ed7]/10"
                        >
                          <FaPenToSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(flight.id)}
                          disabled={cancellingFlightId === flight.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#FF3030] transition hover:bg-[#FF3030]/10 disabled:opacity-50"
                        >
                          <FaXmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <EditFlightModal flight={editingFlight} isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddFlightModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}

