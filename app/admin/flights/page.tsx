/* eslint-disable @next/next/no-img-element */

import AdminSidebar from "@/components/admin-sidebar";
import { getAllFlights } from "@/server/services/adminService";
import FlightManagementClient from "@/components/flight-management-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminFlightsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const pageSize = 10;
  const resolvedSearchParams = await searchParams;
  const pageFromQuery = Number(resolvedSearchParams?.page);
  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;

  const { flights, totalPages } = await getAllFlights(page, pageSize);

  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="flights" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <FlightManagementClient flights={flights} currentPage={page} totalPages={totalPages} />
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


