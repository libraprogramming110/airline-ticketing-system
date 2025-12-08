/* eslint-disable @next/next/no-img-element */

import SignUpForm from "@/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#001d45] px-6 py-16 text-white md:px-12"
      style={{
        backgroundImage: "url(/img/background.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        <img
          src="/airline-logo.svg"
          alt="Omnira Airlines"
          className="h-auto w-48"
        />
        <SignUpForm />
      </div>
    </main>
  );
}

