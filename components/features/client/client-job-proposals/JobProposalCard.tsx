'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import AttachmentRow from "@/components/ui/AttachmentRow";
import UserImage from "@/components/ui/UserImage";
import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";
import { IProposal } from "@/services/proposal.service";
import { attachmentService, IAttachmentItem } from "@/services/attachment.service";
import { profileService, IProfile } from "@/services/profile.service";
import { AttachmentEntityType, ProposalStatus } from "@/utils/enums.utils";
import { Star, Briefcase, DollarSign, TrendingUp, CheckCircle, XCircle, MessageSquare, Eye, User } from "lucide-react";

interface JobProposalCardProps {
    proposal: IProposal;
    onAccept?: (proposalId: string) => void;
    onReject?: (proposalId: string) => void;
    isUpdating?: boolean;
}

export default function JobProposalCard({ proposal, onAccept, onReject, isUpdating = false }: JobProposalCardProps) {
    const [attachments, setAttachments] = useState<IAttachmentItem[]>([]);
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [, setLoadingDetails] = useState(false);

    const freelancer = typeof proposal.freelancer === "object" ? proposal.freelancer : null;
    const freelancerId = freelancer?._id || (typeof proposal.freelancer === "string" ? proposal.freelancer : "");
    const profileHref = freelancerId ? `/profile/${freelancerId}` : "#";

    useEffect(() => {
        let isMounted = true;

        const loadCardData = async () => {
            setLoadingDetails(true);
            try {
                const [attachmentRes, profileRes] = await Promise.allSettled([
                    attachmentService.getEntityAttachments({
                        entity: AttachmentEntityType.PROPOSAL,
                        entityId: proposal._id,
                    }),
                    freelancerId ? profileService.getUserProfileById(freelancerId) : Promise.reject("No user ID"),
                ]);

                if (isMounted) {
                    if (attachmentRes.status === "fulfilled") {
                        setAttachments(attachmentRes.value.data.attachments || []);
                    }
                    if (profileRes.status === "fulfilled") {
                        setProfile(profileRes.value.data.profile || null);
                    }
                }
            } catch (err) {
                console.error("Error fetching card details:", err);
            } finally {
                if (isMounted) setLoadingDetails(false);
            }
        };

        loadCardData();

        return () => {
            isMounted = false;
        };
    }, [proposal._id, freelancerId]);

    const firstName = freelancer?.firstName || "";
    const lastName = freelancer?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Freelancer";
    const isAccepted = proposal.status === ProposalStatus.ACCEPTED;

    return (
        <div className="card p-6! flex flex-col justify-between gap-4">
            <div>
                {/* Header Profile Info */}
                <div className="flex items-start justify-between gap-4">
                    <Link href={profileHref} className="flex items-center gap-3 group">
                        <UserImage
                            avatarUrl={freelancer?.avatar || ""}
                            firstName={firstName}
                            lastName={lastName}
                            className="w-12 h-12 group-hover:opacity-90 transition-opacity"
                        />
                        <div>
                            <h3 className="text-title-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                                {fullName}
                            </h3>
                            <p className="text-body-sm text-on-surface-variant">
                                {profile?.title || freelancer?.title || "Freelancer"}
                            </p>
                        </div>
                    </Link>

                    {/* Proposal Financials & Status */}
                    <div className="text-right">
                        <p className="text-title-md font-bold text-primary">${proposal.bidAmount?.toLocaleString()}</p>
                        <p className="text-label-sm text-on-surface-variant">
                            In {proposal.estimatedDuration?.value} {proposal.estimatedDuration?.unit?.toLowerCase() || "days"}
                        </p>
                    </div>
                </div>

                {/* Freelancer Profile Metrics */}
                {profile && (
                    <div className="mb-4 flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-outline-variant text-label-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            {profile.averageRating ? profile.averageRating.toFixed(1) : "N/A"} ({profile.totalReviews || 0} reviews)
                        </span>
                        <span className="flex items-center gap-1">
                            <Briefcase size={14} className="text-on-surface-variant" />
                            {profile.completedJobs || 0} jobs completed
                        </span>
                        <span className="flex items-center gap-1">
                            <DollarSign size={14} className="text-on-surface-variant" />
                            ${profile.hourlyRate || 0}/hr
                        </span>
                        <span className="flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-500" />
                            {profile.successScore || 100}% Job Success
                        </span>
                    </div>
                )}

                <ReadOnlyOverview
                    content={proposal.coverLetter}
                    clampLines
                />

                {/* Attachments List */}
                {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-label-sm text-on-surface-variant font-medium">Attachments ({attachments.length})</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {attachments.map((file) => (
                                <AttachmentRow key={file._id} attachment={file} dense />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Bar Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant">
                <span className="text-label-sm uppercase px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-medium">
                    Status: {proposal.status}
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* View Profile Link */}
                    <Link
                        href={profileHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-label-sm rounded-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                        <User size={14} />
                        View Profile
                    </Link>

                    {/* View Proposal Link */}
                    <Link
                        href={`/proposals/${proposal._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-label-sm rounded-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                        <Eye size={14} />
                        View Proposal
                    </Link>

                    {/* Conditional Action: Show Message if Accepted, otherwise Reject and Hire / Send Offer */}
                    {isAccepted ? (
                        <Link
                            href={`/messages?recipient=${proposal.freelancer._id}&job=${proposal.job._id}&proposal=${proposal._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-label-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <MessageSquare size={14} />
                            Message
                        </Link>
                    ) : (
                        <>
                            {proposal.status !== ProposalStatus.REJECTED && (
                                <button
                                    disabled={isUpdating}
                                    onClick={() => onReject?.(proposal._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-label-sm rounded-md border border-error/30 text-error hover:bg-error/10 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <XCircle size={14} />
                                    Reject
                                </button>
                            )}

                            <button
                                disabled={isUpdating}
                                onClick={() => onAccept?.(proposal._id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-label-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                <CheckCircle size={14} />
                                Hire / Send Offer
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}