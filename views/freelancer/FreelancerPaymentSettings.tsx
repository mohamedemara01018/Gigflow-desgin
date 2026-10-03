/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import {
    IPaymentMethodItem,
    IStripeConnectStatus,
    paymentMethodService,
} from "@/services/paymentMethod.service";

import AddPaymentMethodModal from "@/components/features/shared/payment-methods/AddPaymentMethodModal";
import PaymentMethodDetailsModal from "@/components/features/shared/payment-methods/PaymentMethodDetailsModal";
import DeletePaymentMethodModal from "@/components/features/shared/payment-methods/DeletePaymentMethodModal";
import StripeConnectSection from "@/components/features/freelancer/freelancer-payment-settings/StripeConnectSection";
import SavedPaymentMethodsSection from "@/components/features/freelancer/freelancer-payment-settings/SavedPaymentMethodsSection";
import SecurityComplianceSection from "@/components/features/freelancer/freelancer-payment-settings/SecurityComplianceSection";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { UserRole } from "@/utils/enums.utils";



export default function FreelancerPaymentSettings() {
    const dispatch = useDispatch();

    // Payment Methods State
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethodItem[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(true);
    const [methodsError, setMethodsError] = useState<string | null>(null);

    // Stripe Connect Payouts State
    const [connectStatus, setConnectStatus] = useState<IStripeConnectStatus | null>(null);
    const [isLoadingConnect, setIsLoadingConnect] = useState(true);
    const [connectError, setConnectError] = useState<string | null>(null);
    const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);
    const [isOpeningDashboard, setIsOpeningDashboard] = useState(false);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDetailsMethod, setSelectedDetailsMethod] = useState<IPaymentMethodItem | null>(null);
    const [methodToDelete, setMethodToDelete] = useState<IPaymentMethodItem | null>(null);

    // Async action indicators
    const [actionId, setActionId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"default" | "delete" | null>(null);

    const { me } = useSelector(selectMeSlice);

    const isFreelancer = me?.role == UserRole.FREELANCER
    const isClient = me?.role == UserRole.CLIENT

    const fetchPaymentMethods = useCallback(async () => {
        try {
            setIsLoadingMethods(true);
            setMethodsError(null);
            const res = await paymentMethodService.getPaymentMethods();
            if (res?.data?.paymentMethods) {
                setPaymentMethods(res.data.paymentMethods);
            } else {
                setPaymentMethods([]);
            }
        } catch (err: any) {
            setMethodsError(err?.message || "Failed to load payment methods");
        } finally {
            setIsLoadingMethods(false);
        }
    }, []);

    const fetchConnectStatus = useCallback(async () => {
        try {
            setIsLoadingConnect(true);
            setConnectError(null);
            const res = await paymentMethodService.getConnectStatus();
            if (res?.data) {
                setConnectStatus(res.data);
            }
        } catch (err: any) {
            console.warn("Notice: fetchConnectStatus:", err?.message);
            setConnectError(err?.message || "Failed to load payout account status");
        } finally {
            setIsLoadingConnect(false);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
        fetchConnectStatus();
    }, [fetchPaymentMethods, fetchConnectStatus]);

    const handleSetDefault = async (id: string) => {
        setPaymentMethods((prev) =>
            prev.map((pm) => ({
                ...pm,
                isDefault: pm._id === id,
            }))
        );

        if (selectedDetailsMethod && selectedDetailsMethod._id === id) {
            setSelectedDetailsMethod((prev) =>
                prev ? { ...prev, isDefault: true } : null
            );
        }

        try {
            setActionId(id);
            setActionType("default");
            const res = await paymentMethodService.setDefaultPaymentMethod(id);
            if (res?.data?.paymentMethod) {
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

    const handleConfirmDelete = async () => {
        if (!methodToDelete) return;

        if (methodToDelete.isDefault) {
            dispatch(
                toastify({
                    type: "error",
                    message: "You cannot delete your default payment method. Please set another payment method as default first.",
                    duration: DURATION,
                })
            );
            setMethodToDelete(null);
            return;
        }

        const targetId = methodToDelete._id;

        try {
            setActionId(targetId);
            setActionType("delete");

            setPaymentMethods((prev) => prev.filter((pm) => pm._id !== targetId));

            if (selectedDetailsMethod?._id === targetId) {
                setSelectedDetailsMethod(null);
            }

            await paymentMethodService.deletePaymentMethod(targetId);

            dispatch(
                toastify({
                    type: "success",
                    message: "Payment method removed successfully.",
                    duration: DURATION,
                })
            );

            setMethodToDelete(null);
            await fetchPaymentMethods();
        } catch (err: any) {
            await fetchPaymentMethods();
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

    const handleStartConnectOnboarding = async () => {
        try {
            setIsStartingOnboarding(true);
            const res = await paymentMethodService.createConnectOnboardingLink();
            if (res?.url) {
                window.location.href = res.url;
            } else {
                throw new Error("Did not receive a valid redirect URL from Stripe");
            }
        } catch (err: any) {
            dispatch(
                toastify({
                    type: "error",
                    message: err?.message || "Failed to initiate Stripe Connect onboarding.",
                    duration: DURATION,
                })
            );
            setIsStartingOnboarding(false);
        }
    };

    const handleOpenConnectDashboard = async () => {
        try {
            setIsOpeningDashboard(true);
            const res = await paymentMethodService.createConnectDashboardLink();
            if (res?.url) {
                window.open(res.url, "_blank", "noopener,noreferrer");
            } else {
                throw new Error("Unable to create Stripe dashboard link");
            }
        } catch (err: any) {
            dispatch(
                toastify({
                    type: "error",
                    message: err?.message || "Failed to open Stripe dashboard.",
                    duration: DURATION,
                })
            );
        } finally {
            setIsOpeningDashboard(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Payments &amp; Payouts
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-160">
                        Manage your saved payment methods for billing and configure your Stripe Connect
                        account to receive direct payouts for your completed contracts and milestones.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {isFreelancer && <StripeConnectSection
                    connectStatus={connectStatus}
                    isLoadingConnect={isLoadingConnect}
                    connectError={connectError}
                    isStartingOnboarding={isStartingOnboarding}
                    isOpeningDashboard={isOpeningDashboard}
                    onRetry={fetchConnectStatus}
                    onStartOnboarding={handleStartConnectOnboarding}
                    onOpenDashboard={handleOpenConnectDashboard}
                />}

                {isClient && <SavedPaymentMethodsSection
                    paymentMethods={paymentMethods}
                    isLoadingMethods={isLoadingMethods}
                    methodsError={methodsError}
                    actionId={actionId}
                    actionType={actionType}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    onRetry={fetchPaymentMethods}
                    onSetDefault={handleSetDefault}
                    onDeleteRequest={(m: SetStateAction<IPaymentMethodItem | null>) => setMethodToDelete(m)}
                    onViewDetails={(m: SetStateAction<IPaymentMethodItem | null>) => setSelectedDetailsMethod(m)}
                />}

                <SecurityComplianceSection />
            </div>

            {/* Modals */}
            <AddPaymentMethodModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchPaymentMethods}
            />

            <PaymentMethodDetailsModal
                isOpen={!!selectedDetailsMethod}
                onClose={() => setSelectedDetailsMethod(null)}
                method={selectedDetailsMethod}
                onSetDefault={handleSetDefault}
                onDeleteRequest={(m) => {
                    setSelectedDetailsMethod(null);
                    setMethodToDelete(m);
                }}
                isSettingDefault={
                    !!selectedDetailsMethod &&
                    actionId === selectedDetailsMethod._id &&
                    actionType === "default"
                }
            />

            <DeletePaymentMethodModal
                isOpen={!!methodToDelete}
                onClose={() => {
                    if (!actionType) setMethodToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                method={methodToDelete}
                isDeleting={actionType === "delete"}
            />
        </div>
    );
}