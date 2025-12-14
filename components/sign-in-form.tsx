"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { type FieldError, type UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { signIn } from "@/server/actions/signIn";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        formData.append("redirectTo", redirectTo);
      }

      const result = await signIn(formData);

      if (!result.success) {
        setError(result.error || "Failed to sign in");
        setIsSubmitting(false);
      }
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('DOCTYPE') || errorMessage.includes('JSON') || errorMessage.includes('Unexpected token')) {
        setError('Authentication service configuration error. Please check your Supabase project settings.');
      } else {
        setError(errorMessage || "An unexpected error occurred");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <EmailField register={register} error={errors.email} />
      <PasswordField
        register={register}
        error={errors.password}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />
      <RememberMeSection />
      <SignInButton isSubmitting={isSubmitting} />
    </form>
  );
}

function EmailField({
  register,
  error,
}: {
  register: UseFormRegister<SignInFormData>;
  error?: FieldError;
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Email</span>
      <input
        type="email"
        placeholder="Enter your email"
        {...register("email")}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[#dbe5ff] focus:border-[#0047ab]"
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </label>
  );
}

function PasswordField({
  register,
  error,
  showPassword,
  onTogglePassword,
}: {
  register: UseFormRegister<SignInFormData>;
  error?: FieldError;
  showPassword: boolean;
  onTogglePassword: () => void;
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Password</span>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          {...register("password")}
          className={`w-full rounded-xl border px-4 py-3 text-base pr-10 outline-none transition ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-[#dbe5ff] focus:border-[#0047ab]"
          }`}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-3 flex items-center text-[#8a96b7] hover:text-[#0047ab] transition"
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5" />
          ) : (
            <FaEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
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

function SignInButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-full bg-[#0047ab] py-3 text-lg font-semibold text-white transition hover:bg-[#1d5ed6] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Signing in..." : "Sign in"}
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
