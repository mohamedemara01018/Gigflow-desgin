/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
    Landmark,
    RefreshCw,
} from "lucide-react";
import {
    IStripeConnectStatus,
    paymentMethodService,
} from "@/services/paymentMethod.service";
import SettingLayout from "@/components/layout/public/SettingLayout";

export default function StripeConnectReturnPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<IStripeConnectStatus | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const checkStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await paymentMethodService.getConnectStatus();
            if (res?.data) {
                setStatus(res.data);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to verify Stripe Connect account status.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const handleContinueOnboarding = async () => {
        try {
            setActionLoading(true);
            const res = await paymentMethodService.createConnectOnboardingLink();
            if (res?.url) {
                window.location.href = res.url;
            }
        } catch (err: any) {
            setError(err?.message || "Failed to generate new onboarding link.");
            setActionLoading(false);
        }
    };

    return (
        <SettingLayout>
            <div className="max-w-2xl mx-auto py-8">
                <div className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm text-center">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4">
                            <Loader2 size={36} className="text-primary animate-spin" />
                            <h2 className="text-headline-sm font-semibold text-on-surface">
                                Verifying Payout Account Status...
                            </h2>
                            <p className="text-body-sm text-on-surface-variant max-w-md">
                                Please wait while we synchronize your Stripe Connect account details with GigFlow.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="py-6 space-y-4">
                            <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                                <AlertCircle size={30} />
                            </div>
                            <h2 className="text-headline-sm font-semibold text-on-surface">
                                Verification Notice
                            </h2>
                            <p className="text-body-md text-error max-w-md mx-auto">{error}</p>
                            <div className="pt-4 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={checkStatus}
                                    className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md font-medium transition-colors cursor-pointer border border-outline-variant"
                                >
                                    Check Again
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/settings/payments")}
                                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                                >
                                    Back to Payments
                                </button>
                            </div>
                        </div>
                    ) : status?.onboardingComplete ? (
                        <div className="py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 size={36} />
                            </div>
                            <h2 className="text-headline-md font-semibold text-on-surface">
                                Payout Account Connected!
                            </h2>
                            <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                                Your Stripe Connect Express account is fully configured. You can now receive contract payouts and milestone earnings directly into your bank account.
                            </p>

                            <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-4 max-w-md mx-auto text-left flex items-center gap-3.5 my-6">
                                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                                    <Landmark size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-sm font-semibold text-on-surface">
                                        Stripe Express Account
                                    </p>
                                    <p className="text-[12px] text-success font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                        Payouts &amp; Transfers Enabled
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/settings/payments")}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                                >
                                    Return to Payment Settings
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                <RefreshCw size={32} />
                            </div>
                            <h2 className="text-headline-md font-semibold text-on-surface">
                                Onboarding Almost Complete
                            </h2>
                            <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                                Stripe requires a few more details or verification steps before payouts can be activated on your account.
                            </p>

                            <div className="pt-4 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleContinueOnboarding}
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-xs"
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Opening Stripe...
                                        </>
                                    ) : (
                                        "Continue Stripe Setup"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/settings/payments")}
                                    className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md font-medium transition-colors cursor-pointer border border-outline-variant"
                                >
                                    Finish Later
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SettingLayout>
    );
}
