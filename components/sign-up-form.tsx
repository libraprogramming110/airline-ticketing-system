"use client";

import Flag from "react-flagkit";
import { FaEye } from "react-icons/fa6";

export default function SignUpForm() {
  return (
    <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-[#001d45] shadow-[0_25px_45px_rgba(0,0,0,0.35)]">
      <FormHeader />
      <SignUpFormFields />
      <SignInLink />
    </section>
  );
}

function FormHeader() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-[#0047ab]">Create Your Account</h1>
      <p className="mt-2 text-sm text-[#6c7aa5]">Please enter your details.</p>
    </div>
  );
}

function SignUpFormFields() {
  return (
    <form className="mt-8 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FirstNameField />
        <LastNameField />
      </div>
      <EmailField />
      <PhoneNumberField />
      <PasswordField />
      <TermsCheckbox />
      <SignUpButton />
    </form>
  );
}

function FirstNameField() {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>First Name</span>
      <input
        type="text"
        placeholder="Enter your first name"
        className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
      />
    </label>
  );
}

function LastNameField() {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Last Name</span>
      <input
        type="text"
        placeholder="Enter your last name"
        className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
      />
    </label>
  );
}

function EmailField() {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Email</span>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base outline-none transition focus:border-[#0047ab]"
      />
    </label>
  );
}

function PhoneNumberField() {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Phone Number</span>
      <div className="flex items-center gap-2 rounded-xl border border-[#dbe5ff] bg-white px-4 py-3 transition focus-within:border-[#0047ab]">
        <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full shrink-0">
          <Flag country="PH" size={20} />
        </div>
        <input
          type="tel"
          placeholder="+63 9123 463 7899"
          className="flex-1 bg-transparent text-base outline-none"
        />
      </div>
    </label>
  );
}

function PasswordField() {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Password</span>
      <div className="relative">
        <input
          type="password"
          placeholder="Enter password"
          className="w-full rounded-xl border border-[#dbe5ff] px-4 py-3 text-base pr-10 outline-none transition focus:border-[#0047ab]"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8a96b7]">
          <FaEye className="h-5 w-5" />
        </span>
      </div>
    </label>
  );
}

function TermsCheckbox() {
  return (
    <label className="flex items-center gap-2 text-sm text-[#4a5b82]">
      <input type="checkbox" className="rounded border-[#dbe5ff]" />
      <span>I agree to our Terms of Services and Privacy Policy.</span>
    </label>
  );
}

function SignUpButton() {
  return (
    <button
      type="button"
      className="w-full rounded-full bg-[#0047ab] py-3 text-lg font-semibold text-white transition hover:bg-[#1d5ed6]"
    >
      Sign up
    </button>
  );
}

function SignInLink() {
  return (
    <div className="mt-6 text-center text-sm text-[#4a5b82]">
      Already have an account?{" "}
      <a href="/sign-in" className="font-semibold text-[#0047ab]">
        Sign in
      </a>
    </div>
  );
}

