/* eslint-disable @next/next/no-img-element */

import { FaDownload, FaCalendar } from "react-icons/fa6";

const stats = [
  { label: "Total Flights", value: "150", accent: "#66B2FF" },
  { label: "Total Bookings", value: "200", accent: "#FFE008" },
  { label: "Confirmed Bookings", value: "148", accent: "#00C951" },
  { label: "Canceled Flights", value: "50", accent: "#FF3030" },
  { label: "Total Revenue", value: "₱2,565,900.00", accent: "#FD773E" },
];

const periodData = [
  { period: "Dec 1-15, 2025", total: "152", paid: "145", rate: "95.4%", revenue: "₱456,500.00" },
  { period: "Dec 1-15, 2025", total: "178", paid: "170", rate: "95.5%", revenue: "₱531,200.00" },
  { period: "Dec 16-31, 2025", total: "134", paid: "128", rate: "95.5%", revenue: "₱398,000.00" },
  { period: "Jan 1-15, 2026", total: "145", paid: "139", rate: "95.9%", revenue: "₱425,300.00" },
  { period: "Jan 16-31, 2026", total: "121", paid: "115", rate: "95.0%", revenue: "₱352,800.00" },
  { period: "Feb 1-15, 2026", total: "138", paid: "132", rate: "95.0%", revenue: "₱402,100.00" },
];

export default function AdminSalesSummaryPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <SalesSummaryReport />
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
        {["Home", "Booking", "Flights", "Reports", "Profile", "Log out"].map((item) => (
          <a
            key={item}
            href={item === "Home" ? "/admin" : item === "Reports" ? "/admin/sales-summary" : "#"}
            className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${item === "Reports" ? "bg-white/10" : ""}`}
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

function SalesSummaryReport() {
  const total = periodData.reduce(
    (acc, row) => {
      acc.total += Number(row.total);
      acc.paid += Number(row.paid);
      return acc;
    },
    { total: 0, paid: 0 }
  );

  return (
    <section className="rounded-3xl bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Sales Summary Report</h2>
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90">
            <FaDownload className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
      <div className="px-6 py-6">
        <AdminFinancialOverview />
        <PeriodWiseBreakdown total={total} />
      </div>
    </section>
  );
}

function AdminFinancialOverview() {
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

function PeriodWiseBreakdown({ total }: { total: { total: number; paid: number } }) {
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
          {periodData.map((row, index) => (
            <div
              key={`${row.period}-${row.revenue}-${index}`}
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
                95.4%
              </span>
            </div>
            <p className="text-right md:whitespace-nowrap">₱2,565,900.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

