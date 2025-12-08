'use client';

import { useRouter } from 'next/navigation';

type DatePrice = {
  date: string;
  lowest_price: number;
};

type DateSelectionCardsProps = {
  originCode: string;
  destinationCode: string;
  selectedDate: string;
  originalDepartureDate: string;
  datePrices: DatePrice[];
  adults: number;
  children: number;
};

export default function DateSelectionCards({
  originCode,
  destinationCode,
  selectedDate,
  originalDepartureDate,
  datePrices,
  adults,
  children,
}: DateSelectionCardsProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleDateClick = (date: string) => {
    const params = new URLSearchParams({
      origin: originCode,
      destination: destinationCode,
      departureDate: date,
      originalDepartureDate: originalDepartureDate || date,
      adults: adults.toString(),
      children: children.toString(),
    });
    router.push(`/search-flights?${params.toString()}`);
  };

  if (datePrices.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-lg bg-[#eef2ff] py-4">
      <div className="flex items-center gap-4 overflow-x-auto px-4 pr-20">
        {datePrices.map((item) => (
          <DateCard
            key={item.date}
            date={formatDate(item.date)}
            price={formatPrice(item.lowest_price)}
            selected={item.date === selectedDate}
            onClick={() => handleDateClick(item.date)}
          />
        ))}
      </div>
      {datePrices.length > 4 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <NavigationButton />
        </div>
      )}
    </div>
  );
}

function DateCard({
  date,
  price,
  selected,
  onClick,
}: {
  date: string;
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex min-w-[140px] flex-col gap-2 overflow-hidden rounded-lg border-2 bg-white p-4 pt-5 text-left transition hover:shadow-md ${
        selected
          ? "border-[#0047ab] shadow-sm"
          : "border-[#dbe5ff] hover:border-[#0047ab]"
      }`}
    >
      {selected && (
        <div className="absolute left-0 top-0 h-2 w-full bg-[#0047ab]" />
      )}
      <span className="text-xs text-[#6c7aa5]">{date}</span>
      <span className="text-lg font-bold text-[#001d45]">PHP {price}</span>
    </button>
  );
}

function NavigationButton() {
  return (
    <button className="flex h-[100px] w-12 shrink-0 items-center justify-center rounded-lg bg-[#0047ab] text-white transition hover:bg-[#003d9e]">
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

