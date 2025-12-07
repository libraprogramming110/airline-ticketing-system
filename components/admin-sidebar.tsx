"use client";

import { useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

interface AdminSidebarProps {
  activePage?: "home" | "booking" | "flights" | "reports" | "profile";
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { label: "Home", href: "/admin/home", key: "home" },
    { label: "Booking", href: "/admin/booking", key: "booking" },
    { label: "Flights", href: "/admin/flights", key: "flights" },
    { label: "Reports", href: "/admin/sales-summary", key: "reports" },
    { label: "Profile", href: "/admin/profile", key: "profile" },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    alert("You have been logged out successfully.");
  };

  return (
    <>
      <aside className="sticky top-0 flex h-screen w-64 flex-col gap-8 border-r border-white/10 bg-gradient-to-b from-[#081024] to-[#02050e] px-6 py-10 text-white">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold">
            JC
          </div>
          <p className="mt-4 text-base font-semibold">John Carlo Cruz</p>
          <p className="text-sm text-white/60">@johncarlocruz</p>
        </div>

        <nav className="flex flex-1 flex-col gap-4 text-sm font-semibold">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${
                activePage === item.key ? "bg-white/10" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition hover:bg-white/10"
          >
            <FaArrowRightFromBracket className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </nav>
      </aside>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="relative flex max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#001d45]">Confirm Logout</h3>
            <p className="text-sm text-[#6c7aa5]">Are you sure you want to log out?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-[#dbe5ff] bg-white px-6 py-3 text-sm font-semibold text-[#001d45] transition hover:bg-[#f5f7fb]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-[#FF3030] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e02929]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

