/* eslint-disable @next/next/no-img-element */

import { FaPlane } from "react-icons/fa6";

const stats = [
  { label: "Total Flights", value: "150", accent: "#66B2FF" },
  { label: "Total Bookings", value: "200", accent: "#FFE008" },
  { label: "Confirmed Bookings", value: "148", accent: "#00C951" },
  { label: "Canceled Flights", value: "50", accent: "#FF3030" },
  { label: "Total Revenue", value: "₱2,565,900.00", accent: "#FD773E" },
];

const salesSummary = [
  { period: "Dec 1-15, 2025", total: "152", paid: "145", rate: "95.4%", revenue: "₱456,500.00" },
  { period: "Dec 1-15, 2025", total: "178", paid: "170", rate: "95.5%", revenue: "₱531,200.00" },
  { period: "Dec 16-31, 2025", total: "134", paid: "128", rate: "95.5%", revenue: "₱398,000.00" },
  { period: "Jan 1-15, 2026", total: "145", paid: "139", rate: "95.3%", revenue: "₱425,300.00" },
  { period: "Jan 16-31, 2026", total: "121", paid: "115", rate: "95.0%", revenue: "₱352,800.00" },
  { period: "Feb 1-15, 2026", total: "138", paid: "132", rate: "95.0%", revenue: "₱402,100.00" },
];

const flights = [
  { number: "PSCX", date: "Dec 2, 2025", passenger: "Amber Miguel Malinis", seat: "14A", status: "Paid" },
  { number: "PSCX", date: "Dec 2, 2025", passenger: "Aliyah Salmorin", seat: "15C", status: "Paid" },
  { number: "PSCX", date: "Dec 2, 2025", passenger: "Junnel Francis Jonson", seat: "15D", status: "Pending" },
  { number: "PSCX", date: "Dec 2, 2025", passenger: "Mohammad Zulkifli", seat: "8B", status: "Paid" },
  { number: "PSCX", date: "Dec 2, 2025", passenger: "Hosni Palantig", seat: "12E", status: "Pending" },
];

const recentBookings = [
  {
    flight: "MSU101",
    price: "₱3,500",
    route: "Manila ➜ Cebu",
    departure: "Dec 15, 2025 • 08:00 AM",
    arrival: "Dec 15, 2025 • 09:30 AM",
    seats: "150",
  },
  {
    flight: "MSU101",
    price: "₱3,500",
    route: "Manila ➜ Cebu",
    departure: "Dec 15, 2025 • 08:00 AM",
    arrival: "Dec 15, 2025 • 09:30 AM",
    seats: "150",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <StatsCards />
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(420px,1fr)_minmax(320px,0.9fr)]">
            <SalesSummary />
            <FlightsPanel />
          </div>
          <RecentBookings />
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
          AU
        </div>
        <p className="mt-4 text-base font-semibold">Admin User</p>
        <p className="text-sm text-white/60">@adminuser</p>
      </div>

      <nav className="flex flex-1 flex-col gap-4 text-sm font-semibold">
        {["Home", "Booking", "Flights", "Reports", "Profile", "Log out"].map((item) => (
          <a
            key={item}
            href="#"
            className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${item === "Home" ? "bg-white/10" : ""}`}
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

function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ label, value, accent }) => (
        <article key={label} className="rounded-3xl bg-white p-4 shadow-sm">
          <div
            className="mb-4 h-1.5 rounded-full"
            style={{
              backgroundColor: accent,
            }}
          />
          <p className="text-sm text-[#6c7aa5]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#001d45]">{value}</p>
        </article>
      ))}
    </div>
  );
}

const salesGridTemplate =
  "md:grid-cols-[minmax(180px,1.4fr)_minmax(60px,0.5fr)_minmax(60px,0.5fr)_minmax(70px,0.5fr)_minmax(180px,1.6fr)]";

function SalesSummary() {
  const total = salesSummary.reduce(
    (acc, row) => {
      acc.total += Number(row.total);
      acc.paid += Number(row.paid);
      return acc;
    },
    { total: 0, paid: 0 }
  );

  return (
    <section className="flex h-[520px] flex-col rounded-3xl bg-white shadow-sm">
      <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Sales Summary Report</h2>
      </header>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        <div className={`hidden gap-4 px-4 py-2 text-xs font-semibold text-[#6c7aa5] md:grid ${salesGridTemplate}`}>
          <p>Period</p>
          <p className="text-center">Bookings</p>
          <p className="text-center">Paid</p>
          <p className="text-center">Rate</p>
          <p>Revenue</p>
        </div>
        <div className="mt-2 overflow-hidden rounded-2xl border border-[#eef2ff] bg-white text-sm text-[#001d45]">
          {salesSummary.map((row, index) => (
            <div key={`${row.period}-${row.revenue}`} className={`grid grid-cols-1 gap-x-4 gap-y-2 px-4 py-3 ${salesGridTemplate} ${index !== 0 ? "border-t border-[#eef2ff]" : ""}`}>
              <p className="font-semibold md:font-normal">{row.period}</p>
              <p className="md:text-center">{row.total}</p>
              <p className="md:text-center">{row.paid}</p>
              <div className="flex items-center md:justify-center">
                <span className="rounded-full bg-[rgba(0,201,81,0.2)] px-3 py-1 text-xs font-semibold text-[#00C951]">
                  {row.rate}
                </span>
              </div>
              <p className="font-semibold md:font-normal md:whitespace-nowrap">{row.revenue}</p>
            </div>
          ))}
          <div className={`grid grid-cols-1 gap-x-4 gap-y-2 bg-[#f8faff] px-4 py-3 font-semibold ${salesGridTemplate} border-t border-[#eef2ff]`}>
            <p>Total</p>
            <p className="md:text-center">{total.total}</p>
            <p className="md:text-center">{total.paid}</p>
            <div className="flex items-center md:justify-center">
              <span className="rounded-full bg-[rgba(102,178,255,0.3)] px-3 py-1 text-xs font-semibold text-[#0047ab]">
                95.4%
              </span>
            </div>
            <p className="md:whitespace-nowrap">₱2,565,900.00</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlightsPanel() {
  return (
    <section className="space-y-6">
      <div className="flex h-[520px] flex-col rounded-3xl bg-white shadow-sm">
        <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
          <h2 className="text-lg font-semibold">Flights</h2>
        </header>
        <div className="flex-1 overflow-x-auto overflow-y-auto px-4 py-4">
          <div className="hidden grid-cols-[1fr_1.2fr_2fr_0.8fr_1fr] gap-4 px-4 py-2 text-xs font-semibold text-[#6c7aa5] md:grid">
            <p>Flight No.</p>
            <p>Date</p>
            <p>Passenger Name</p>
            <p>Seat</p>
            <p>Status</p>
          </div>
          <div className="mt-2 divide-y divide-[#eef2ff] overflow-hidden rounded-2xl border border-[#eef2ff] bg-white text-sm text-[#001d45]">
            {flights.map((flight) => (
              <div
                key={`${flight.number}-${flight.passenger}`}
                className="grid grid-cols-1 gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[1fr_1.2fr_2fr_0.8fr_1fr]"
              >
                <p>{flight.number}</p>
                <p>{flight.date}</p>
                <p className="break-words">{flight.passenger}</p>
                <p>{flight.seat}</p>
                <p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      flight.status === "Paid"
                        ? "bg-[rgba(0,201,81,0.3)] text-[#00C951]"
                        : "bg-[rgba(255,224,8,0.3)] text-[#a57b00]"
                    }`}
                  >
                    {flight.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentBookings() {
  return (
    <section className="mt-8 rounded-3xl bg-white shadow-sm">
      <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
      </header>
      <div className="space-y-4 px-6 py-6">
        {recentBookings.map((booking, index) => {
          const departureFormatted = booking.departure.replace(" • ", ", ");
          const arrivalFormatted = booking.arrival.replace(" • ", ", ");
          const routeFormatted = booking.route.replace(" ➜ ", " → ");

          return (
            <article
              key={`${booking.flight}-${index}`}
              className="rounded-2xl border border-[#eef2ff] bg-white p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_1fr_1fr_1fr] md:gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#66B2FF]/20 text-[#0047ab]">
                  <FaPlane className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#6c7aa5]">Flight Number</p>
                  <p className="text-sm font-semibold text-[#001d45]">{booking.flight}</p>
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
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr] md:gap-6 md:pl-[72px]">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#6c7aa5]">Price</p>
                  <p className="text-sm text-[#001d45]">{booking.price}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#6c7aa5]">Available Seats</p>
                  <p className="text-sm text-[#001d45]">{booking.seats}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


