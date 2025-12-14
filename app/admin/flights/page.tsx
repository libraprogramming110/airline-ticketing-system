/* eslint-disable @next/next/no-img-element */

import AdminSidebar from "@/components/admin-sidebar";
import { getAllFlights } from "@/server/services/adminService";
import FlightManagementClient from "@/components/flight-management-client";

export default async function AdminFlightsPage() {
  const flights = await getAllFlights();

  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="flights" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <FlightManagementClient flights={flights} />
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


