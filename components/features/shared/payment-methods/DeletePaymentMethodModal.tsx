"use client";

import { IPaymentMethodItem } from "@/services/paymentMethod.service";
import { X, AlertTriangle, Loader2, CreditCard, Landmark } from "lucide-react";

interface DeletePaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    method: IPaymentMethodItem | null;
    isDeleting?: boolean;
}

export default function DeletePaymentMethodModal({
    isOpen,
    onClose,
    onConfirm,
    method,
    isDeleting = false,
}: DeletePaymentMethodModalProps) {
    if (!isOpen || !method) return null;

    const getMethodDisplay = () => {
        if (method.type === "card" && method.card) {
            const brand = (method.card.brand || "Card").toUpperCase();
            return `${brand} ending in ${method.card.last4 || "****"}`;
        }
        if (method.type === "us_bank_account" && method.usBankAccount) {
            const bankName = method.usBankAccount.bankName || "US Bank Account";
            return `${bankName} ending in ${method.usBankAccount.last4 || "****"}`;
        }
        if (method.type === "paypal" && method.paypal) {
            return method.paypal.email || "PayPal Account";
        }
        return "Payment Method";
    };

    const getIcon = () => {
        if (method.type === "card") {
            return <CreditCard size={18} className="text-primary" />;
        }
        if (method.type === "us_bank_account") {
            return <Landmark size={18} className="text-secondary" />;
        }
        return (
            <span className="font-bold text-xs text-[#0070ba]">
                PP
            </span>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-110 p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isDeleting) onClose();
            }}
        >
            <div
                className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl relative my-auto flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-5 border-b border-outline-variant/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h2 className="text-headline-sm font-semibold text-on-surface">
                                Delete Payment Method
                            </h2>
                            <p className="text-body-xs text-on-surface-variant">
                                Permanent action confirmation
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        Are you sure you want to remove this payment method? It will be disconnected
                        from your account and detached from Stripe.
                    </p>

                    <div className="bg-surface-container-high/60 border border-outline-variant/60 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                            {getIcon()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-body-sm font-semibold text-on-surface truncate">
                                {getMethodDisplay()}
                            </p>
                            {method.isDefault && (
                                <p className="text-[11px] font-medium text-primary">
                                    Current default payment method
                                </p>
                            )}
                        </div>
                    </div>

                    {method.isDefault && (
                        <p className="text-[12px] text-on-surface-variant/80 bg-surface-container-high/30 p-2.5 rounded-lg border border-outline-variant/30">
                            Note: Removing your default method will clear your default payment preference. You can select or add a new default method anytime.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-outline-variant/60 bg-surface-container-high/20">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-label-md font-medium disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2 rounded-xl bg-error text-on-error text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Method"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
