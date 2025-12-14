"use client";

import { FaDownload } from "react-icons/fa6";

type Stat = {
  label: string;
  value: string;
  accent: string;
};

type SalesSummaryRow = {
  period: string;
  total: string;
  paid: string;
  rate: string;
  revenue: string;
};

type ExportSalesSummaryButtonProps = {
  stats: Stat[];
  salesSummary: SalesSummaryRow[];
  total: { total: string; paid: string };
  totalRate: string;
  totalRevenue: string;
};

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function toCsvLines(rows: string[][]): string[] {
  return rows.map((row) => row.map(escapeCsvField).join(","));
}

function buildSalesSummaryCsv(props: ExportSalesSummaryButtonProps): string {
  const lines: string[] = [];

  lines.push(...toCsvLines([["Sales Summary Report"]]));
  lines.push("");

  lines.push(...toCsvLines([["Admin Financial Overview"]]));
  lines.push(...toCsvLines([["Metric", "Value"]]));
  lines.push(
    ...toCsvLines(props.stats.map((s) => [s.label, s.value]))
  );
  lines.push("");

  lines.push(...toCsvLines([["Period-wise Breakdown"]]));
  lines.push(
    ...toCsvLines([
      [
        "Period",
        "Total Bookings",
        "Successful Payments",
        "Success Rate",
        "Total Revenue",
      ],
    ])
  );

  lines.push(
    ...toCsvLines(
      props.salesSummary.map((row) => [
        row.period,
        row.total,
        row.paid,
        row.rate,
        row.revenue,
      ])
    )
  );

  lines.push(
    ...toCsvLines([
      [
        "Total",
        props.total.total,
        props.total.paid,
        props.totalRate,
        props.totalRevenue,
      ],
    ])
  );

  return lines.join("\n");
}

function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportSalesSummaryButton(props: ExportSalesSummaryButtonProps) {
  const handleExport = () => {
    const csvContent = buildSalesSummaryCsv(props);
    const today = new Date().toISOString().split("T")[0];
    const filename = `sales-summary-${today}.csv`;
    downloadCsv(csvContent, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90"
    >
      <FaDownload className="h-4 w-4" />
      Export Report
    </button>
  );
}
