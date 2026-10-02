/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    CreditCard,
    Plus,
    Loader2,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";
import { IPaymentMethodItem, paymentMethodService } from "@/services/paymentMethod.service";
import PaymentMethodCard from "@/components/features/shared/payment-methods/PaymentMethodCard";
import AddPaymentMethodModal from "@/components/features/shared/payment-methods/AddPaymentMethodModal";
import { useDispatch } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

export default function FreelancerPaymentSettings() {
    const dispatch = useDispatch();

    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethodItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"default" | "delete" | null>(null);

    const fetchPaymentMethods = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await paymentMethodService.getPaymentMethods();
            if (res?.data?.paymentMethods) {
                setPaymentMethods(res.data.paymentMethods);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load payment methods");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const handleSetDefault = async (id: string) => {
        // Optimistic update for instant UI feedback
        setPaymentMethods((prev) =>
            prev.map((pm) => ({
                ...pm,
                isDefault: pm._id === id,
            }))
        );

        try {
            setActionId(id);
            setActionType("default");
            const res = await paymentMethodService.setDefaultPaymentMethod(id);
            if (res?.data?.paymentMethod) {
                // Confirm with server response
                setPaymentMethods((prev) =>
                    prev.map((pm) => ({
                        ...pm,
                        isDefault: pm._id === id,
                    }))
                );
            }
            dispatch(
                toastify({
                    type: "success",
                    message: "Default payment method updated successfully.",
                    duration: DURATION,
                })
            );
            await fetchPaymentMethods();
        } catch (err: any) {
            // Roll back on error
            await fetchPaymentMethods();
            dispatch(
                toastify({
                    type: "error",
                    message: err?.message || "Failed to update default payment method.",
                    duration: DURATION,
                })
            );
        } finally {
            setActionId(null);
            setActionType(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setActionId(id);
            setActionType("delete");
            await paymentMethodService.deletePaymentMethod(id);
            dispatch(
                toastify({
                    type: "success",
                    message: "Payment method removed successfully.",
                    duration: DURATION,
                })
            );
            await fetchPaymentMethods();
        } catch (err: any) {
            dispatch(
                toastify({
                    type: "error",
                    message: err?.message || "Failed to remove payment method.",
                    duration: DURATION,
                })
            );
        } finally {
            setActionId(null);
            setActionType(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Payments &amp; Payment Methods
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-140">
                        Manage your credit cards, bank accounts, and PayPal payment methods for
                        secure billing and transactions.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Payment Methods Section */}
                <section className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2.5">
                            <CreditCard size={22} className="text-primary" />
                            <h2 className="text-headline-sm font-semibold text-on-surface">
                                Saved Payment Methods
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md font-semibold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                        >
                            <Plus size={16} />
                            Add Payment Method
                        </button>
                    </div>

                    <div className="mt-5">
                        {isLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant bg-surface-container rounded-xl">
                                <Loader2 size={28} className="text-primary animate-spin" />
                                <p className="text-body-sm font-medium">Loading payment methods...</p>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-error text-body-sm">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchPaymentMethods}
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
                                    Add a credit/debit card, US bank account, or PayPal to seamlessly pay for contracts and milestones.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(true)}
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
                                        onSetDefault={handleSetDefault}
                                        onDelete={handleDelete}
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


                {/* Security and Compliance */}
                <section className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2.5 text-on-surface">
                        <ShieldCheck size={22} className="text-primary" />
                        <h2 className="text-headline-sm font-semibold text-on-surface">
                            Security &amp; Encryption
                        </h2>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                        All transactions are encrypted with 256-bit AES encryption. GigFlow adheres to
                        strict PCI-DSS Level 1 compliance standards through Stripe infrastructure.
                    </p>
                </section>
            </div>

            {/* Add Payment Method Modal */}
            <AddPaymentMethodModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchPaymentMethods}
            />
        </div>
    );
}