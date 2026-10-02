"use client";

import { useState } from "react";
import { IPaymentMethodItem } from "@/services/paymentMethod.service";
import { CreditCard, Landmark, Trash2, CheckCircle2, Loader2, AlertCircle, Star } from "lucide-react";

interface PaymentMethodCardProps {
    method: IPaymentMethodItem;
    onSetDefault: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isSettingDefault?: boolean;
    isDeleting?: boolean;
}

export default function PaymentMethodCard({
    method,
    onSetDefault,
    onDelete,
    isSettingDefault = false,
    isDeleting = false,
}: PaymentMethodCardProps) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const getBrandTitle = () => {
        if (method.type === "card" && method.card) {
            const brand = method.card.brand
                ? method.card.brand.toUpperCase()
                : "CARD";
            return `${brand} •••• ${method.card.last4 || "****"}`;
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
            const expMonth = method.card.expMonth
                ? String(method.card.expMonth).padStart(2, "0")
                : "--";
            const expYear = method.card.expYear
                ? String(method.card.expYear).slice(-2)
                : "--";
            return `Expires ${expMonth}/${expYear}`;
        }
        if (method.type === "us_bank_account" && method.usBankAccount) {
            const type = method.usBankAccount.accountType
                ? method.usBankAccount.accountType.charAt(0).toUpperCase() +
                method.usBankAccount.accountType.slice(1)
                : "Checking";
            return `USD • ${type} Account`;
        }
        if (method.type === "paypal" && method.paypal) {
            return method.paypal.payerId ? `Payer ID: ${method.paypal.payerId}` : "PayPal Connected";
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
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${method.isDefault
                    ? "bg-surface-container border-primary/50 shadow-xs"
                    : "bg-surface-container border-outline-variant hover:border-outline"
                }`}
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant">
                    {getIcon()}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                            {getBrandTitle()}
                        </p>
                        {method.isDefault ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary text-on-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <CheckCircle2 size={12} />
                                Default
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onSetDefault(method._id)}
                                disabled={isSettingDefault || isDeleting}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                title="Click to set as default"
                            >
                                <Star size={12} />
                                Make Default
                            </button>
                        )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">{getSubtitle()}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40">
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
                            "Set as default"
                        )}
                    </button>
                )}

                {showConfirmDelete ? (
                    <div className="flex items-center gap-2 bg-error/10 px-3 py-1.5 rounded-xl border border-error/20">
                        <span className="text-[12px] text-error font-medium flex items-center gap-1">
                            <AlertCircle size={14} />
                            Remove?
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setShowConfirmDelete(false);
                                onDelete(method._id);
                            }}
                            disabled={isDeleting}
                            className="text-[12px] bg-error text-on-error font-bold px-2.5 py-1 rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowConfirmDelete(false)}
                            disabled={isDeleting}
                            className="text-[12px] text-on-surface-variant hover:text-on-surface px-2 py-1 cursor-pointer"
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowConfirmDelete(true)}
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
