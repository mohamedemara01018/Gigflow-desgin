/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import VerificationDetailsSidebar from "@/components/features/admin-verification-page/VerificationDetailsSidebar";
import VerificationTable from "@/components/features/admin-verification-page/VerificationTable";
import VerificationTabs, { TABS } from "@/components/features/admin-verification-page/VerificationTabs";
import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import { attachmentService, IGetAttachmentsApiResponse } from "@/services/attachment.service";
import {
    GetAllVerificationParams,
    IVerificationRequest,
    IVerificationRequestsApiResponse,
    verificationService,
} from "@/services/verification.service";
import { selectMeSlice } from "@/store/slices/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { AttachmentEntityType, VerificationStatus } from "@/utils/enums.utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function AdminVerificationsPage() {
    const [activeTab, setActiveTab] = useState<VerificationStatus>(VerificationStatus.PENDING);
    const [selectedVerification, setSelectedVerification] = useState<IVerificationRequest | null>(null);
    const [notes, setNotes] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectedLoading, setRejectLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [attachmentLoading, setAttachmentLoading] = useState(false);
    const [verificationResponse, setVerificationResponse] = useState<IVerificationRequestsApiResponse>();
    const [attachmentResponse, setAttachmentResponse] = useState<IGetAttachmentsApiResponse>();
    const [filters, setFilters] = useState<GetAllVerificationParams>({
        status: activeTab,
        search: "",
        page: 1,
        limit: 10,
    });
    const router = useRouter();

    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice)
    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const tabCounts = useMemo(() => {
        return TABS.reduce<Record<VerificationStatus, number>>((acc, tab) => {
            acc[tab.id] =
                verificationResponse?.data.requests.filter(
                    (request) => request.status === tab.id
                ).length ?? 0;
            return acc;
        }, {} as Record<VerificationStatus, number>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getVerifications = async () => {
            try {
                setLoading(true);
                const res = await verificationService.getAllVerification(filters);
                setVerificationResponse(res);
            } catch (error: any) {
                handleAddToastification(error.message, "error", DURATION);
            } finally {
                setLoading(false);
            }
        };
        getVerifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    useEffect(() => {
        const getEntityAttachments = async () => {
            try {
                setAttachmentLoading(true);
                const res = await attachmentService.getEntityAttachments({
                    entity: AttachmentEntityType.VERIFICATION,
                    entityId: String(selectedVerification?._id),
                });
                setAttachmentResponse(res);
            } catch (error: any) {
                handleAddToastification(error.message, "error", DURATION);
            } finally {
                setAttachmentLoading(false);
            }
        };

        if (selectedVerification?._id) {
            getEntityAttachments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVerification]);

    const handleTabChange = (status: VerificationStatus) => {
        setActiveTab(status);
        setFilters((prev) => ({
            ...prev,
            status,
        }));
        setSelectedVerification(null)
    };

    // Shared review handler to eliminate code duplication
    const handleReview = async (
        status: VerificationStatus,
        setLoading: (loading: boolean) => void,
        rejectionReason = ""
    ) => {
        if (!selectedVerification?._id || !me?._id) {
            handleAddToastification("Missing verification or reviewer details", "error", DURATION);
            return;
        }

        try {
            setLoading(true);
            const res = await verificationService.reviewVerificationRequest({
                status,
                reviewedBy: String(me._id),
                verificationId: String(selectedVerification._id),
                notes: notes,
                rejectionReason,
            });

            handleAddToastification(res.message, "success", DURATION);

            // 1. Clear modal or selected state if applicable
            setSelectedVerification(null);
            setFilters({ ...filters, status })
            setActiveTab(status)
            setNotes("");

            // 2. Trigger Next.js App Router server data refresh
            router.refresh();
        } catch (error: any) {
            handleAddToastification(
                error?.response?.data?.message || error.message || "An error occurred",
                "error",
                DURATION
            );
        } finally {
            setLoading(false);
        }
    };


    const onApprove = () => handleReview(VerificationStatus.APPROVED, setApproveLoading);

    const onReject = () =>
        handleReview(VerificationStatus.REJECTED, setRejectLoading, rejectionReason);

    const onReview = () =>
        handleReview(VerificationStatus.IN_REVIEW, setReviewLoading, rejectionReason);

    const handleDelete = async (id: string) => {
        try {
            setDeleteLoading(true);
            const res = await verificationService.deleteVerificationRequest(id);

            handleAddToastification(res.message, "success", DURATION);

            // 1. Clear modal or selected state if applicable
            setSelectedVerification(null);

            // 2. Trigger Next.js App Router server data refresh
            router.refresh();
        } catch (error: any) {
            handleAddToastification(
                error?.response?.data?.message || error.message || "An error occurred",
                "error",
                DURATION
            );
        } finally {
            setDeleteLoading(false);
        }
    }


    return (
        <div className="wrapper py-6">
            {/* Header Section */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Identity Verification Requests
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-155">
                        Manage and review KYC documentation submitted by freelancers and clients to ensure platform security and compliance.
                    </p>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        placeholder="Search user name or email..."
                        className="w-full bg-surface-container border border-outline-variant rounded-full pl-10 pr-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 mt-6">
                {/* Verification List Section */}
                <section className="card p-0! overflow-hidden h-fit">
                    <VerificationTabs
                        activeTab={activeTab}
                        tabCounts={tabCounts}
                        onTabChange={handleTabChange}
                    />

                    {loading ? (
                        <SmallLoading />
                    ) : verificationResponse?.data.requests.length === 0 ? (
                        <EmptyState
                            title="No requests here"
                            description="There are no verification requests matching this filter right now."
                        />
                    ) : (
                        <VerificationTable
                            requests={verificationResponse?.data.requests ?? []}
                            selectedVerificationId={selectedVerification?._id}
                            onSelectVerification={setSelectedVerification}
                            onDelete={handleDelete}
                            deleteLoading={deleteLoading}
                        />
                    )}
                </section>

                {/* Sidebar Details Section */}
                {selectedVerification ? (
                    <VerificationDetailsSidebar
                        selectedVerification={selectedVerification}
                        notes={notes}
                        onNotesChange={setNotes}
                        rejectionReason={rejectionReason}
                        onRejectionReasonChange={setRejectionReason}
                        attachmentLoading={attachmentLoading}
                        attachmentResponse={attachmentResponse}
                        onApprove={onApprove}
                        onReject={onReject}
                        onReview={onReview}
                        approveLoading={approveLoading}
                        rejectedLoading={rejectedLoading}
                        reviewLoading={reviewLoading}
                    />
                ) : (
                    <aside className="flex flex-col gap-6">
                        <section className="card">
                            <EmptyState
                                title="No request selected"
                                description="Select a request from the list to review its details."
                            />
                        </section>
                    </aside>
                )}
            </div>
        </div>
    );
}