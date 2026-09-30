/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ProposalTermsCard from "@/components/features/freelancer/freelancer-submit-proposal/Proposaltermscard";
import JobBriefCard from "@/components/features/freelancer/freelancer-submit-proposal/Jobbriefcard";
import CoverLetterCard from "@/components/features/freelancer/freelancer-submit-proposal/Coverlettercard";
import ProposalSidebar from "@/components/features/freelancer/freelancer-submit-proposal/Proposalsidebar";
import { Editor } from "@tiptap/core";
import { proposalService } from "@/services/proposal.service";
import { AttachmentEntityType, DeliveryDurationUnit } from "@/utils/enums.utils";
import { IJob, jobService } from "@/services/jobs.service";
import SmallLoading from "@/components/ui/SmallLoading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";

const DURATION = 3000;

export default function FreelancerSubmitProposalPage({ jobId }: { jobId: string }) {
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

    // State for Job Fetching
    const [job, setJob] = useState<IJob | null>(null);
    const [loadingJob, setLoadingJob] = useState<boolean>(true);

    // Proposal Form State
    const [projectBid, setProjectBid] = useState("11500");
    const [durationValue, setDurationValue] = useState("3");
    const [durationUnit, setDurationUnit] = useState<DeliveryDurationUnit>(DeliveryDurationUnit.WEEKS);

    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const totalBid = parseFloat(projectBid) || 0;
    const platformFee = totalBid * 0.1;
    const netReceive = totalBid - platformFee;

    // Form Validation helper
    const parsedBid = parseFloat(projectBid);
    const parsedDuration = parseInt(durationValue, 10);
    const isCoverLetterValid = Boolean(coverLetter && coverLetter !== "<p></p>" && coverLetter.trim() !== "");
    const isBidValid = !isNaN(parsedBid) && parsedBid > 0;
    const isDurationValid = !isNaN(parsedDuration) && parsedDuration > 0;
    const isUserAndJobReady = Boolean(jobId && me?._id);

    // Check if the overall form is valid
    const isFormValid = isUserAndJobReady && isCoverLetterValid && isBidValid && isDurationValid;

    // Fetch Job Data on mount
    useEffect(() => {
        if (!jobId) {
            handleToast("Invalid or missing Job ID.", "error");
            setLoadingJob(false);
            return;
        }

        const fetchJobDetails = async () => {
            try {
                setLoadingJob(true);
                const response = await jobService.getJobById(jobId);
                setJob(response.data.job);

                // Pre-fill budget default if available from job details
                if (response.data.job?.budget) {
                    setProjectBid(response.data.job.budget.toString());
                }
            } catch (err: any) {
                const errorMsg = err?.message || "Failed to load job details.";
                handleToast(errorMsg, "error");
            } finally {
                setLoadingJob(false);
            }
        };

        fetchJobDetails();
    }, [jobId, handleToast]);

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
        setCoverLetter(editor.getHTML());

        editor.on("update", () => {
            setCoverLetter(editor.getHTML());
        });
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            handleToast("Please complete all required fields properly.", "warning");
            return;
        }

        try {
            setSubmitting(true);

            const response = await proposalService.createProposal({
                job: jobId,
                freelancer: String(me?._id),
                coverLetter,
                bidAmount: parsedBid,
                estimatedDuration: {
                    value: parsedDuration,
                    unit: durationUnit,
                },
            });

            handleToast("Proposal created successfully!", "success");

            const newProposalId = response.data.proposal._id;
            router.push(`/upload-attachment?entity-type=${AttachmentEntityType.PROPOSAL}&entity-id=${newProposalId}`);
        } catch (err: any) {
            const errorMsg = err?.message || "Failed to submit proposal. Please try again.";
            handleToast(errorMsg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
                <div className="flex flex-col gap-6 min-w-0">
                    {/* Job Brief Card Handling States */}
                    {loadingJob ? (
                        <SmallLoading />
                    ) : (
                        <JobBriefCard job={job} />
                    )}

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

                    <CoverLetterCard
                        coverLetter={coverLetter}
                        handleEditorReady={handleEditorReady}
                    />

                    <div className="card p-5!">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer px-2"
                            >
                                Cancel & Return
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loadingJob || !isFormValid}
                                className={`flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-2.5 hover:opacity-90 transition-opacity ml-auto ${submitting || loadingJob || !isFormValid
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                    }`}
                            >
                                {submitting ? "Submitting…" : "Submit Proposal"}
                                <span className="text-label-sm bg-on-primary/20 rounded-full px-2 py-0.5">
                                    go to upload Attachment
                                </span>
                                {!submitting && <ArrowRight size={15} />}
                            </button>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-3">
                            By submitting this proposal, you agree to the GigFlow Escrow Protection Agreement and
                            verify your readiness to execute according to agreed milestone deliverables.
                        </p>
                    </div>
                </div>

                {job && <ProposalSidebar job={job!} />}
            </div>
        </main>
    );
}