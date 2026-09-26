/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import ProposalTermsCard from "@/components/features/freelancer/freelancer-submit-proposal/Proposaltermscard";
import JobBriefCard from "@/components/features/freelancer/freelancer-submit-proposal/Jobbriefcard";
import CoverLetterCard from "@/components/features/freelancer/freelancer-submit-proposal/Coverlettercard";
import ProposalSidebar from "@/components/features/freelancer/freelancer-submit-proposal/Proposalsidebar";
import { Editor } from "@tiptap/core";
import { proposalService, IProposal } from "@/services/proposal.service";
import { AttachmentEntityType, DeliveryDurationUnit } from "@/utils/enums.utils";
import { IJob, jobService } from "@/services/jobs.service";
import SmallLoading from "@/components/ui/SmallLoading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";

const DURATION = 3000;

export default function FreelancerUpdateProposalPage({ proposalId }: { proposalId: string }) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    const { me } = useSelector(selectMeSlice);

    // Toastification Helper
    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // Loading & Data States
    const [proposal, setProposal] = useState<IProposal | null>(null);
    const [job, setJob] = useState<IJob | null>(null);
    const [loadingProposal, setLoadingProposal] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState(false);

    // Proposal Form State
    const [projectBid, setProjectBid] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [durationUnit, setDurationUnit] = useState<DeliveryDurationUnit>(DeliveryDurationUnit.WEEKS);

    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [coverLetter, setCoverLetter] = useState("");

    const totalBid = parseFloat(projectBid) || 0;
    const platformFee = totalBid * 0.1;
    const netReceive = totalBid - platformFee;

    // Form Validation Helper
    const parsedBid = parseFloat(projectBid);
    const parsedDuration = parseInt(durationValue, 10);
    const isCoverLetterValid = Boolean(coverLetter && coverLetter !== "<p></p>" && coverLetter.trim() !== "");
    const isBidValid = !isNaN(parsedBid) && parsedBid > 0;
    const isDurationValid = !isNaN(parsedDuration) && parsedDuration > 0;
    const isUserReady = Boolean(me?._id && proposalId);

    const isFormValid = isUserReady && isCoverLetterValid && isBidValid && isDurationValid;

    // 1. Fetch existing proposal and its associated job details
    useEffect(() => {
        if (!proposalId) {
            handleToast("Invalid or missing Proposal ID.", "error");
            setLoadingProposal(false);
            return;
        }

        const fetchProposalAndJob = async () => {
            try {
                setLoadingProposal(true);

                // Fetch Proposal
                const proposalRes = await proposalService.getProposalById(proposalId);
                const fetchedProposal = proposalRes.data.proposal;
                setProposal(fetchedProposal);

                // Populate form fields with existing data
                setProjectBid(fetchedProposal.bidAmount?.toString() || "");
                setCoverLetter(fetchedProposal.coverLetter || "");

                if (fetchedProposal.estimatedDuration) {
                    setDurationValue(fetchedProposal.estimatedDuration.value.toString());
                    setDurationUnit(fetchedProposal.estimatedDuration.unit);
                }

                // Fetch full Job details using job reference ID
                const jobId = typeof fetchedProposal.job === "object" ? fetchedProposal.job._id : fetchedProposal.job;
                if (jobId) {
                    const jobRes = await jobService.getJobById(jobId);
                    setJob(jobRes.data.job);
                }
            } catch (err: any) {
                const errorMsg = err?.message || "Failed to load proposal details.";
                handleToast(errorMsg, "error");
            } {
                setLoadingProposal(false);
            }
        };

        fetchProposalAndJob();
    }, [proposalId, handleToast]);

    // 2. Sync editor content when cover letter is loaded from backend
    useEffect(() => {
        if (editorInstance && coverLetter !== undefined) {
            const currentHtml = editorInstance.getHTML();
            if (currentHtml !== coverLetter) {
                editorInstance.commands.setContent(coverLetter || "");
            }
        }
    }, [coverLetter, editorInstance]);

    const handleEditorReady = (editor: Editor) => {
        setEditorInstance(editor);

        editor.on("update", () => {
            setCoverLetter(editor.getHTML());
        });
    };

    // 3. Handle Update Submission
    const handleUpdate = async () => {
        if (!isFormValid) {
            handleToast("Please complete all required fields properly.", "warning");
            return;
        }

        try {
            setSubmitting(true);

            // Execute PATCH request to update proposal details
            await proposalService.updateProposal(proposalId, {
                coverLetter,
                bidAmount: parsedBid,
                estimatedDuration: {
                    value: parsedDuration,
                    unit: durationUnit,
                },
            });

            handleToast("Proposal updated successfully!", "success");

            // Navigate user to manage/update attachments
            router.push(`/upload-attachment?entity-type=${AttachmentEntityType.PROPOSAL}&entity-id=${proposalId}`);
        } catch (err: any) {
            const errorMsg = err?.message || "Failed to update proposal. Please try again.";
            handleToast(errorMsg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingProposal) {
        return (
            <main className="bg-surface min-h-screen py-12 flex justify-center items-center">
                <SmallLoading />
            </main>
        );
    }

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
                <div className="flex flex-col gap-6 min-w-0">
                    {/* Header Banner */}
                    <div className="card p-5! bg-surface-container-low border border-outline-variant">
                        <h1 className="text-headline-md font-semibold text-on-surface">
                            Edit Proposal Terms
                        </h1>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Modify your cover letter, bid amount, or estimated timeframe before the client reviews or accepts your proposal.
                        </p>
                    </div>

                    {/* Job Brief Card */}
                    <JobBriefCard job={job} />

                    {/* Proposal Terms Card */}
                    <ProposalTermsCard
                        projectBid={projectBid}
                        setProjectBid={setProjectBid}
                        durationValue={durationValue}
                        setDurationValue={setDurationValue}
                        durationUnit={durationUnit}
                        setDurationUnit={setDurationUnit}
                        platformFee={platformFee}
                        netReceive={netReceive}
                    />

                    {/* Cover Letter Editor */}
                    <CoverLetterCard
                        coverLetter={coverLetter}
                        handleEditorReady={handleEditorReady}
                    />

                    {/* Action Bar */}
                    <div className="card p-5!">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer px-2"
                            >
                                Cancel & Return
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={submitting || !isFormValid}
                                className={`flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-2.5 hover:opacity-90 transition-opacity ml-auto ${submitting || !isFormValid
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Updating…
                                    </>
                                ) : (
                                    <>
                                        Update Proposal
                                        <span className="text-label-sm bg-on-primary/20 rounded-full px-2 py-0.5">
                                            Manage Attachments
                                        </span>
                                        <ArrowRight size={15} />
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-3">
                            By updating this proposal, you agree to the GigFlow Escrow Protection Agreement and verify your updated terms for the client.
                        </p>
                    </div>
                </div>

                <ProposalSidebar />
            </div>
        </main>
    );
}