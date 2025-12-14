/* eslint-disable @next/next/no-img-element */

import AdminSidebar from "@/components/admin-sidebar";
import { getAllBookingPassengers } from "@/server/services/adminService";
import BookingManifestClient from "@/components/booking-manifest-client";

function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default async function AdminBookingPage() {
  const bookingPassengers = await getAllBookingPassengers();

  const bookings = bookingPassengers.map((item) => ({
    bookingId: item.bookingId,
    number: item.flightNumber,
    date: item.date,
    passenger: capitalizeName(item.passengerName),
    seat: item.seat,
    flightStatus: item.flightStatus,
    status: item.status,
  }));

  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="booking" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <BookingManifestClient bookings={bookings} />
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


