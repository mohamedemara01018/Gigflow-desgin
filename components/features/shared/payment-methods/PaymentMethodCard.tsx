"use client";

import { IPaymentMethodItem } from "@/services/paymentMethod.service";
import {
    CreditCard,
    Landmark,
    Trash2,
    CheckCircle2,
    Loader2,
    Star,
    Eye,
} from "lucide-react";

interface PaymentMethodCardProps {
    method: IPaymentMethodItem;
    onSetDefault: (id: string) => void
    onDeleteRequest: (method: IPaymentMethodItem) => void;
    onViewDetails: (method: IPaymentMethodItem) => void;
    isSettingDefault?: boolean;
    isDeleting?: boolean;
}

export default function PaymentMethodCard({
    method,
    onSetDefault,
    onDeleteRequest,
    onViewDetails,
    isSettingDefault = false,
    isDeleting = false,
}: PaymentMethodCardProps) {
    const getBrandTitle = () => {
        if (method.type === "card" && method.card) {
            const rawBrand = method.card.brand || "Card";
            const brand = rawBrand.toUpperCase() === "LINK" ? "Stripe Link" : rawBrand.toUpperCase();
            const last4 = method.card.last4 && method.card.last4 !== "LINK" ? `•••• ${method.card.last4}` : "";
            return `${brand} ${last4}`.trim();
        }
        if (method.type === "us_bank_account" && method.usBankAccount) {
            const bankName = method.usBankAccount.bankName || "US Bank Account";
            return `${bankName} •••• ${method.usBankAccount.last4 || "****"}`;
        }
        if (method.type === "paypal" && method.paypal) {
            return method.paypal.email || "PayPal Account";
        }
        return "Payment Method";
    };

    const getSubtitle = () => {
        if (method.type === "card" && method.card) {
            if (method.card.expMonth && method.card.expYear) {
                const expMonth = String(method.card.expMonth).padStart(2, "0");
                const expYear = String(method.card.expYear).slice(-2);
                return `Expires ${expMonth}/${expYear}`;
            }
            return "Active Card / Link";
        }
        if (method.type === "us_bank_account" && method.usBankAccount) {
            const type = method.usBankAccount.accountType
                ? method.usBankAccount.accountType.charAt(0).toUpperCase() +
                method.usBankAccount.accountType.slice(1)
                : "Checking";
            return `USD • ${type} Account`;
        }
        if (method.type === "paypal" && method.paypal) {
            return method.paypal.payerId
                ? `Payer ID: ${method.paypal.payerId}`
                : "PayPal Connected";
        }
        return "Active Method";
    };

    const getIcon = () => {
        if (method.type === "card") {
            return <CreditCard size={22} className="text-primary" />;
        }
        if (method.type === "us_bank_account") {
            return <Landmark size={22} className="text-secondary" />;
        }
        return (
            <span className="font-bold text-sm text-[#0070ba] tracking-tight">
                P<span className="text-[#003087]">P</span>
            </span>
        );
    };

    return (
        <div
            className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${method.isDefault
                    ? "bg-surface-container border-primary/50 shadow-xs"
                    : "bg-surface-container border-outline-variant hover:border-outline"
                }`}
        >
            {/* Clickable Area for Details */}
            <div
                onClick={() => onViewDetails(method)}
                className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onViewDetails(method);
                    }
                }}
            >
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant group-hover:scale-105 transition-transform">
                    {getIcon()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="text-body-md font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                            {getBrandTitle()}
                        </p>
                        {method.isDefault && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary text-on-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                                <CheckCircle2 size={12} />
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {getSubtitle()}
                    </p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40 shrink-0">
                {/* View Details Button */}
                <button
                    type="button"
                    onClick={() => onViewDetails(method)}
                    className="text-label-sm font-medium px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer flex items-center gap-1.5 border border-outline-variant/60"
                    title="View payment method details"
                >
                    <Eye size={15} />
                    <span className="hidden sm:inline">Details</span>
                </button>

                {/* Make Default Button (only shown if not default) */}
                {!method.isDefault && (
                    <button
                        type="button"
                        onClick={() => onSetDefault(method._id)}
                        disabled={isSettingDefault || isDeleting}
                        className="text-label-sm font-medium px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 border border-outline-variant/60"
                    >
                        {isSettingDefault ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Setting...
                            </>
                        ) : (
                            <>
                                <Star size={14} className="text-primary" />
                                <span>Set Default</span>
                            </>
                        )}
                    </button>
                )}

                {/* Delete / Remove Button (NEVER shown if default) */}
                {!method.isDefault && (
                    <button
                        type="button"
                        onClick={() => onDeleteRequest(method)}
                        disabled={isDeleting || isSettingDefault}
                        className="text-label-sm font-medium px-3 py-2 rounded-xl text-error hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-error/20"
                        title="Remove payment method"
                    >
                        {isDeleting ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <>
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Remove</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
