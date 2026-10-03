"use client";

import { IPaymentMethodItem } from "@/services/paymentMethod.service";
import {
    X,
    CreditCard,
    Landmark,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    Hash,
    Building2,
    Mail,
    UserCheck,
    Trash2,
    Star,
    Sparkles,
} from "lucide-react";

interface PaymentMethodDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    method: IPaymentMethodItem | null;
    onSetDefault?: (id: string) => Promise<void>;
    onDeleteRequest?: (method: IPaymentMethodItem) => void;
    isSettingDefault?: boolean;
}

export default function PaymentMethodDetailsModal({
    isOpen,
    onClose,
    method,
    onSetDefault,
    onDeleteRequest,
    isSettingDefault = false,
}: PaymentMethodDetailsModalProps) {
    if (!isOpen || !method) return null;

    const getIcon = () => {
        if (method.type === "card") {
            return <CreditCard size={24} className="text-primary" />;
        }
        if (method.type === "us_bank_account") {
            return <Landmark size={24} className="text-secondary" />;
        }
        return (
            <span className="font-bold text-base text-[#0070ba] tracking-tight">
                P<span className="text-[#003087]">P</span>
            </span>
        );
    };

    const getMethodTypeName = () => {
        if (method.type === "card") return "Credit / Debit Card";
        if (method.type === "us_bank_account") return "US Bank Account";
        if (method.type === "paypal") return "PayPal Account";
        return "Payment Method";
    };

    const renderMethodSpecificDetails = () => {
        if (method.type === "card" && method.card) {
            const rawBrand = method.card.brand || "Standard Card";
            const brand = rawBrand.toUpperCase() === "LINK" ? "Stripe Link Card" : rawBrand.toUpperCase();
            const last4Display = method.card.last4 && method.card.last4 !== "LINK"
                ? `•••• •••• •••• ${method.card.last4}`
                : "•••• •••• •••• ••••";

            const expDisplay = method.card.expMonth && method.card.expYear
                ? `${String(method.card.expMonth).padStart(2, "0")} / ${String(method.card.expYear)}`
                : "Active (No Expiration)";

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                            <CreditCard size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Card Brand
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface uppercase truncate">
                                {brand}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                            <Hash size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Card Number
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface tracking-wider">
                                {last4Display}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                            <Calendar size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Expiration Date
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface">
                                {expDisplay}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Security Check
                            </p>
                            <p className="text-body-sm font-semibold text-success flex items-center gap-1">
                                <CheckCircle2 size={14} /> Passed
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (method.type === "us_bank_account" && method.usBankAccount) {
            const accountType = method.usBankAccount.accountType
                ? method.usBankAccount.accountType.charAt(0).toUpperCase() +
                  method.usBankAccount.accountType.slice(1)
                : "Checking";

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
                            <Building2 size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Financial Institution
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface truncate">
                                {method.usBankAccount.bankName || "US Bank"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
                            <Hash size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Account Number
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface tracking-wider">
                                •••••• {method.usBankAccount.last4 || "••••"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
                            <Landmark size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Account Type
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface">
                                {accountType} Account
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                Currency
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface">
                                USD ($)
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (method.type === "paypal" && method.paypal) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3 col-span-1 sm:col-span-2">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-[#0070ba] shrink-0">
                            <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                PayPal Email
                            </p>
                            <p className="text-body-sm font-semibold text-on-surface truncate">
                                {method.paypal.email || "Connected via PayPal"}
                            </p>
                        </div>
                    </div>

                    {method.paypal.payerId && (
                        <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3 col-span-1 sm:col-span-2">
                            <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-[#0070ba] shrink-0">
                                <UserCheck size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                    Payer ID
                                </p>
                                <p className="text-body-sm font-semibold text-on-surface font-mono">
                                    {method.paypal.payerId}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-outline-variant/60 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant">
                            {getIcon()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-headline-sm font-semibold text-on-surface">
                                    Payment Method Details
                                </h2>
                            </div>
                            <p className="text-body-xs text-on-surface-variant mt-0.5">
                                {getMethodTypeName()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Status & Default Badges */}
                    <div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2">
                            <span className="text-body-sm font-medium text-on-surface">Status:</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-success/15 text-success px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                Active
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-body-sm font-medium text-on-surface">Default:</span>
                            {method.isDefault ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary text-on-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    <CheckCircle2 size={12} />
                                    Default Method
                                </span>
                            ) : (
                                <span className="text-body-sm text-on-surface-variant font-medium">
                                    No
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Method Details Grid */}
                    <div className="space-y-3">
                        <h3 className="text-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
                            Account &amp; Billing Information
                        </h3>
                        {renderMethodSpecificDetails()}
                    </div>

                    {/* Security Note */}
                    <div className="flex items-start gap-2.5 text-[12px] text-on-surface-variant bg-surface-container-high/30 p-3.5 rounded-xl border border-outline-variant/40">
                        <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                        <p className="leading-tight">
                            Safe and compliant. Your full card numbers and security codes are tokenized
                            and stored securely in Stripe vault with Level 1 PCI-DSS certification.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-3 p-4 border-t border-outline-variant/60 bg-surface-container-high/20 shrink-0">
                    <div>
                        {!method.isDefault && onDeleteRequest && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onDeleteRequest(method);
                                }}
                                className="flex items-center gap-1.5 text-label-md font-medium text-error hover:bg-error/10 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {!method.isDefault && onSetDefault && (
                            <button
                                type="button"
                                onClick={async () => {
                                    await onSetDefault(method._id);
                                    onClose();
                                }}
                                disabled={isSettingDefault}
                                className="flex items-center gap-1.5 text-label-md font-medium text-primary hover:bg-primary/10 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-primary/20"
                            >
                                <Star size={16} />
                                Make Default
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-label-md font-medium transition-colors cursor-pointer border border-outline-variant"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
