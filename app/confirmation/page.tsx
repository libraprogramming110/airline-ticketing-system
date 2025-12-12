/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressIndicator from "@/components/booking-progress-indicator";
import { getBookingAction } from "@/server/actions/getBooking";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FaCheck,
  FaPlane,
  FaCalendar,
  FaCreditCard,
  FaEnvelope,
  FaPhone,
  FaChair,
  FaDownload,
  FaCircleCheck,
  FaClipboardList,
  FaPaperPlane,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { SiteHeader } from "@/components/site-header";
import type { BookingDetails } from "@/server/services/bookingService";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader navLinks={[{ label: "Blog", href: "/blog" }]} />
      <BookingProgressIndicator currentStep={4} />
      <Suspense
        fallback={
          <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-lg bg-white p-8 text-center">
                <p className="text-lg text-[#6c7aa5]">Loading booking details...</p>
              </div>
            </div>
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}


function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const printContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBooking() {
      const bookingRef = searchParams.get('bookingReference');
      if (!bookingRef) {
        setError('Booking reference not found');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getBookingAction(bookingRef);
        if (result.success && result.booking) {
          setBooking(result.booking);
        } else {
          setError(result.error || 'Failed to load booking');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooking();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-lg text-[#6c7aa5]">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center">
            <p className="text-lg text-red-800">{error || 'Booking not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPassengers = booking.passengers.length || 1;
  const currentPassenger = booking.passengers[currentPassengerIndex] || null;

  const goToPreviousPassenger = () => {
    setCurrentPassengerIndex((prev) => (prev > 0 ? prev - 1 : totalPassengers - 1));
  };

  const goToNextPassenger = () => {
    setCurrentPassengerIndex((prev) => (prev < totalPassengers - 1 ? prev + 1 : 0));
  };

  const handleDownloadPDF = async () => {
    if (!printContentRef.current) return;

    try {
      const canvas = await html2canvas(printContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
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
      
      const passengerName = currentPassenger 
        ? `${currentPassenger.firstName}_${currentPassenger.lastName}`.replace(/\s+/g, '_')
        : 'Guest';
      pdf.save(`Booking_${booking.bookingReference}_${passengerName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="bg-[#f5f7fb] px-8 py-12 md:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="no-print">
          <BookingConfirmedMessage />
          {totalPassengers > 1 && (
            <PassengerNavigation
              currentIndex={currentPassengerIndex}
              totalPassengers={totalPassengers}
              onPrevious={goToPreviousPassenger}
              onNext={goToNextPassenger}
              passengerName={currentPassenger ? `${currentPassenger.firstName} ${currentPassenger.lastName}` : 'Guest Passenger'}
            />
          )}
        </div>
        <div ref={printContentRef} className="print-content" data-print-content>
        <ConfirmationDetailsSection 
          booking={booking} 
          currentPassenger={currentPassenger}
        />
          <BoardingPassCard 
            bookingReference={booking.bookingReference}
            passengerName={currentPassenger ? `${currentPassenger.firstName} ${currentPassenger.lastName}` : 'Guest Passenger'}
            passengerIndex={currentPassengerIndex}
            totalPassengers={totalPassengers}
          />
        </div>
        <div className="no-print">
          <ConfirmationActionButtons 
            onDownloadPDF={handleDownloadPDF}
            onPrintTicket={handlePrintTicket}
          />
        </div>
      </div>
    </div>
  );
}

function BookingConfirmedMessage() {
  return (
    <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-6 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-500">
          <FaCheck className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#001d45]">Booking Confirmed!</h2>
          <p className="mt-1 text-base text-[#6c7aa5]">
            Your transaction was successful. See you on board soon!
          </p>
        </div>
      </div>
    </div>
  );
}

function PassengerNavigation({
  currentIndex,
  totalPassengers,
  onPrevious,
  onNext,
  passengerName,
}: {
  currentIndex: number;
  totalPassengers: number;
  onPrevious: () => void;
  onNext: () => void;
  passengerName: string;
}) {
  return (
    <div className="rounded-lg bg-white shadow-md p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eef2ff] text-[#0047ab] transition hover:bg-[#0047ab] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
          aria-label="Previous passenger"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center px-4">
          <p className="text-sm text-[#6c7aa5]">Passenger</p>
          <p className="text-lg font-bold text-[#001d45]">{passengerName}</p>
          <p className="text-xs text-[#6c7aa5] mt-1">
            {currentIndex + 1} of {totalPassengers}
          </p>
        </div>
        <button
          onClick={onNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eef2ff] text-[#0047ab] transition hover:bg-[#0047ab] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab]"
          aria-label="Next passenger"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ConfirmationDetailsSection({ 
  booking,
  currentPassenger,
}: { 
  booking: BookingDetails;
  currentPassenger: {
    id: string;
    firstName: string;
    lastName: string;
    middleInitial: string | null;
    email: string;
    phone: string | null;
    passengerType: string;
  } | null;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const departingSeats = booking.seats.filter(s => s.flightId === booking.departingFlight.id);
  const returningSeats = booking.returningFlight 
    ? booking.seats.filter(s => s.flightId === booking.returningFlight!.id)
    : [];

  const formatPassengerName = (passenger: { firstName: string; lastName: string; middleInitial: string | null }) => {
    const middle = passenger.middleInitial ? ` ${passenger.middleInitial}.` : '';
    return `${passenger.firstName}${middle} ${passenger.lastName}`;
  };

  const currentPassengerName = currentPassenger 
    ? formatPassengerName(currentPassenger)
    : 'Guest Passenger';

  const primaryPassenger = booking.passengers.length > 0 ? booking.passengers[0] : null;
  const contactEmail = primaryPassenger?.email || '';
  const contactPhone = primaryPassenger?.phone || '';

  return (
    <div className="rounded-lg bg-white shadow-md overflow-hidden">
      <ConfirmationDetailsHeader />
      <div className="p-6 space-y-6">
        <BookingReferenceSection bookingReference={booking.bookingReference} paymentStatus={booking.paymentStatus} />
        <div className="border-t border-dashed border-[#dbe5ff]" />
        <FlightSection
          title="Departure Flight"
          from={booking.departingFlight.origin}
          to={booking.departingFlight.destination}
          flightNumber={booking.departingFlight.flightNumber}
          passengerName={currentPassengerName}
          departureDate={formatDate(booking.departingFlight.date)}
          departureTime={formatTime(booking.departingFlight.departureTime)}
          arrivalDate={formatDate(booking.departingFlight.date)}
          arrivalTime={formatTime(booking.departingFlight.arrivalTime)}
          showSeat={departingSeats.length > 0}
          seat={departingSeats.length > 0 ? departingSeats.map(s => s.seatNumber).join(', ') : undefined}
        />
        {booking.returningFlight && (
          <>
            <div className="border-t border-dashed border-[#dbe5ff]" />
            <FlightSection
              title="Return Flight"
              from={booking.returningFlight.origin}
              to={booking.returningFlight.destination}
              flightNumber={booking.returningFlight.flightNumber}
              passengerName={currentPassengerName}
              departureDate={formatDate(booking.returningFlight.date)}
              departureTime={formatTime(booking.returningFlight.departureTime)}
              arrivalDate={formatDate(booking.returningFlight.date)}
              arrivalTime={formatTime(booking.returningFlight.arrivalTime)}
              showSeat={returningSeats.length > 0}
              seat={returningSeats.length > 0 ? returningSeats.map(s => s.seatNumber).join(', ') : undefined}
            />
          </>
        )}
        <div className="border-t border-dashed border-[#dbe5ff]" />
        <ContactInfoSection email={contactEmail} phone={contactPhone} />
        <PaymentMethodSection paymentMethod={booking.paymentMethod || 'N/A'} />
        <ImportantInfoSection />
      </div>
    </div>
  );
}

function ConfirmationDetailsHeader() {
  return (
    <div className="bg-[#0047ab] px-6 py-4">
      <h2 className="text-xl font-bold text-white">Confirmation Details</h2>
    </div>
  );
}

function BookingReferenceSection({ 
  bookingReference, 
  paymentStatus 
}: { 
  bookingReference: string;
  paymentStatus: string;
}) {
  return (
    <div className="flex items-center justify-between bg-[#f5f7fb] px-4 py-3 rounded-lg">
      <div>
        <p className="text-sm text-[#6c7aa5]">Booking Reference</p>
        <p className="text-lg font-bold text-[#001d45]">{bookingReference}</p>
      </div>
      <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
        paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
      }`}>
        <FaCheck className="h-4 w-4 text-white" />
        <span className="text-sm font-semibold text-white capitalize">{paymentStatus}</span>
      </div>
    </div>
  );
}

function FlightSection({
  title,
  from,
  to,
  flightNumber,
  passengerName,
  departureDate,
  departureTime,
  arrivalDate,
  arrivalTime,
  showSeat,
  seat,
}: {
  title: string;
  from: string;
  to: string;
  flightNumber: string;
  passengerName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  showSeat: boolean;
  seat?: string;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#001d45]">{title}</h3>
      <FlightRouteBar from={from} to={to} />
      <div className="space-y-4">
        <div className={`grid grid-cols-1 gap-4 ${showSeat ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          <InfoCard
            icon={FaUser}
            label="Passenger Name"
            value={passengerName}
          />
          <InfoCard
            icon={FaPlane}
            label="Flight Number"
            value={flightNumber}
          />
          {showSeat && (
            <InfoCard icon={FaChair} label="Seat" value={seat || "TBA"} />
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard
            icon={FaCalendar}
            label="Departure Date"
            value={`${departureDate} ${departureTime}`}
          />
          <InfoCard
            icon={FaCalendar}
            label="Arrival Date"
            value={`${arrivalDate} ${arrivalTime}`}
          />
        </div>
      </div>
    </div>
  );
}

function FlightRouteBar({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative rounded-full bg-[#eef2ff] px-6 py-4">
      <div className="relative flex items-center justify-between">
        <div className="text-center z-10 bg-[#eef2ff] px-2">
          <p className="text-xs text-[#6c7aa5]">From</p>
          <p className="text-base font-bold text-[#001d45]">{from}</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="rounded-full bg-[#0047ab] p-2">
            <FaPlane className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 border-t-2 border-dotted border-[#0047ab] opacity-30" />
        <div className="text-center z-10 bg-[#eef2ff] px-2">
          <p className="text-xs text-[#6c7aa5]">To</p>
          <p className="text-base font-bold text-[#001d45]">{to}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-[#dbe5ff] p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
          <Icon className="h-4 w-4 text-[#0047ab]" />
        </div>
        <p className="text-xs font-semibold text-[#6c7aa5]">{label}</p>
      </div>
      <p className="text-sm font-bold text-[#001d45]">{value}</p>
    </div>
  );
}

function ContactInfoSection({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-[#001d45]">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-lg bg-[#eef2ff] p-4">
        <div className="flex items-center gap-3">
          <FaEnvelope className="h-5 w-5 text-[#0047ab]" />
          <div>
            <p className="text-xs text-[#6c7aa5]">Email</p>
            <p className="text-sm font-semibold text-[#0047ab]">
              {email || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaPhone className="h-5 w-5 text-[#0047ab]" />
          <div>
            <p className="text-xs text-[#6c7aa5]">Phone No.</p>
            <p className="text-sm font-semibold text-[#0047ab]">
              {phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSection({ paymentMethod }: { paymentMethod: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-[#001d45]">Payment Method</h3>
      <div className="rounded-lg bg-[#eef2ff] p-4">
        <div className="flex items-center gap-3">
          <FaCreditCard className="h-5 w-5 text-[#0047ab]" />
          <p className="text-sm font-semibold text-[#001d45]">{paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}

function ImportantInfoSection() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-[#001d45]">Important Information</h3>
      <div className="relative rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <ul className="space-y-2 text-sm text-[#001d45]">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001d45]" />
            <span>
              Please arrive at the airport at least 2 hours before departure
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001d45]" />
            <span>Valid government-issued ID is required for check-in</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001d45]" />
            <span>Check-in counters close 45 minutes before departure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001d45]" />
            <span>Please review baggage allowance and restrictions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function BoardingPassCard({ 
  bookingReference,
  passengerName,
  passengerIndex,
  totalPassengers,
}: { 
  bookingReference: string;
  passengerName: string;
  passengerIndex: number;
  totalPassengers: number;
}) {
  const barcodePattern = [2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 2, 1, 3, 1];
  
  return (
    <div className="rounded-lg bg-white shadow-md overflow-hidden">
      <div className="border-t-2 border-dashed border-[#0047ab] mb-6" />
      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-0.5">
            {barcodePattern.map((width, i) => (
              <div
                key={i}
                className={`h-20 bg-black`}
                style={{ width: `${width * 2}px` }}
              />
            ))}
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-base font-semibold text-[#001d45]">{bookingReference}</p>
          <p className="text-sm font-semibold text-[#0047ab]">{passengerName}</p>
          {totalPassengers > 1 && (
            <p className="text-xs text-[#6c7aa5]">Passenger {passengerIndex + 1} of {totalPassengers}</p>
          )}
        </div>
        <div className="text-center pt-2">
          <p className="text-sm text-[#6c7aa5]">
            For airport check-in use only. Please present this at check-in counter or gate.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConfirmationActionButtons({ 
  onDownloadPDF, 
  onPrintTicket 
}: { 
  onDownloadPDF: () => void;
  onPrintTicket: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0047ab] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] w-auto max-w-[180px]"
        >
          <FaDownload className="h-4 w-4" />
          Download PDF
        </button>
        <button
          type="button"
          onClick={onPrintTicket}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#6c7aa5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a6889] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c7aa5] w-auto max-w-[180px]"
        >
          <FaDownload className="h-4 w-4" />
          Print Ticket
        </button>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/get-started"
          className="inline-flex items-center justify-center rounded-lg border border-[#0047ab] bg-white px-6 py-3 text-sm font-semibold text-[#0047ab] transition hover:bg-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] w-auto max-w-[200px]"
        >
          Home
        </Link>
        <button
          type="button"
          onClick={() => router.push('/get-started')}
          className="rounded-lg bg-[#0047ab] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003d9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047ab] w-auto max-w-[240px]"
        >
          Continue for New Booking
        </button>
      </div>
    </div>
  );
}

