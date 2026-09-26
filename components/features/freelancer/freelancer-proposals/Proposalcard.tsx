"use client";
import { proposalService, type IJobRef, type IProposal } from "@/services/proposal.service";
import { attachmentService } from "@/services/attachment.service";
import { AttachmentEntityType, ProposalStatus } from "@/utils/enums.utils";


import {
    FileText,
    FileArchive,
    File as FileIcon,
    Fingerprint,
    Image as ImageIcon,
    type LucideIcon,
} from "lucide-react";
import WithdrawnProposalCard from "./WithdrawnProposalCard";
import { useState } from "react";
import { ActiveProposalCard } from "./ActiveProposalCard";


export function formatDuration(
    duration?: IProposal["estimatedDuration"] | null
): string {
    if (!duration?.value) return "Flexible";
    const unit = duration.value === 1
        ? (duration.unit ?? "").replace(/s$/, "")
        : duration.unit ?? "";
    return `${duration.value} ${unit}`.trim();
}


// ==========================================
// Proposal — job/client ref helpers (job ref can be a plain id string)
// ==========================================

export function getJob(proposal: IProposal): IJobRef | null {
    return typeof proposal.job === "object" && proposal.job !== null ? proposal.job : null;
}

export function getJobTitle(proposal: IProposal): string {
    return getJob(proposal)?.title || "Project Proposal";
}

export function getClientName(proposal: IProposal): string {
    const client = getJob(proposal)?.client;
    if (client && typeof client === "object") {
        return `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Client";
    }
    return "Client";
}

export function getClientLocation(proposal: IProposal): string {
    const job = getJob(proposal);
    const client = job && typeof job.client === "object" ? job.client : null;
    return (
        (client as { location?: string } | null)?.location ||
        (job as { location?: string } | null)?.location ||
        ""
    );
}

// ==========================================
// Proposal — navigation routes
// ==========================================

export const PROPOSAL_ROUTES = {
    /** Proposal detail page */
    view: (proposalId: string) => `/proposals/${proposalId}`,
    /** Proposal edit page */
    edit: (proposalId: string) => `/freelancer/proposals/${proposalId}/update`,
} as const;

// ==========================================
// Proposal — attachment icon helper
// ==========================================

export function getFileIcon(fileName?: string, mimeType?: string): LucideIcon {
    const lower = `${fileName ?? ""} ${mimeType ?? ""}`.toLowerCase();
    if (lower.includes("pdf")) return FileText;
    if (
        lower.includes("zip") || lower.includes("rar") || lower.includes("tar") ||
        lower.includes("gz") || lower.includes("7z") || lower.includes("compressed") ||
        lower.includes("archive")
    ) {
        return FileArchive;
    }
    if (lower.includes("figma")) return Fingerprint;
    if (lower.includes("image") || /\.(png|jpe?g|gif|webp|svg)$/.test(lower)) return ImageIcon;
    return FileIcon;
}


/** PATCH /api/proposal/:id → status: withdrawn */
export async function withdrawProposalById(proposalId: string): Promise<void> {
    await proposalService.updateProposalStatus(proposalId, {
        status: ProposalStatus.WITHDRAWN,
    });
}


export async function deleteProposalCascade(proposalId: string): Promise<void> {
    let attachmentIds: string[] = [];
    try {
        const res = await attachmentService.getEntityAttachments({
            entity: AttachmentEntityType.PROPOSAL,
            entityId: proposalId,
        });
        attachmentIds = (res.data?.attachments ?? []).map((a) => a._id);
    } catch {
        // Attachment lookup is best-effort — deleting the proposal is the critical operation
    }

    await proposalService.deleteProposal(proposalId);

    await Promise.allSettled(
        attachmentIds.map((id) => attachmentService.deleteAttachment(id))
    );
}

export default function ProposalCard({ proposal }: { proposal: IProposal }) {
    const [currentProposal, setCurrentProposal] = useState<IProposal>(proposal);
    const [isDeleted, setIsDeleted] = useState(false);

    if (isDeleted) return null;

    if (currentProposal.status === ProposalStatus.WITHDRAWN) {
        return (
            <WithdrawnProposalCard
                proposal={currentProposal}
                onDeleted={() => setIsDeleted(true)}
            />
        );
    }

    return (
        <ActiveProposalCard
            proposal={currentProposal}
            onWithdrawn={() =>
                setCurrentProposal((prev) => ({
                    ...prev,
                    status: ProposalStatus.WITHDRAWN,
                    withdrawnAt: new Date().toISOString(),
                }))
            }
            onDeleted={() => setIsDeleted(true)}
        />
    );
}


