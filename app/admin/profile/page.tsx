/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import Flag from "react-flagkit";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

const contactOptions = [
  { label: "Personal Information", active: true },
  { label: "Change Password", active: false },
  { label: "Delete Account", active: false },
];

export default function AdminProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <ProfileContent />
        </section>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-8 border-r border-white/10 bg-gradient-to-b from-[#081024] to-[#02050e] px-6 py-10 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold">
          JC
        </div>
        <p className="mt-4 text-base font-semibold">John Carlo Cruz</p>
        <p className="text-sm text-white/60">@johncarlocruz</p>
      </div>

      <nav className="flex flex-1 flex-col gap-4 text-sm font-semibold">
        {["Home", "Booking", "Flights", "Reports", "Profile", "Log out"].map((item) => {
          const href =
            item === "Home"
              ? "/admin/home"
              : item === "Booking"
                ? "/admin/booking"
                : item === "Flights"
                  ? "/admin/flights"
                  : item === "Reports"
                    ? "/admin/sales-summary"
                    : item === "Profile"
                      ? "/admin/profile"
                      : "#";
          return (
            <a
              key={item}
              href={href}
              className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${item === "Profile" ? "bg-white/10" : ""}`}
            >
              {item}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="border-b border-[#dbe5ff] bg-white px-8 py-4 shadow-sm">
      <img src="/airline-logo2.svg" alt="Omnira Administration" className="h-14 w-auto" />
    </header>
  );
}

function ProfileContent() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(320px,0.85fr)_minmax(480px,1.15fr)]">
      <ProfileCard />
      <PersonalInformationForm />
    </section>
  );
}

function ProfileCard() {
  return (
    <article className="rounded-3xl bg-white p-6 text-center shadow-sm">
      <ProfileImage />
      <h2 className="mt-4 text-xl font-semibold text-[#001d45]">John Carlo Cruz</h2>
      <p className="text-sm text-[#6c7aa5]">Customer Service Lead</p>
      <div className="mt-6 space-y-3">
        {contactOptions.map((option) => (
          <button
            key={option.label}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold ${
              option.active ? "bg-[#0b5ed7] text-white" : "bg-[#eef2ff] text-[#001d45]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function ProfileImage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mx-auto block h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform hover:scale-105"
      >
        <img
          src="/img/background.svg"
          alt="Profile picture"
          className="h-full w-full object-cover"
        />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative flex max-w-2xl flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <img
                src="/img/background.svg"
                alt="Profile picture"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg bg-[#0b5ed7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#094fb4]">
                <FaPenToSquare className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#FF3030] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e02929]">
                <FaTrash className="h-4 w-4" />
                <span>Delete Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const personalFields = [
  { label: "First Name", value: "John Carlo" },
  { label: "Last Name", value: "Cruz" },
  { label: "Email", value: "Enter your email" },
  { label: "Phone Number", value: "+63" },
  { label: "Address", value: "Enter your address" },
  { label: "City", value: "" },
  { label: "Province", value: "" },
  { label: "Date of Birth", value: "December 15, 2000" },
  { label: "Sex", value: "Male" },
];

function PersonalInformationForm() {
  return (
    <article className="flex flex-col rounded-3xl bg-white shadow-sm">
      <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Personal Information</h2>
      </header>
      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          {personalFields.map((field) => (
            <label key={field.label} className="space-y-2 text-sm">
              <span className="text-[#6c7aa5]">{field.label}</span>
              {field.label === "Phone Number" ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#dbe5ff] bg-white px-4 py-2">
                  <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full shrink-0">
                    <Flag country="PH" size={20} />
                  </div>
                  <input
                    type="text"
                    value={field.value}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-[#001d45] placeholder:text-[#9aa6c1] outline-none"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={field.value}
                  readOnly
                  className="w-full rounded-lg border border-[#dbe5ff] bg-white px-4 py-2 text-sm text-[#001d45] placeholder:text-[#9aa6c1]"
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="w-full max-w-xs rounded-lg bg-[#0b5ed7] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#094fb4]">
            Edit Personal Information
          </button>
        </div>
      </div>
    </article>
  );
}


