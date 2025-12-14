/* eslint-disable @next/next/no-img-element */

import { FaCalendar } from "react-icons/fa6";
import AdminSidebar from "@/components/admin-sidebar";
import ExportSalesSummaryButton from "@/components/export-sales-summary-button";
import {
  getDashboardStats,
  getSalesSummary,
} from "@/server/services/adminService";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AdminSalesSummaryPage() {
  const [dashboardStats, salesSummary] = await Promise.all([
    getDashboardStats(),
    getSalesSummary(),
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

  const total = salesSummary.reduce(
    (acc, row) => {
      acc.total += row.total;
      acc.paid += row.paid;
      return acc;
    },
    { total: 0, paid: 0 }
  );

  const totalRate = total.total > 0 ? ((total.paid / total.total) * 100).toFixed(1) + "%" : "0%";
  const totalRevenue = salesSummary.reduce((sum, row) => sum + row.revenue, 0);

  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <AdminSidebar activePage="reports" />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <SalesSummaryReport 
            stats={stats}
            salesSummary={formattedSalesSummary}
            total={total}
            totalRate={totalRate}
            totalRevenue={totalRevenue}
          />
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

function SalesSummaryReport({
  stats,
  salesSummary,
  total,
  totalRate,
  totalRevenue,
}: {
  stats: Array<{ label: string; value: string; accent: string }>;
  salesSummary: Array<{ period: string; total: string; paid: string; rate: string; revenue: string }>;
  total: { total: number; paid: number };
  totalRate: string;
  totalRevenue: number;
}) {
  return (
    <section className="rounded-3xl bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Sales Summary Report</h2>
          <ExportSalesSummaryButton
            stats={stats}
            salesSummary={salesSummary}
            total={{ total: total.total.toString(), paid: total.paid.toString() }}
            totalRate={totalRate}
            totalRevenue={formatCurrency(totalRevenue)}
          />
        </div>
      </div>
      <div className="px-6 py-6">
        <AdminFinancialOverview stats={stats} />
        <PeriodWiseBreakdown 
          salesSummary={salesSummary}
          total={total}
          totalRate={totalRate}
          totalRevenue={totalRevenue}
        />
      </div>
    </section>
  );
}

function AdminFinancialOverview({
  stats,
}: {
  stats: Array<{ label: string; value: string; accent: string }>;
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-base font-semibold text-[#001d45]">Admin Financial Overview</h3>
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
    </div>
  );
}

const salesGridTemplate =
  "md:grid-cols-[minmax(180px,1.4fr)_minmax(110px,0.7fr)_minmax(140px,0.8fr)_minmax(110px,0.7fr)_minmax(160px,1.4fr)]";

function PeriodWiseBreakdown({
  salesSummary,
  total,
  totalRate,
  totalRevenue,
}: {
  salesSummary: Array<{ period: string; total: string; paid: string; rate: string; revenue: string }>;
  total: { total: number; paid: number };
  totalRate: string;
  totalRevenue: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#eef2ff] bg-white shadow-sm">
      <div className="bg-[#66B2FF] px-6 py-3">
        <div className="flex items-center gap-2">
          <FaCalendar className="h-4 w-4 text-white" />
          <h3 className="text-base font-semibold text-white">Period-wise Breakdown</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div
          className={`hidden gap-4 px-6 py-3 text-xs font-semibold text-[#001d45] md:grid ${salesGridTemplate}`}
          style={{ backgroundColor: "rgba(102, 178, 255, 0.5)" }}
        >
          <p>Period</p>
          <p className="text-center">Total Bookings</p>
          <p className="text-center">Successful Payments</p>
          <p className="text-center">Success Rate</p>
          <p className="text-right">Total Revenue</p>
        </div>
        <div className="text-sm text-[#001d45]">
          {salesSummary.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#6c7aa5]">No sales data available</div>
          ) : (
            <>
              {salesSummary.map((row, index) => (
                <div
                  key={`${row.period}-${index}`}
                  className={`grid grid-cols-1 gap-x-4 gap-y-2 px-6 py-3 ${salesGridTemplate} ${index !== 0 ? "border-t border-[#eef2ff]" : ""}`}
                >
                  <p className="font-semibold md:font-normal">{row.period}</p>
                  <p className="md:text-center">{row.total}</p>
                  <p className="md:text-center">{row.paid}</p>
                  <div className="flex items-center md:justify-center">
                    <span className="rounded-full bg-[rgba(0,201,81,0.2)] px-3 py-1 text-xs font-semibold text-[#00C951]">
                      {row.rate}
                    </span>
                  </div>
                  <p className="font-semibold text-right md:font-normal md:whitespace-nowrap">{row.revenue}</p>
                </div>
              ))}
              <div
                className={`grid grid-cols-1 gap-x-4 gap-y-2 bg-[#f8faff] px-6 py-3 font-semibold ${salesGridTemplate} border-t border-[#eef2ff]`}
              >
                <p>Total</p>
                <p className="md:text-center">{total.total}</p>
                <p className="md:text-center">{total.paid}</p>
                <div className="flex items-center md:justify-center">
                  <span className="rounded-full bg-[rgba(102,178,255,0.3)] px-3 py-1 text-xs font-semibold text-[#0047ab]">
                    {totalRate}
                  </span>
                </div>
                <p className="text-right md:whitespace-nowrap">{formatCurrency(totalRevenue)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

