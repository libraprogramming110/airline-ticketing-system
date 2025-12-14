"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Flag from "react-flagkit";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { signUp } from "@/server/actions/signUp";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      if (data.phone) {
        formData.append("phone", data.phone);
      }
      formData.append("password", data.password);
      if (data.termsAccepted) {
        formData.append("termsAccepted", "on");
      }

      const result = await signUp(formData);

      if (!result.success) {
        setError(result.error || "Failed to create account");
        setIsSubmitting(false);
      }
    } catch (error) {
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
      <div className="grid grid-cols-2 gap-4">
        <FirstNameField register={register} error={errors.firstName} />
        <LastNameField register={register} error={errors.lastName} />
      </div>
      <EmailField register={register} error={errors.email} />
      <PhoneNumberField register={register} />
      <PasswordField
        register={register}
        error={errors.password}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />
      <TermsCheckbox register={register} error={errors.termsAccepted} />
      <SignUpButton isSubmitting={isSubmitting} />
    </form>
  );
}

function FirstNameField({
  register,
  error,
}: {
  register: any;
  error?: { message?: string };
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>First Name</span>
      <input
        type="text"
        placeholder="Enter your first name"
        {...register("firstName")}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[#dbe5ff] focus:border-[#0047ab]"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </label>
  );
}

function LastNameField({
  register,
  error,
}: {
  register: any;
  error?: { message?: string };
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#001d45]">
      <span>Last Name</span>
      <input
        type="text"
        placeholder="Enter your last name"
        {...register("lastName")}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[#dbe5ff] focus:border-[#0047ab]"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </label>
  );
}

function EmailField({
  register,
  error,
}: {
  register: any;
  error?: { message?: string };
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
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </label>
  );
}

function PhoneNumberField({ register }: { register: any }) {
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
          {...register("phone")}
          className="flex-1 bg-transparent text-base outline-none"
        />
      </div>
    </label>
  );
}

function PasswordField({
  register,
  error,
  showPassword,
  onTogglePassword,
}: {
  register: any;
  error?: { message?: string };
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
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </label>
  );
}

function TermsCheckbox({
  register,
  error,
}: {
  register: any;
  error?: { message?: string };
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm text-[#4a5b82]">
        <input
          type="checkbox"
          {...register("termsAccepted")}
          className="rounded border-[#dbe5ff]"
        />
        <span>I agree to our Terms of Services and Privacy Policy.</span>
      </label>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

function SignUpButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-full bg-[#0047ab] py-3 text-lg font-semibold text-white transition hover:bg-[#1d5ed6] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Creating account..." : "Sign up"}
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
