/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import FormError from "@/components/ui/FormError";
import { authService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";



export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notMatchMessage, setNotMatchMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const dispatch: AppDispatch = useDispatch();
  const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
    dispatch(toastify({ message, type, duration }))
  }

  useEffect(() => {
    let score = 0;
    if (newPassword.length > 5) score++;
    if (newPassword.length > 8 && /[A-Z]/.test(newPassword)) score++;
    if (newPassword.length > 10 && /[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStrength(score);
  }, [newPassword]);

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!newPassword) return
    if (!newPassword.includes(value)) {
      setNotMatchMessage('confirm password does not match new password')
    } else {
      setNotMatchMessage('')
    }
    setConfirmPassword(value)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim() !== confirmPassword.trim()) {
      setNotMatchMessage("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword({
        token,
        password: newPassword.trim()
      })
      console.log(res)
      router.replace('/login')
      setIsSuccess(true);
      handleAddToastification(String(res.message), "error", DURATION);

    } catch (error: any) {
      handleAddToastification(String(error.message), "error", DURATION);
    } finally {
      setIsSubmitting(false)
    }
  };

  const getStrengthBarClass = (index: number) => {
    const base = "flex-1 rounded-full transition-colors duration-300 h-1 ";
    if (index < strength) {
      if (strength === 1) return base + "bg-error";
      if (strength === 2) return base + "bg-orange-400";
      if (strength === 3) return base + "bg-inverse-primary";
      if (strength === 4) return base + "bg-primary";
    }
    return base + "bg-surface-container-highest";
  };

  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  const buttonGradient = isSuccess
    ? undefined
    : 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-primary) 100%)';

  const buttonHoverGradient =
    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-container) 80%, white) 0%, color-mix(in srgb, var(--color-primary) 80%, white) 100%)';

  return (
    <div className=" flex flex-col ">
      <main className="grow flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Subtle Ambient Background Decorations */}


        <div className="w-full max-w-110 z-10">
          <div
            className=" backdrop-blur-sm border border-outline-variant rounded-xl p-8 md:p-10 space-y-8 transition-all duration-300"
            style={{ boxShadow: 'var(--shadow-level-2)' }}
          >
            <FormError error={notMatchMessage} />
            {/* Heading Group */}
            <div className="text-center space-y-2">
              <h1 className="font-['Geist'] text-[32px] leading-10 font-semibold tracking-[-0.01em] text-on-surface">
                Set New Password
              </h1>
              <p className="font-sans text-[16px] leading-6 font-normal text-on-surface-variant max-w-[320px] mx-auto">
                Your new password must be different from previous passwords.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="floating-label-input w-full h-14 px-4 bg-transparent border border-outline-variant rounded-lg font-sans text-[16px] text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 peer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <div className="px-1 space-y-2">
                  <div className="flex gap-1 h-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={getStrengthBarClass(i)}></div>
                    ))}
                  </div>
                  <span className={`block font-['Geist'] text-[12px] leading-4 font-semibold ${strength > 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {newPassword.length > 0 ? `Strength: ${strengthLabels[strength]}` : 'Password strength'}
                  </span>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="floating-label-input w-full h-14 px-4 bg-transparent border border-outline-variant rounded-lg font-sans text-[16px] text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 peer"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full h-14 text-on-primary font-['Geist'] text-[14px] leading-5 font-medium tracking-[0.01em] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isSuccess
                  ? "bg-primary"
                  : "shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-px active:scale-98"
                  }`}
                style={{ background: buttonGradient }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !isSuccess) e.currentTarget.style.background = buttonHoverGradient;
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && !isSuccess) e.currentTarget.style.background = buttonGradient ?? '';
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    Password Updated
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="text-center">
              <Link href="/login" className="font-['Geist'] text-[14px] leading-5 font-medium tracking-[0.01em] text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={20} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}