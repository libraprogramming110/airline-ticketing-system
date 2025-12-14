"use client";

import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { updateFlightAction } from "@/server/actions/updateFlight";
import { useRouter } from "next/navigation";

type FlightData = {
  id: string;
  flight: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  priceNumber: number;
};

type EditFlightModalProps = {
  flight: FlightData | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditFlightModal({ flight, isOpen, onClose }: EditFlightModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    departureTime: "",
    arrivalTime: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (flight) {
      setFormData({
        departureTime: flight.departureTime.substring(0, 5),
        arrivalTime: flight.arrivalTime.substring(0, 5),
      });
      setError("");
    }
  }, [flight]);

  if (!isOpen || !flight) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("flightId", flight.id);
    formDataToSend.append("departureTime", formData.departureTime);
    formDataToSend.append("arrivalTime", formData.arrivalTime);

    const result = await updateFlightAction(formDataToSend);

    if (result.success) {
      router.refresh();
      onClose();
    } else {
      setError(result.error || "Failed to update flight");
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-w-2xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#001d45]">Edit Flight</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6c7aa5] transition hover:bg-[#f5f7fb]"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-[#FF3030]/10 px-4 py-3 text-sm text-[#FF3030]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[#6c7aa5]">Departure Time</span>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#dbe5ff] bg-white px-4 py-2 text-sm text-[#001d45] focus:border-[#0047ab] focus:outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[#6c7aa5]">Arrival Time</span>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#dbe5ff] bg-white px-4 py-2 text-sm text-[#001d45] focus:border-[#0047ab] focus:outline-none"
              />
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dbe5ff] bg-white px-6 py-2 text-sm font-semibold text-[#001d45] transition hover:bg-[#f5f7fb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#0b5ed7] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#094fb4] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

