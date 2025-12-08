"use client";

import { FaEye } from "react-icons/fa6";

export default function SignInForm() {
  return (
    <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-[#001d45] shadow-[0_25px_45px_rgba(0,0,0,0.35)]">
      <FormHeader />
      <SignInFormFields />
      <CreateAccountLink />
    </section>
  );
}

function FormHeader() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-[#0047ab]">Welcome Back!</h1>
      <p className="mt-2 text-sm text-[#6c7aa5]">Please enter your details.</p>
    </div>
  );
}

function SignInFormFields() {
  return (
    <form className="mt-8 space-y-5">
      <EmailField />
      <PasswordField />
      <RememberMeSection />
      <SignInButton />
    </form>
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

function RememberMeSection() {
  return (
    <div className="flex items-center justify-between text-sm text-[#4a5b82]">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="rounded border-[#dbe5ff]" />
        Remember Me
      </label>
      <a href="#" className="font-semibold text-[#0047ab]">
        Forgot Password?
      </a>
    </div>
  );
}

function SignInButton() {
  return (
    <button
      type="button"
      className="w-full rounded-full bg-[#0047ab] py-3 text-lg font-semibold text-white transition hover:bg-[#1d5ed6]"
    >
      Sign in
    </button>
  );
}

function CreateAccountLink() {
  return (
    <div className="mt-6 text-center text-sm text-[#4a5b82]">
      Don&rsquo;t have an account?{" "}
      <a href="/sign-up" className="font-semibold text-[#0047ab]">
        Create an account
      </a>
    </div>
  );
}

