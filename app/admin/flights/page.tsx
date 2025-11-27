/* eslint-disable @next/next/no-img-element */

import { FaPlane, FaPencil, FaTrash } from "react-icons/fa6";

const flights = [
  {
    number: "MSU101",
    price: "₱3,500",
    route: "Manila → Cebu",
    availableSeats: "150",
    departure: "Dec 15, 2025, 08:00 AM",
    arrival: "Dec 15, 2025, 09:30 AM",
  },
  {
    number: "MSU102",
    price: "₱2,800",
    route: "Cebu → Davao",
    availableSeats: "120",
    departure: "Jan 5, 2026, 02:00 PM",
    arrival: "Jan 5, 2026, 03:15 PM",
  },
  {
    number: "MSU103",
    price: "₱4,200",
    route: "Manila → Davao",
    availableSeats: "180",
    departure: "Feb 10, 2026, 10:30 AM",
    arrival: "Feb 10, 2026, 12:00 PM",
  },
  {
    number: "MSU103",
    price: "₱4,200",
    route: "Manila → Davao",
    availableSeats: "180",
    departure: "Feb 10, 2026, 10:30 AM",
    arrival: "Feb 10, 2026, 12:00 PM",
  },
];

export default function AdminFlightsPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <FlightManagement />
        </section>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-8 border-r border-white/10 bg-gradient-to-b from-[#081024] to-[#02050e] px-6 py-10 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold">
          JC
        </div>
        <p className="mt-4 text-base font-semibold">John Carlo Cruz</p>
        <p className="text-sm text-white/60">@johncarlocruz</p>
      </div>

      <nav className="flex flex-1 flex-col gap-4 text-sm font-semibold">
        {["Home", "Bookings", "Flights", "Reports", "Profile", "Log out"].map((item) => (
          <a
            key={item}
            href={item === "Home" ? "/admin" : item === "Flights" ? "/admin/flights" : "#"}
            className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${item === "Flights" ? "bg-white/10" : ""}`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="border-b border-[#dbe5ff] bg-white px-8 py-4 shadow-sm">
      <img src="/airline-logo2.svg" alt="Omnira Administration" className="h-14 w-auto" />
    </header>
  );
}

function FlightManagement() {
  return (
    <section className="rounded-3xl bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Flight Management</h2>
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90">
            + Add New Flight
          </button>
        </div>
      </div>
      <div className="space-y-4 px-6 py-6">
        {flights.map((flight, index) => (
          <FlightCard key={`${flight.number}-${index}`} flight={flight} />
        ))}
      </div>
    </section>
  );
}

function FlightCard({ flight }: { flight: (typeof flights)[0] }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#eef2ff] bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#66B2FF]/20 text-[#0047ab]">
        <FaPlane className="h-5 w-5" />
      </div>
      <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1.5fr_1fr_1.5fr_1.5fr] md:gap-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Flight Number</p>
          <p className="text-sm font-semibold text-[#001d45]">{flight.number}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Price</p>
          <p className="text-sm text-[#001d45]">{flight.price}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Route</p>
          <p className="text-sm text-[#001d45]">{flight.route}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Available Seats</p>
          <p className="text-sm text-[#001d45]">{flight.availableSeats}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Departure</p>
          <p className="text-sm text-[#001d45]">{flight.departure}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6c7aa5]">Arrival</p>
          <p className="text-sm text-[#001d45]">{flight.arrival}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0b5ed7] transition hover:bg-[#0b5ed7]/10">
          <FaPencil className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#FF3030] transition hover:bg-[#FF3030]/10">
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

