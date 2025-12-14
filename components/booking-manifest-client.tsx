"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass, FaFilter, FaTrash } from "react-icons/fa6";
import ExportCsvButton from "@/components/export-csv-button";
import DeleteBookingModal from "@/components/delete-booking-modal";
import { deleteBookingsAction } from "@/server/actions/deleteBookings";

type Booking = {
  bookingId: string;
  number: string;
  date: string;
  passenger: string;
  seat: string;
  flightStatus: string;
  status: string;
};

type BookingManifestClientProps = {
  bookings: Booking[];
};

export default function BookingManifestClient({ bookings }: BookingManifestClientProps) {
  const router = useRouter();
  const [selectedBookingIds, setSelectedBookingIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.seat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterValue === "All" ||
      (filterValue === "Paid" && booking.status === "Paid") ||
      (filterValue === "Pending" && booking.status === "Pending") ||
      (filterValue === "On Time" && booking.flightStatus === "On Time") ||
      (filterValue === "Delayed" && booking.flightStatus === "Delayed") ||
      (filterValue === "Suspended" && booking.flightStatus === "Suspended");

    return matchesSearch && matchesFilter;
  });

  const allBookingIds = new Set(filteredBookings.map((b) => b.bookingId));
  const allSelected = selectedBookingIds.size > 0 && selectedBookingIds.size === allBookingIds.size && filteredBookings.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookingIds(new Set(allBookingIds));
    } else {
      setSelectedBookingIds(new Set());
    }
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    const newSelected = new Set(selectedBookingIds);
    if (checked) {
      newSelected.add(bookingId);
    } else {
      newSelected.delete(bookingId);
    }
    setSelectedBookingIds(newSelected);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBookingIds.size === 0) return;

    setIsDeleting(true);
    const formData = new FormData();
    formData.append("bookingIds", JSON.stringify(Array.from(selectedBookingIds)));

    const result = await deleteBookingsAction(formData);

    if (result.success) {
      setIsModalOpen(false);
      setSelectedBookingIds(new Set());
      router.refresh();
    } else {
      alert(result.error || "Failed to delete bookings");
    }

    setIsDeleting(false);
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative w-fit">
                <FaFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-fit appearance-none rounded-lg border border-white/20 bg-white/10 px-8 py-2 pr-8 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="All" className="bg-white text-[#001d45]">All</option>
                  <option value="Paid" className="bg-white text-[#001d45]">Paid</option>
                  <option value="Pending" className="bg-white text-[#001d45]">Pending</option>
                  <option value="On Time" className="bg-white text-[#001d45]">On Time</option>
                  <option value="Delayed" className="bg-white text-[#001d45]">Delayed</option>
                  <option value="Suspended" className="bg-white text-[#001d45]">Suspended</option>
                </select>
              </div>
              {selectedBookingIds.size > 0 && (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <FaTrash className="h-4 w-4" />
                  Delete ({selectedBookingIds.size})
                </button>
              )}
              <ExportCsvButton bookings={filteredBookings} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto px-4 py-4">
          <div className="hidden grid-cols-[auto_1fr_1.2fr_2fr_0.8fr_1fr_1fr] gap-4 bg-[#eef2ff] px-4 py-3 text-base font-semibold text-[#6c7aa5] md:grid">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-[#6c7aa5] text-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]"
              />
            </div>
            <p>Flight No.</p>
            <p>Date</p>
            <p>Passenger Name</p>
            <p>Seat</p>
            <p>Flight Status</p>
            <p>Payment Status</p>
          </div>
          <div className="mt-2 divide-y divide-[#eef2ff] overflow-hidden rounded-2xl border border-[#eef2ff] bg-white text-sm text-[#001d45]">
            {filteredBookings.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#6c7aa5]">
                {bookings.length === 0 ? "No bookings available" : "No bookings match your search/filter"}
              </div>
            ) : (
              filteredBookings.map((booking, index) => {
                const isSelected = selectedBookingIds.has(booking.bookingId);
                return (
                  <div
                    key={`${booking.bookingId}-${booking.passenger}-${index}`}
                    className="grid grid-cols-1 gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[auto_1fr_1.2fr_2fr_0.8fr_1fr_1fr]"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectBooking(booking.bookingId, e.target.checked)}
                        className="h-4 w-4 rounded border-[#6c7aa5] text-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]"
                      />
                    </div>
                    <p>{booking.number}</p>
                    <p>{booking.date}</p>
                    <p className="break-words">{booking.passenger}</p>
                    <p>{booking.seat}</p>
                    <p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.flightStatus === "Suspended"
                            ? "bg-red-100 text-red-800"
                            : booking.flightStatus === "Delayed"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-[rgba(0,201,81,0.3)] text-[#00C951]"
                        }`}
                      >
                        {booking.flightStatus}
                      </span>
                    </p>
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
                );
              })
            )}
          </div>
        </div>
      </section>

      <DeleteBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedBookingIds.size}
      />
    </>
  );
}

