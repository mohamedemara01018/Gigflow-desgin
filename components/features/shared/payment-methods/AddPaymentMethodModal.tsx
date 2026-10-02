/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/utils/stripe";
import { paymentMethodService } from "@/services/paymentMethod.service";
import { X, Loader2, AlertCircle, ShieldCheck, CreditCard } from "lucide-react";
import { useDispatch } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

interface AddPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function StripeSetupForm({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Confirm the SetupIntent using Stripe.js Elements
            const { error, setupIntent } = await stripe.confirmSetup({
                elements,
                redirect: "if_required",
            });

            if (error) {
                setErrorMessage(error.message || "Failed to confirm payment method.");
                setIsSubmitting(false);
                return;
            }

            if (setupIntent) {
                if (setupIntent.status === "succeeded") {
                    const paymentMethodId =
                        typeof setupIntent.payment_method === "string"
                            ? setupIntent.payment_method
                            : setupIntent.payment_method?.id;

                    await paymentMethodService.createPaymentMethod({
                        stripePaymentMethodId: paymentMethodId,
                        setupIntentId: setupIntent.id,
                    });

                    dispatch(
                        toastify({
                            type: "success",
                            message: "Payment method added successfully!",
                            duration: DURATION,
                        })
                    );
                    onSuccess();
                    onClose();
                } else if (setupIntent.status === "processing") {
                    try {
                        await paymentMethodService.createPaymentMethod({
                            setupIntentId: setupIntent.id,
                        });
                    } catch (e) {
                        console.warn("Processing state sync notice:", e);
                    }

                    dispatch(
                        toastify({
                            type: "info",
                            message: "Payment method verification is processing. It will be active shortly.",
                            duration: DURATION,
                        })
                    );
                    onSuccess();
                    onClose();
                } else {
                    setErrorMessage(`SetupIntent status: ${setupIntent.status}`);
                }
            }
        } catch (err: any) {
            setErrorMessage(err?.message || "An unexpected error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
                <div className="p-3.5 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2.5 text-error text-body-sm animate-in fade-in">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="leading-snug font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="bg-surface-container-high/60 p-4 rounded-xl border border-outline-variant/60 shadow-inner">
                <PaymentElement
                    options={{
                        layout: "tabs",
                        paymentMethodOrder: ["card", "us_bank_account", "paypal"],
                    }}
                />
            </div>

            <div className="flex items-center gap-2.5 text-[12px] text-on-surface-variant bg-surface-container-high/40 p-3 rounded-xl border border-outline-variant/40">
                <ShieldCheck size={18} className="text-primary shrink-0" />
                <p className="leading-tight">
                    Your payment details are end-to-end encrypted and safely processed by Stripe.
                    GigFlow never stores your full card numbers or banking credentials.
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-label-md font-medium disabled:opacity-50 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || !elements || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shadow-xs"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving Method...
                        </>
                    ) : (
                        "Save Payment Method"
                    )}
                </button>
            </div>
        </form>
    );
}

export default function AddPaymentMethodModal({
    isOpen,
    onClose,
    onSuccess,
}: AddPaymentMethodModalProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loadingSecret, setLoadingSecret] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);

    const initializeSetupIntent = async () => {
        try {
            setLoadingSecret(true);
            setInitError(null);
            const res = await paymentMethodService.createSetupIntent();
            if (res?.data?.clientSecret) {
                setClientSecret(res.data.clientSecret);
            } else {
                throw new Error("Missing clientSecret in setup intent response");
            }
        } catch (err: any) {
            setInitError(err?.message || "Failed to initialize Stripe setup session.");
        } finally {
            setLoadingSecret(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setClientSecret(null);
            initializeSetupIntent();
        }
    }, [isOpen]);

    if (!isOpen) return null;

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
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-headline-sm font-semibold text-on-surface">
                                Add Payment Method
                            </h2>
                            <p className="text-body-xs text-on-surface-variant mt-0.5">
                                Connect Card, US Bank Account, or PayPal
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

                {/* Body with inner scroll */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loadingSecret ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                            <Loader2 size={32} className="animate-spin text-primary" />
                            <p className="text-body-sm font-medium">
                                Initializing secure payment connection...
                            </p>
                        </div>
                    ) : initError ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-body-md text-error font-medium">{initError}</p>
                            <button
                                type="button"
                                onClick={initializeSetupIntent}
                                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-label-md font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : clientSecret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: "stripe",
                                    variables: {
                                        colorPrimary: "#15803d",
                                        borderRadius: "10px",
                                        fontFamily: "Geist, system-ui, sans-serif",
                                    },
                                },
                            }}
                        >
                            <StripeSetupForm onClose={onClose} onSuccess={onSuccess} />
                        </Elements>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
