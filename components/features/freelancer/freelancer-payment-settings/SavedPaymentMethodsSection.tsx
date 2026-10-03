"use client";

import { CreditCard, Plus, Loader2, AlertCircle } from "lucide-react";
import { IPaymentMethodItem } from "@/services/paymentMethod.service";
import PaymentMethodCard from "@/components/features/shared/payment-methods/PaymentMethodCard";

interface SavedPaymentMethodsSectionProps {
    paymentMethods: IPaymentMethodItem[];
    isLoadingMethods: boolean;
    methodsError: string | null;
    actionId: string | null;
    actionType: "default" | "delete" | null;
    onOpenAddModal: () => void;
    onRetry: () => void;
    onSetDefault: (id: string) => void;
    onDeleteRequest: (method: IPaymentMethodItem) => void;
    onViewDetails: (method: IPaymentMethodItem) => void;
}

export default function SavedPaymentMethodsSection({
    paymentMethods,
    isLoadingMethods,
    methodsError,
    actionId,
    actionType,
    onOpenAddModal,
    onRetry,
    onSetDefault,
    onDeleteRequest,
    onViewDetails,
}: SavedPaymentMethodsSectionProps) {
    return (
        <section className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CreditCard size={22} />
                    </div>
                    <div>
                        <h2 className="text-headline-sm font-semibold text-on-surface">
                            Saved Payment Methods
                        </h2>
                        <p className="text-body-xs text-on-surface-variant">
                            Credit cards, bank accounts, and PayPal for platform purchases
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 bg-primary text-on-primary text-label-md font-semibold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                    <Plus size={16} />
                    Add Payment Method
                </button>
            </div>

            <div className="mt-5">
                {isLoadingMethods ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant bg-surface-container rounded-xl">
                        <Loader2 size={28} className="text-primary animate-spin" />
                        <p className="text-body-sm font-medium">Loading payment methods...</p>
                    </div>
                ) : methodsError ? (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-error text-body-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{methodsError}</span>
                        </div>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="px-3 py-1.5 rounded-lg bg-error text-on-error text-label-sm font-medium hover:opacity-90 cursor-pointer shrink-0"
                        >
                            Retry
                        </button>
                    </div>
                ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-10 px-4 border border-dashed border-outline-variant rounded-xl bg-surface-container">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                            <CreditCard size={22} />
                        </div>
                        <h3 className="text-body-lg font-semibold text-on-surface">
                            No payment methods saved
                        </h3>
                        <p className="text-body-sm text-on-surface-variant max-w-md mx-auto mt-1 mb-4">
                            Add a credit/debit card, US bank account, or PayPal to seamlessly pay for contracts and platform services.
                        </p>
                        <button
                            type="button"
                            onClick={onOpenAddModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md font-medium hover:opacity-90 cursor-pointer shadow-xs"
                        >
                            <Plus size={16} />
                            Add Payment Method
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {paymentMethods.map((method) => (
                            <PaymentMethodCard
                                key={method._id}
                                method={method}
                                onSetDefault={onSetDefault}
                                onDeleteRequest={onDeleteRequest}
                                onViewDetails={onViewDetails}
                                isSettingDefault={
                                    actionId === method._id && actionType === "default"
                                }
                                isDeleting={
                                    actionId === method._id && actionType === "delete"
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}