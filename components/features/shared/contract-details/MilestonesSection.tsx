"use client";

import { IContract } from "@/services/contract.service";
import { IMilestone } from "@/services/milestone.service";
import { UserRole } from "@/utils/enums.utils";
import { MilestoneCardItem } from "./milestones-section/MilestoneCardItem";

export default function MilestonesSection({
    contract,
    milestones,
    currentUserId,
    currentUserRole,
    onSuccess,
}: {
    contract: IContract;
    milestones: IMilestone[];
    currentUserId?: string;
    currentUserRole?: string;
    onSuccess: () => void;
}) {
    const isClient =
        typeof contract.client === "object" && contract.client !== null
            ? contract.client._id === currentUserId
            : contract.client === currentUserId || currentUserRole === UserRole.CLIENT || currentUserRole === "client";

    const isFreelancer =
        typeof contract.freelancer === "object" && contract.freelancer !== null
            ? contract.freelancer._id === currentUserId
            : contract.freelancer === currentUserId || currentUserRole === UserRole.FREELANCER || currentUserRole === "freelancer";

    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-headline-lg text-on-surface">Milestones Lifecycle Engine</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Deliverables, verification steps, and escrow release controls.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                {milestones.length === 0 ? (
                    <div className="card text-center py-8 text-on-surface-variant">
                        No milestones created for this contract yet.
                    </div>
                ) : (
                    milestones.map((milestone) => (
                        <MilestoneCardItem
                            key={milestone._id}
                            milestone={milestone}
                            contract={contract}
                            isClient={isClient}
                            isFreelancer={isFreelancer}
                            onSuccess={onSuccess}
                        />
                    ))
                )}
            </div>
        </section>
    );
}