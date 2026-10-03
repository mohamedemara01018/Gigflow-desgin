/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { paymentMethodService } from "@/services/paymentMethod.service";
import SettingLayout from "@/components/layout/public/SettingLayout";

export default function StripeConnectRefreshPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRetryOnboarding = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await paymentMethodService.createConnectOnboardingLink();
            if (res?.url) {
                window.location.href = res.url;
            } else {
                throw new Error("Missing redirect URL from server");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to resume Stripe Connect onboarding session.");
            setLoading(false);
        }
    };

    return (
        <SettingLayout>
            <div className="max-w-xl mx-auto py-10">
                <div className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm text-center space-y-5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <ShieldAlert size={32} />
                    </div>

                    <h1 className="text-headline-md font-semibold text-on-surface">
                        Stripe Onboarding Session Expired
                    </h1>

                    <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                        Your previous Stripe onboarding link expired or needs to be refreshed. Don&apos;t worry, your progress has been preserved.
                    </p>

                    {error && (
                        <div className="p-3.5 bg-error/10 border border-error/20 rounded-xl text-error text-body-sm font-medium text-left">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
                        <button
                            type="button"
                            onClick={handleRetryOnboarding}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Refreshing Session...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16} />
                                    Resume Setup
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/settings/payments")}
                            className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md font-medium transition-colors cursor-pointer border border-outline-variant flex items-center gap-1.5"
                        >
                            <ArrowLeft size={16} />
                            Payment Settings
                        </button>
                    </div>
                </div>
            </div>
        </SettingLayout>
    );
}
