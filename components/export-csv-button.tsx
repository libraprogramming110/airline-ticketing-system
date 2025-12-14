"use client";

import { FaDownload } from "react-icons/fa6";

type BookingData = {
  bookingId?: string;
  number: string;
  date: string;
  passenger: string;
  seat: string;
  flightStatus: string;
  status: string;
};

type ExportCsvButtonProps = {
  bookings: BookingData[];
};

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function convertToCsv(bookings: BookingData[]): string {
  const headers = ["Flight No.", "Date", "Passenger Name", "Seat", "Flight Status", "Payment Status"];
  const csvRows = [headers.map(escapeCsvField).join(",")];

  for (const booking of bookings) {
    const row = [
      booking.number,
      booking.date,
      booking.passenger,
      booking.seat,
      booking.flightStatus,
      booking.status,
    ];
    csvRows.push(row.map(escapeCsvField).join(","));
  }

  return csvRows.join("\n");
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

export default function ExportCsvButton({ bookings }: ExportCsvButtonProps) {
  const handleExport = () => {
    if (bookings.length === 0) {
      return;
    }

    const csvContent = convertToCsv(bookings);
    const today = new Date().toISOString().split("T")[0];
    const filename = `bookings-${today}.csv`;
    downloadCsv(csvContent, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b5ed7] transition hover:bg-white/90"
    >
      <FaDownload className="h-4 w-4" />
      Export to CSV
    </button>
  );
}

