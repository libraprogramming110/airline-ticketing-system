"use client";

import { FaXmark } from "react-icons/fa6";

type DeleteBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
};

export default function DeleteBookingModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}: DeleteBookingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#001d45]">Confirm Deletion</h2>
          <button
            onClick={onClose}
            className="text-[#6c7aa5] hover:text-[#001d45] transition"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        </div>

        <p className="text-[#001d45] mb-6">
          Are you sure you want to delete {selectedCount} booking{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#eef2ff] text-[#001d45] font-semibold hover:bg-[#dbe5ff] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

