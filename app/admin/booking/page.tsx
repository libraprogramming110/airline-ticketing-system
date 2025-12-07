/* eslint-disable @next/next/no-img-element */

import { FaMagnifyingGlass, FaFilter, FaDownload } from "react-icons/fa6";
import AdminSidebar from "@/components/admin-sidebar";

const bookings = [
  { number: "MSU101", date: "Dec 15, 2025", passenger: "Amber Miguel Malinis", seat: "14A", status: "Paid" },
  { number: "MSU101", date: "Dec 15, 2025", passenger: "Aliyah Salmorin", seat: "15C", status: "Paid" },
  { number: "MSU102", date: "Jan 5, 2026", passenger: "Junnel Francis Jonson", seat: "15D", status: "Pending" },
  { number: "MSU102", date: "Jan 5, 2026", passenger: "Mohammad Zulkifli", seat: "8B", status: "Paid" },
  { number: "MSU102", date: "Jan 5, 2026", passenger: "Mohammad Hosni", seat: "8C", status: "Paid" },
  { number: "MSU103", date: "Feb 10, 2026", passenger: "Juan Dela Cruz", seat: "12A", status: "Pending" },
  { number: "MSU103", date: "Feb 10, 2026", passenger: "Anna Garcia", seat: "5F", status: "Paid" },
  { number: "MSU103", date: "Feb 10, 2026", passenger: "Roberto Cruz", seat: "6A", status: "Paid" },
];

export default function AdminBookingPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="booking" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <BookingManifest />
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

function BookingManifest() {
  return (
    <section className="rounded-3xl bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-white">Booking Manifest</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 md:min-w-[280px]">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
              <input
                type="text"
                placeholder="Search date, seat, payment..."
                className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="relative w-fit">
              <FaFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
              <select className="w-fit appearance-none rounded-lg border border-white/20 bg-white/10 px-8 py-2 pr-8 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20">
                <option className="bg-white text-[#001d45]">Filter</option>
                <option className="bg-white text-[#001d45]">Date</option>
                <option className="bg-white text-[#001d45]">Seat</option>
                <option className="bg-white text-[#001d45]">Payment Status</option>
              </select>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90">
              <FaDownload className="h-4 w-4" />
              Export to CSV
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <div className="hidden grid-cols-[1fr_1.2fr_2fr_0.8fr_1fr] gap-4 bg-[#eef2ff] px-4 py-3 text-base font-semibold text-[#6c7aa5] md:grid">
          <p>Flight No.</p>
          <p>Date</p>
          <p>Passenger Name</p>
          <p>Seat</p>
          <p>Payment Status</p>
        </div>
        <div className="mt-2 divide-y divide-[#eef2ff] overflow-hidden rounded-2xl border border-[#eef2ff] bg-white text-sm text-[#001d45]">
          {bookings.map((booking) => (
            <div
              key={`${booking.number}-${booking.passenger}`}
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
          ))}
        </div>
      </div>
    </section>
  );
}

