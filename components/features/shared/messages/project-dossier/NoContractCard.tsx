/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState } from "react";
import { FileQuestion, PlusCircle } from "lucide-react";
import { ICreateContractDto } from "@/services/contract.service";
import CreateContractModal from "@/components/modals/CreateContractModal";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { UserRole } from "@/utils/enums.utils";

interface NoContractCardProps {
    activeConversationId: string;
    proposalId?: string;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
}

export default function NoContractCard({
    activeConversationId,
    proposalId,
    onCreateContract,
}: NoContractCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { me } = useSelector(selectMeSlice);
    const isClient = me?.role === UserRole.CLIENT;

    return (
        <>
            <section className="card flex flex-col items-center justify-center text-center gap-3 h-full py-12! border border-border rounded-lg bg-white p-5">
                <span className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                    <FileQuestion size={20} />
                </span>
                <p className="text-body-md text-on-surface font-medium">No active contract</p>
                <p className="text-body-sm text-on-surface-variant max-w-xs">
                    {isClient
                        ? "Create a draft contract and set deliverables/milestones for this accepted proposal."
                        : "Waiting for the client to create and send a draft contract for review."}
                </p>
                {isClient && onCreateContract && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        <PlusCircle size={15} />
                        Create Contract
                    </button>
                )}
            </section>

            {isClient && (
                <CreateContractModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    proposalId={proposalId}
                    activeConversationId={activeConversationId}
                    onCreateContract={onCreateContract}
                />
            )}
        </>
    );
}