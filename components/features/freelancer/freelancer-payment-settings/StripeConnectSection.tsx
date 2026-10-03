"use client";

import {
    Landmark,
    ArrowUpRight,
    Loader2,
    AlertCircle,
    Clock,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { IStripeConnectStatus } from "@/services/paymentMethod.service";

interface StripeConnectSectionProps {
    connectStatus: IStripeConnectStatus | null;
    isLoadingConnect: boolean;
    connectError: string | null;
    isStartingOnboarding: boolean;
    isOpeningDashboard: boolean;
    onRetry: () => void;
    onStartOnboarding: () => void;
    onOpenDashboard: () => void;
}

export default function StripeConnectSection({
    connectStatus,
    isLoadingConnect,
    connectError,
    isStartingOnboarding,
    isOpeningDashboard,
    onRetry,
    onStartOnboarding,
    onOpenDashboard,
}: StripeConnectSectionProps) {
    return (
        <section className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <Landmark size={22} />
                    </div>
                    <div>
                        <h2 className="text-headline-sm font-semibold text-on-surface">
                            Payout Account (Stripe Connect)
                        </h2>
                        <p className="text-body-xs text-on-surface-variant">
                            Direct bank deposits for contract and milestone earnings
                        </p>
                    </div>
                </div>

                {connectStatus?.onboardingComplete && (
                    <button
                        type="button"
                        onClick={onOpenDashboard}
                        disabled={isOpeningDashboard}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md font-semibold transition-colors cursor-pointer border border-outline-variant disabled:opacity-50"
                    >
                        {isOpeningDashboard ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Opening...
                            </>
                        ) : (
                            <>
                                <span>Manage Payouts</span>
                                <ArrowUpRight size={16} />
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="mt-5">
                {isLoadingConnect ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-3 text-on-surface-variant bg-surface-container-high/30 rounded-xl border border-outline-variant/40">
                        <Loader2 size={26} className="text-secondary animate-spin" />
                        <p className="text-body-sm font-medium">Checking Stripe Connect payout status...</p>
                    </div>
                ) : connectError ? (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-error text-body-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{connectError}</span>
                        </div>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="px-3 py-1.5 rounded-lg bg-error text-on-error text-label-sm font-medium hover:opacity-90 cursor-pointer shrink-0"
                        >
                            Retry
                        </button>
                    </div>
                ) : !connectStatus?.hasConnectAccount || !connectStatus?.stripeConnectAccountId ? (
                    /* State 1: No Connect Account */
                    <div className="p-6 border border-dashed border-outline-variant rounded-xl bg-surface-container-high/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-lg">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-surface-container-highest text-on-surface-variant px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Not Connected
                                </span>
                            </div>
                            <h3 className="text-body-lg font-semibold text-on-surface">
                                Set up your payout account
                            </h3>
                            <p className="text-body-sm text-on-surface-variant leading-relaxed">
                                Connect your bank account via Stripe Express to automatically receive your milestone payments with bank-level security.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onStartOnboarding}
                            disabled={isStartingOnboarding}
                            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0 shadow-xs"
                        >
                            {isStartingOnboarding ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Redirecting to Stripe...
                                </>
                            ) : (
                                <>
                                    <Landmark size={16} />
                                    Set up payouts
                                </>
                            )}
                        </button>
                    </div>
                ) : !connectStatus?.onboardingComplete ? (
                    /* State 2: Account Exists but Onboarding Incomplete */
                    <div className="p-6 border border-amber-500/30 rounded-xl bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-lg">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    <Clock size={12} />
                                    Onboarding Incomplete
                                </span>
                                <span className="text-[12px] text-on-surface-variant font-mono">
                                    ID: acct_••••{connectStatus.stripeConnectAccountId.slice(-4)}
                                </span>
                            </div>
                            <h3 className="text-body-lg font-semibold text-on-surface">
                                Action required: Complete Stripe verification
                            </h3>
                            <p className="text-body-sm text-on-surface-variant leading-relaxed">
                                Your Stripe Connect account exists, but Stripe requires additional identity or banking information before payouts can be activated.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onStartOnboarding}
                            disabled={isStartingOnboarding}
                            className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-label-md font-semibold hover:bg-amber-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0 shadow-xs"
                        >
                            {isStartingOnboarding ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Opening Stripe...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={16} />
                                    Continue setup
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    /* State 3: Fully Connected */
                    <div className="p-6 border border-success/30 rounded-xl bg-success/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-success/15 text-success px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    <CheckCircle2 size={12} />
                                    Connected &amp; Active
                                </span>
                                <span className="text-[12px] text-on-surface-variant font-mono">
                                    Stripe Express • acct_••••{connectStatus.stripeConnectAccountId.slice(-4)}
                                </span>
                            </div>
                            <h3 className="text-body-lg font-semibold text-on-surface">
                                Payouts enabled
                            </h3>
                            <p className="text-body-sm text-on-surface-variant max-w-lg">
                                Your payout account is active and verified. Milestone earnings will be automatically transferred to your configured bank account.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onOpenDashboard}
                                disabled={isOpeningDashboard}
                                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0 shadow-xs"
                            >
                                {isOpeningDashboard ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <span>Manage Payouts</span>
                                        <ArrowUpRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}