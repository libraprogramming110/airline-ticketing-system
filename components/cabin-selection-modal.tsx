"use client";

import { useState, useEffect } from "react";
import { FaXmark, FaChair } from "react-icons/fa6";
import { getCabinAvailabilityAction } from "@/server/actions/getCabinAvailability";

type CabinClass = "Economy" | "Business Class" | "First Class";

interface CabinOption {
  name: CabinClass;
  description: string;
  availableSeats: number;
  color: string;
  bgColor: string;
}

interface CabinSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cabinClass: CabinClass) => void;
  flightId: string;
  flightPrice: number;
  adults: number;
  children: number;
}

export default function CabinSelectionModal({
  isOpen,
  onClose,
  onSelect,
  flightId,
  flightPrice,
  adults,
  children,
}: CabinSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cabinOptions, setCabinOptions] = useState<CabinOption[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<CabinClass | null>(null);

  const totalPassengers = adults + children;

  useEffect(() => {
    if (isOpen && flightId) {
      loadCabinAvailability();
    }
  }, [isOpen, flightId]);

  const loadCabinAvailability = async () => {
    setLoading(true);
    try {
      const cabins: CabinClass[] = ["Economy", "Business Class", "First Class"];
      const availabilityPromises = cabins.map(async (cabin) => {
        const result = await getCabinAvailabilityAction(flightId, cabin);
        const availableSeats = result.success ? result.count : 0;
        
        if (result.error) {
          console.error(`Error checking ${cabin}:`, result.error);
        }
        
        return {
          name: cabin,
          description: getCabinDescription(cabin),
          availableSeats,
          color: getCabinColor(cabin),
          bgColor: getCabinBgColor(cabin),
        };
      });

      const options = await Promise.all(availabilityPromises);
      setCabinOptions(options);
    } catch (error) {
      console.error("Failed to load cabin availability:", error);
      setCabinOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const getCabinDescription = (cabin: CabinClass): string => {
    switch (cabin) {
      case "First Class":
        return "Premium comfort with spacious seats and exclusive amenities";
      case "Business Class":
        return "Enhanced comfort with priority service and extra legroom";
      default:
        return "Comfortable seating with standard amenities";
    }
  };

  const getCabinColor = (cabin: CabinClass): string => {
    switch (cabin) {
      case "First Class":
        return "text-[#d4af37]";
      case "Business Class":
        return "text-[#0047ab]";
      default:
        return "text-[#10b981]";
    }
  };

  const getCabinBgColor = (cabin: CabinClass): string => {
    switch (cabin) {
      case "First Class":
        return "bg-[#d4af37]/20";
      case "Business Class":
        return "bg-[#0047ab]/20";
      default:
        return "bg-[#10b981]/20";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleSelect = () => {
    if (selectedCabin) {
      onSelect(selectedCabin);
    }
  };

  const isCabinAvailable = (availableSeats: number): boolean => {
    return availableSeats >= totalPassengers;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-[#001d45]">Select Cabin Class</h2>
            <p className="text-sm text-[#6c7aa5] mt-1">
              Choose your preferred cabin class for {totalPassengers} passenger{totalPassengers > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#6c7aa5] hover:bg-[#f5f7fb] transition"
            aria-label="Close modal"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[#6c7aa5]">Loading cabin availability...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cabinOptions.map((cabin) => {
                const available = isCabinAvailable(cabin.availableSeats);
                
                return (
                  <button
                    key={cabin.name}
                    onClick={() => available && setSelectedCabin(cabin.name)}
                    disabled={!available}
                    className={`w-full text-left rounded-xl border-2 p-6 transition ${
                      selectedCabin === cabin.name
                        ? `${cabin.bgColor} border-[#0047ab] ring-2 ring-[#0047ab] ring-offset-2`
                        : available
                        ? "border-[#dbe5ff] bg-white hover:border-[#0047ab]/50 hover:bg-[#f5f7fb]"
                        : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`rounded-lg px-3 py-1 ${cabin.bgColor}`}>
                            <span className={`text-sm font-semibold ${cabin.color}`}>
                              {cabin.name}
                            </span>
                          </div>
                          {!available && (
                            <span className="text-xs font-semibold text-red-600">
                              Not enough seats
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6c7aa5] mb-3">{cabin.description}</p>
                        <div className="flex items-center gap-2 text-sm text-[#6c7aa5]">
                          <FaChair className="h-4 w-4" />
                          <span>
                            {cabin.availableSeats} seat{cabin.availableSeats !== 1 ? "s" : ""} available
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-2xl font-bold text-[#001d45]">
                          {formatPrice(flightPrice)}
                        </p>
                        <p className="text-sm text-[#6c7aa5]">per passenger</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-[#f5f7fb] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#6c7aa5]">
              {selectedCabin ? (
                <span>
                  Selected: <span className="font-semibold text-[#001d45]">{selectedCabin}</span>
                </span>
              ) : (
                "Please select a cabin class to continue"
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#dbe5ff] bg-white px-6 py-2 text-sm font-semibold text-[#6c7aa5] hover:bg-[#f5f7fb] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSelect}
                disabled={!selectedCabin}
                className="rounded-lg bg-[#0047ab] px-6 py-2 text-sm font-semibold text-white hover:bg-[#003d9e] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

