"use client";

import { useRef, useState } from "react";
import Footer from "@/components/footer";
import { FaClipboardList, FaCheck, FaPlane, FaCalendar, FaUser, FaChair, FaXmark } from "react-icons/fa6";
import { verifyBookingAction } from "@/server/actions/verifyBooking";
import type { BookingDetails } from "@/server/services/bookingService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ManageBookingPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f7f9fc] px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-7xl">
          <BackNavigation />
          <ManageBookingContent />
        </div>
      </div>
      <Footer />
    </>
  );
}

function BackNavigation() {
  return (
    <header className="mb-12">
      <a
        href="/get-started"
        aria-label="Back to home"
        className="inline-flex items-center gap-3 transition hover:opacity-80"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#0047ab]"
        >
          <path
            d="M19 12H5M5 12l6-6m-6 6l6 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-[#0047ab]">
          Back to Home
        </span>
      </a>
    </header>
  );
}

function ManageBookingInfoCard() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
      <h2 className="mb-6 text-2xl font-semibold">
        Manage your booking with ease!
      </h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0047ab] text-white">
              <FaCheck className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-[#4a5b82]">
              You can manage your booking anytime:
            </p>
          </div>

          <div className="ml-8 space-y-3">
            <div className="flex items-start gap-3">
              <FaClipboardList className="mt-1 h-4 w-4 shrink-0 text-[#0047ab]" />
              <div>
                <span className="text-sm font-semibold text-[#001d45]">
                  Download:
                </span>
                <span className="ml-2 text-sm text-[#4a5b82]">
                  Track and download your confirmation details
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0047ab] text-white">
            <FaCheck className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm text-[#4a5b82]">
            You can cancel or request refunds for your booking based on fare
            rules.
          </p>
        </div>
      </div>
    </div>
  );
}

function ManageBookingContent() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (booking) {
    return (
      <div className="space-y-8">
        <BookingDetailsView booking={booking} onBack={() => setBooking(null)} />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ManageBookingInfoCard />
      <ManageBookingFormCard
        onVerify={async (bookingRef, lastNameOrEmail) => {
          setIsLoading(true);
          setError(null);
          try {
            const formData = new FormData();
            formData.append('bookingReference', bookingRef);
            formData.append('lastNameOrEmail', lastNameOrEmail);
            const result = await verifyBookingAction(formData);
            if (result.success && result.booking) {
              setBooking(result.booking);
            } else {
              setError(result.error || 'Verification failed');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setIsLoading(false);
          }
        }}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

function ManageBookingFormCard({
  onVerify,
  isLoading,
  error,
}: {
  onVerify: (bookingRef: string, lastNameOrEmail: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}) {
  const [bookingRef, setBookingRef] = useState("");
  const [lastNameOrEmail, setLastNameOrEmail] = useState("");
  const isFormValid = bookingRef.trim() !== "" && lastNameOrEmail.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    await onVerify(bookingRef, lastNameOrEmail);
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
      <h2 className="mb-2 text-2xl font-semibold">Manage Booking</h2>
      <p className="mb-8 text-sm text-[#6c7aa5]">
        Type in your details to manage your booking
      </p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="booking-ref"
            className="mb-2 block text-sm font-semibold text-[#001d45]"
          >
            Booking Reference Number
          </label>
          <div className="relative">
            <input
              id="booking-ref"
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g 1AB234C or 0123456789"
              disabled={isLoading}
              className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lastname-email"
            className="mb-2 block text-sm font-semibold text-[#001d45]"
          >
            Last name or email address
          </label>
          <input
            id="lastname-email"
            type="text"
            value={lastNameOrEmail}
            onChange={(e) => setLastNameOrEmail(e.target.value)}
            placeholder="Enter last name or email address"
            disabled={isLoading}
            className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-[#001d45] placeholder:text-[#6c7aa5] focus:border-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/20 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full rounded-full py-3 text-sm font-semibold transition ${
            isFormValid && !isLoading
              ? "bg-[#0047ab] text-white hover:bg-[#1d5ed6]"
              : "bg-[#eef2ff] text-[#6c7aa5] cursor-not-allowed"
          }`}
        >
          {isLoading ? "Verifying..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

function BookingDetailsView({
  booking,
  onBack,
}: {
  booking: BookingDetails;
  onBack: () => void;
}) {
  const printContentRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printContentRef.current) return;
    try {
      const canvas = await html2canvas(printContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-print-content]') as HTMLElement;
          if (clonedElement) {
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              const styles = window.getComputedStyle(htmlEl);

              const bgColor = styles.backgroundColor;
              const color = styles.color;
              const borderColor = styles.borderColor;

              if (bgColor && (bgColor.includes('lab') || bgColor.includes('oklab') || bgColor.includes('lch'))) {
                htmlEl.style.backgroundColor = '#ffffff';
              }
              if (color && (color.includes('lab') || color.includes('oklab') || color.includes('lch'))) {
                htmlEl.style.color = '#000000';
              }
              if (borderColor && (borderColor.includes('lab') || borderColor.includes('oklab') || borderColor.includes('lch'))) {
                htmlEl.style.borderColor = '#cccccc';
              }
            });
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Booking_${booking.bookingReference}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Booking Details</h1>
      </div>

      <div
        ref={printContentRef}
        className="rounded-3xl bg-white p-8 shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
        data-print-content
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Booking Reference</h2>
            <p className="text-2xl font-bold text-[#0047ab]">{booking.bookingReference}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6c7aa5]">Status</p>
            <p className="font-semibold capitalize">{booking.status}</p>
            <p className="text-sm text-[#6c7aa5] mt-1">Payment</p>
            <p className="font-semibold capitalize">{booking.paymentStatus}</p>
          </div>
        </div>

        <div className="space-y-6 border-t border-[#dbe5ff] pt-6">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FaPlane className="h-5 w-5 text-[#0047ab]" />
              Departing Flight
            </h3>
            <div className="rounded-xl bg-[#f5f7fb] p-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-[#6c7aa5]">Flight Number</p>
                  <p className="font-semibold">{booking.departingFlight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6c7aa5]">Route</p>
                  <p className="font-semibold">{booking.departingFlight.origin} → {booking.departingFlight.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6c7aa5]">Date</p>
                  <p className="font-semibold">{formatDate(booking.departingFlight.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6c7aa5]">Time</p>
                  <p className="font-semibold">{formatTime(booking.departingFlight.departureTime)} - {formatTime(booking.departingFlight.arrivalTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {booking.returningFlight && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <FaPlane className="h-5 w-5 text-[#0047ab]" />
                Returning Flight
              </h3>
              <div className="rounded-xl bg-[#f5f7fb] p-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#6c7aa5]">Flight Number</p>
                    <p className="font-semibold">{booking.returningFlight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6c7aa5]">Route</p>
                    <p className="font-semibold">{booking.returningFlight.origin} → {booking.returningFlight.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6c7aa5]">Date</p>
                    <p className="font-semibold">{formatDate(booking.returningFlight.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6c7aa5]">Time</p>
                    <p className="font-semibold">{formatTime(booking.returningFlight.departureTime)} - {formatTime(booking.returningFlight.arrivalTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FaUser className="h-5 w-5 text-[#0047ab]" />
              Passengers ({booking.passengers.length})
            </h3>
            <div className="space-y-3">
              {booking.passengers.map((passenger) => (
                <div key={passenger.id} className="rounded-xl bg-[#f5f7fb] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {passenger.firstName} {passenger.middleInitial ? `${passenger.middleInitial}. ` : ''}{passenger.lastName}
                      </p>
                      <p className="text-sm text-[#6c7aa5]">{passenger.email}</p>
                      {passenger.phone && <p className="text-sm text-[#6c7aa5]">{passenger.phone}</p>}
                    </div>
                    <span className="rounded-full bg-[#0047ab]/10 px-3 py-1 text-xs font-semibold text-[#0047ab] capitalize">
                      {passenger.passengerType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FaChair className="h-5 w-5 text-[#0047ab]" />
              Seats ({booking.seats.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <span
                  key={seat.id}
                  className="rounded-lg bg-[#0047ab]/10 px-3 py-2 text-sm font-semibold text-[#0047ab]"
                >
                  {seat.seatNumber}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#dbe5ff] pt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Total Amount</p>
              <p className="text-2xl font-bold text-[#0047ab]">
                PHP {booking.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 rounded-lg bg-[#0047ab] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d5ed6]"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-[#dbe5ff] bg-white px-4 py-2 text-sm font-semibold text-[#001d45] transition hover:bg-[#f5f7fb]"
        >
          Print
        </button>
      </div>
    </div>
  );
}

