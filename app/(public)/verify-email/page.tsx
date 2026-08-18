/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { authService } from "@/services/auth.service";
import { fetchMe, selectMeSlice } from "@/store/slices/auth/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { ArrowLeft, Loader2, LoaderCircle, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";



export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { me } = useSelector(selectMeSlice)

  const dispatch: AppDispatch = useDispatch();
  const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
    dispatch(toastify({ message, type, duration }))
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  console.log('me in verify email', me)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      console.log(otp.join('').trim())
      const res = await authService.verfiyEmail({
        email: me?.email,
        code: otp.join('').trim()
      })
      console.log(res)
      handleAddToastification(String(res.message), "success", DURATION);
      window.location.reload();
      setOtp(["", "", "", "", "", ""])
    } catch (error: any) {
      handleAddToastification(String(error.message), "error", DURATION);
    } finally {
      setLoading(false)
    }
  };

  // console.log('me', me)

  const handleResend = async () => {
    if (timeLeft === 0) {
      setTimeLeft(59);
    }
    setResendLoading(true);
    try {
      const res = await authService.resendEmailCode({
        "email": me?.email
      })
      console.log(res)
      handleAddToastification(String(res.message), "success", DURATION);
    } catch (error: any) {
      handleAddToastification(String(error.message), "error", DURATION);
    } finally {
      setResendLoading(false)
    }
  };

  const handleLogin = async () => {
    await authService.logout();
    router.replace('/login')
  }

  return (
    <div className=" flex flex-col">
      {/* Main Content */}
      <main className="grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-120">
          {/* Card */}
          <div className="rounded-xl border border-outline-variant p-8 md:p-10 transition-all duration-300"
            style={{ boxShadow: 'var(--shadow-level-2)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-full py-4">
              </div>
              {/* Icon/Visual */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-inverse-on-surface">
                <MailOpen className="text-(--text-headline-lg-size)" />
              </div>
              <h1 className="font-sans text-headline-lg leading-10 mb-2">Verify your email</h1>
              <p className="text-body-md mb-8 max-w-[320px]">
                We&apos;ve sent a 6-digit verification code to your email. Please enter it below.
              </p>

              {/* OTP Input Container */}
              <form className="w-full space-y-8" onSubmit={handleSubmit}>
                <div className="flex justify-between gap-2 md:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                      className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl  bg-surface-variant text-body-lg  font-bold border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b2c] focus:border-transparent transition-all duration-200"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-sans text-sm leading-5 tracking-[0.01em] font-medium text-white uppercase transition-all duration-200 ${loading
                    ? 'bg-[#006b2c]'
                    : 'bg-linear-to-br from-[#00873a] to-[#006b2c] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:opacity-95 hover:-translate-y-px active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100'
                    }`}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin w-5 h-5" /> Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>

              {/* Resend Section */}
              <div className="mt-8">
                <p className="font-sans text-sm leading-5 font-normal text-[#3e4a3d]">
                  Didn&apos;t receive the code?
                  <button
                    onClick={handleResend}
                    disabled={timeLeft > 0}
                    type="button"
                    className={`font-sans text-xs leading-4 font-semibold text-[#006b2c] ml-1 transition-all duration-200 ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline cursor-pointer"
                      }`}
                  >
                    {
                      resendLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Resend Code{" "}
                          {timeLeft > 0 && (
                            <span className="font-normal">
                              (0:{timeLeft.toString().padStart(2, "0")})
                            </span>
                          )}
                        </>
                      )
                    }
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 font-sans text-sm leading-5 tracking-[0.01em] font-medium text-on-surface hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
