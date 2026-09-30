/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState } from "react";
import { FileQuestion, PlusCircle } from "lucide-react";
import { ICreateContractDto } from "@/services/contract.service";
import CreateContractModal from "@/components/modals/CreateContractModal";

interface NoContractCardProps {
    activeConversationId: string;
    proposalId: string;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
}

export default function NoContractCard({
    activeConversationId,
    proposalId,
    onCreateContract,
}: NoContractCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="card flex flex-col items-center justify-center text-center gap-3 h-full py-12! border border-border rounded-lg bg-white p-5">
                <span className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                    <FileQuestion size={20} />
                </span>
                <p className="text-body-md text-on-surface font-medium">No active contract</p>
                <p className="text-body-sm text-on-surface-variant">
                    Contract details and escrow milestones appear here once a proposal is accepted.
                </p>
                {onCreateContract && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                        <PlusCircle size={15} />
                        Create Contract
                    </button>
                )}
            </section>

            <CreateContractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                proposalId={proposalId}
                activeConversationId={activeConversationId}
                onCreateContract={onCreateContract}
            />
        </>
    );
}