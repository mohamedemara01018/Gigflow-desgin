/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
    dispatch(toastify({ message, type, duration }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (email && !isLoading && !isSent) {
        setIsLoading(true);
        setIsSent(true)
        const res = await authService.forgetPassword({ email });
        handleAddToastification(String(res.message), "success", DURATION);
      }
    } catch (error: any) {
      handleAddToastification(String(error), "error", DURATION);
      setIsSent(false)
    } finally {
      setIsLoading(false)
    }

  };

  const buttonGradient = isSent
    ? undefined
    : 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-primary) 100%)';

  const buttonHoverGradient =
    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-container) 80%, white) 0%, color-mix(in srgb, var(--color-primary) 80%, white) 100%)';

  return (
    <div className=" flex flex-col font-['Inter'] text-[16px] leading-6 font-normal bg-background text-on-surface antialiased">
      {/* Main Content: Centered Forgot Password Card */}
      <main className="grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div
            className="rounded-xl border border-outline-variant p-8 flex flex-col items-center text-center"
            style={{ boxShadow: 'var(--shadow-level-2)' }}
          >
            {/* Icon/Avatar Section */}
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
              <KeyRound className="text-primary" size={36} />
            </div>

            <h1 className="font-['Geist'] text-[32px] leading-10 font-semibold tracking-[-0.01em] md:text-[28px] md:leading-9 text-on-surface mb-2">
              Forgot Password?
            </h1>

            <p className="font-['Inter'] text-[16px] leading-6 text-on-surface-variant mb-8 max-w-70">
              No worries, we&apos;ll send you reset instructions.
            </p>

            {/* Form Section */}
            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="relative group ">

                <div className="relative ">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={22} />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-0 focus:outline-none focus:border-primary transition-colors font-['Inter'] text-[16px] leading-6 text-on-surface"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isSent}
                  />
                </div>
              </div>

              <button
                className={`w-full text-on-primary py-3 px-6 rounded-lg font-['Geist'] text-[14px] leading-5 font-medium tracking-[0.01em] transition-all duration-200 ${isSent
                  ? "bg-primary-container cursor-default"
                  : isLoading
                    ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] opacity-80 cursor-wait"
                    : "shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-[0.98]"
                  }`}
                style={{ background: buttonGradient }}
                onMouseEnter={(e) => {
                  if (!isLoading && !isSent) e.currentTarget.style.background = buttonHoverGradient;
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && !isSent) e.currentTarget.style.background = buttonGradient ?? '';
                }}
                type="submit"
                disabled={isLoading || isSent}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </span>
                ) : isSent ? (
                  "Reset Link Sent!"
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-['Geist'] text-[14px] leading-5 font-medium tracking-[0.01em] text-secondary hover:text-primary transition-colors group"
              >
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={18} />
                Back to Login
              </Link>
            </div>
          </div>

          {/* Contextual Helper */}
          <p className="text-center mt-4 font-['Inter'] text-[14px] leading-5 font-normal text-on-surface-variant">
            Having trouble?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact our support team
            </Link>.
          </p>
        </div>
      </main >
    </div >
  );
}