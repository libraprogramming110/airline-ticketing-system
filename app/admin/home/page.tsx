/* eslint-disable @next/next/no-img-element */

import { FaPlane } from "react-icons/fa6";
import AdminSidebar from "@/components/admin-sidebar";
import {
  getDashboardStats,
  getSalesSummary,
  getRecentBookingPassengers,
  getRecentBookings,
} from "@/server/services/adminService";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const [dashboardStats, salesSummary, recentBookingPassengers, recentBookings] = await Promise.all([
    getDashboardStats(),
    getSalesSummary(),
    getRecentBookingPassengers(5),
    getRecentBookings(5),
  ]);

  const stats = [
    { label: "Total Flights", value: dashboardStats.totalFlights.toString(), accent: "#66B2FF" },
    { label: "Total Bookings", value: dashboardStats.totalBookings.toString(), accent: "#FFE008" },
    { label: "Confirmed Bookings", value: dashboardStats.confirmedBookings.toString(), accent: "#00C951" },
    { label: "Canceled Flights", value: dashboardStats.canceledBookings.toString(), accent: "#FF3030" },
    { label: "Total Revenue", value: formatCurrency(dashboardStats.totalRevenue), accent: "#FD773E" },
  ];

  const formattedSalesSummary = salesSummary.map((row) => ({
    period: row.period,
    total: row.total.toString(),
    paid: row.paid.toString(),
    rate: row.rate,
    revenue: formatCurrency(row.revenue),
  }));

  const capitalizeName = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formattedFlights = recentBookingPassengers.map((item) => ({
    number: item.flightNumber,
    date: item.date,
    passenger: capitalizeName(item.passengerName),
    seat: item.seat,
    status: item.status,
  }));

  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="home" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <StatsCards stats={stats} />
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(420px,1fr)_minmax(320px,0.9fr)]">
            <SalesSummary salesSummary={formattedSalesSummary} />
            <RecentBookings bookings={formattedFlights} />
          </div>
          <FlightsPanel flights={recentBookings} />
        </section>
      </main>
    </div>
  );
}


function Header() {
  return (
    <header className="border-b border-[#dbe5ff] bg-white px-8 py-4 shadow-sm">
      <img src="/airline-logo2.svg" alt="Omnira Administration" className="h-14 w-auto" />
    </header>
  );
}

function StatsCards({ stats }: { stats: Array<{ label: string; value: string; accent: string }> }) {
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

function SalesSummary({
  salesSummary,
}: {
  salesSummary: Array<{ period: string; total: string; paid: string; rate: string; revenue: string }>;
}) {
  const total = salesSummary.reduce(
    (acc, row) => {
      acc.total += Number(row.total);
      acc.paid += Number(row.paid);
      return acc;
    },
    { total: 0, paid: 0 }
  );

  const totalRate = total.total > 0 ? ((total.paid / total.total) * 100).toFixed(1) + "%" : "0%";
  const totalRevenue = salesSummary.reduce((sum, row) => {
    const revenueValue = parseFloat(row.revenue.replace(/[₱,]/g, ""));
    return sum + (isNaN(revenueValue) ? 0 : revenueValue);
  }, 0);

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
          {salesSummary.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#6c7aa5]">No sales data available</div>
          ) : (
            <>
              {salesSummary.map((row, index) => (
                <div
                  key={`${row.period}-${index}`}
                  className={`grid grid-cols-1 gap-x-4 gap-y-2 px-4 py-3 ${salesGridTemplate} ${index !== 0 ? "border-t border-[#eef2ff]" : ""}`}
                >
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
                    {totalRate}
                  </span>
                </div>
                <p className="md:whitespace-nowrap">{formatCurrency(totalRevenue)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FlightsPanel({
  flights,
}: {
  flights: Array<{ flight: string; price: string; route: string; departure: string; arrival: string; seats: string; status: string }>;
}) {
  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl bg-white shadow-sm">
        <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
          <h2 className="text-lg font-semibold">Flights</h2>
        </header>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {flights.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#6c7aa5]">No flights available</div>
            ) : (
              flights.map((flight, index) => {
                const departureFormatted = flight.departure.replace(" • ", ", ");
                const arrivalFormatted = flight.arrival.replace(" • ", ", ");
                const routeFormatted = flight.route.replace(" ➜ ", " → ");

                return (
                  <article
                    key={`${flight.flight}-${index}`}
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
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr] md:gap-6 md:pl-[72px]">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Price</p>
                        <p className="text-sm text-[#001d45]">{flight.price}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#6c7aa5]">Available Seats</p>
                        <p className="text-sm text-[#001d45]">{flight.seats}</p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentBookings({
  bookings,
}: {
  bookings: Array<{ number: string; date: string; passenger: string; seat: string; status: string }>;
}) {
  return (
    <section className="flex h-[520px] flex-col rounded-3xl bg-white shadow-sm">
      <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
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
          {bookings.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#6c7aa5]">No recent booking passengers</div>
          ) : (
            bookings.map((booking, index) => (
              <div
                key={`${booking.number}-${booking.passenger}-${index}`}
                className="grid grid-cols-1 gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[1fr_1.2fr_2fr_0.8fr_1fr]"
              >
                <p>{booking.number}</p>
                <p>{booking.date}</p>
                <p className="break-words">{booking.passenger}</p>
                <p>{booking.seat}</p>
                <p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "Paid"
                        ? "bg-[rgba(0,201,81,0.3)] text-[#00C951]"
                        : "bg-[rgba(255,224,8,0.3)] text-[#a57b00]"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

