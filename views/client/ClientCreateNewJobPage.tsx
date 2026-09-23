/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

import StepIndicator from "@/components/ui/StepIndicator";
import JobBasicsStep from "@/components/features/client/client-create-new-job-page/Jobbasicsstep";
import ScopeDurationStep from "@/components/features/client/client-create-new-job-page/Scopedurationstep";
import BudgetTermsStep from "@/components/features/client/client-create-new-job-page/Budgettermsstep";
import JobPreviewSidebar from "@/components/features/client/client-create-new-job-page/Jobpreviewsidebar";
import { AttachmentEntityType, ExperienceLevel, JobStatus, JobType, JobVisibility } from "@/utils/enums.utils";
import { ICreateJobDto, jobService } from "@/services/jobs.service";
import { jobSkillService } from "@/services/jobSkill.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

const STEPS = [
    { id: 1, label: "Job Basics" },
    { id: 2, label: "Scope & Duration" },
    { id: 3, label: "Budget & Terms" },
];

export const INITIAL_JOB_FORM_DATA: ICreateJobDto = {
    client: "",
    category: "",
    title: "",
    description: "",
    type: JobType.HOURLY,
    budget: 0,
    hourlyRateFrom: null,
    hourlyRateTo: null,
    duration: null,
    experienceLevel: ExperienceLevel.ENTRY,
    visibility: JobVisibility.PUBLIC,
    location: "worldwide",
    maxProposals: null,
    status: JobStatus.DRAFT,
};

export default function ClientCreateNewJobPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    const { me } = useSelector(selectMeSlice);

    const stepParam = searchParams.get("step");
    const jobIdParam = searchParams.get("jobId");

    const [step, setStep] = useState(Number(stepParam) || 1);
    const [formData, setFormData] = useState<ICreateJobDto>(INITIAL_JOB_FORM_DATA);
    const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [loadingJob, setLoadingJob] = useState(false);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    useEffect(() => {
        console.log('selectedSkillIds', selectedSkillIds)
    }, [selectedSkillIds])
    // Set client ID from auth user if creating new job
    useEffect(() => {
        const currentUserId = me?._id;
        if (currentUserId && !formData.client) {
            setFormData((prev) => ({ ...prev, client: currentUserId }));
        }
    }, [me, formData.client]);

    useEffect(() => {
        const currentStep = Number(stepParam) || 1;
        setStep(currentStep > 3 ? 3 : currentStep);
    }, [stepParam]);

    // Fetch Job Data and associated JobSkills to populate form on edit/draft load
    const fetchAndFillJob = useCallback(
        async (id: string) => {
            try {
                setLoadingJob(true);
                const response = await jobService.getJobById(id);
                if (response?.data?.job) {
                    const job = response.data.job;
                    setFormData({
                        client: typeof job.client === "object" ? job.client._id : job.client || "",
                        category: typeof job.category === "object" ? job.category._id : job.category || "",
                        title: job.title || "",
                        description: job.description || "",
                        type: job.type || JobType.HOURLY,
                        budget: job.budget || 0,
                        hourlyRateFrom: job.hourlyRateFrom ?? null,
                        hourlyRateTo: job.hourlyRateTo ?? null,
                        duration: job.duration ?? null,
                        experienceLevel: job.experienceLevel || ExperienceLevel.ENTRY,
                        visibility: job.visibility || JobVisibility.PUBLIC,
                        location: job.location || "worldwide",
                        maxProposals: job.maxProposals ?? null,
                        status: job.status || JobStatus.DRAFT,
                    });
                }

                // Fetch skills attached to this job
                const skillsResponse = await jobSkillService.getJobSkills({ jobId: id });
                if (skillsResponse?.data?.jobSkills) {
                    const skillIds = skillsResponse.data.jobSkills.map((js) =>
                        typeof js.skill === "object" ? js.skill._id : js.skill
                    );
                    setSelectedSkillIds(skillIds);
                }
            } catch (err: unknown) {
                const error = err as Error;
                handleToast(error.message || "Failed to load job details.", "error");
            } finally {
                setLoadingJob(false);
            }
        },
        [handleToast]
    );

    useEffect(() => {
        if (jobIdParam) {
            fetchAndFillJob(jobIdParam);
        }
    }, [jobIdParam, fetchAndFillJob]);

    const updateForm = (patch: Partial<ICreateJobDto>) => {
        setFormData((prev) => ({ ...prev, ...patch }));
    };

    const goToStep = (nextStep: number) => {
        const targetStep = nextStep > 3 ? 3 : nextStep;
        const url = jobIdParam
            ? `/client/jobs/create?step=${targetStep}&jobId=${jobIdParam}`
            : `/client/jobs/create?step=${targetStep}`;
        router.push(url);
    };

    const isStepOneComplete =
        formData.title.trim().length > 0 &&
        !!formData.category &&
        selectedSkillIds.length > 0;

    const handleNextStep = () => {
        if (step === 1 && !isStepOneComplete) return;
        goToStep(step + 1);
    };

    const handlePrevStep = () => {
        goToStep(step - 1);
    };

    const getUserId = (): string => {
        return formData.client || me?._id || "";
    };

    // Sync skills with backend database
    const syncJobSkills = async (targetJobId: string, skillIds: string[]) => {
        const existingSkillsRes = await jobSkillService.getJobSkills({ jobId: targetJobId });
        const existingJobSkills = existingSkillsRes.data?.jobSkills || [];

        const existingSkillMap = new Map<string, string>();
        existingJobSkills.forEach((js) => {
            const skillId = typeof js.skill === "object" ? js.skill._id : js.skill;
            existingSkillMap.set(skillId, js._id);
        });

        // 1. Delete unselected skills
        for (const [skillId, jobSkillId] of existingSkillMap.entries()) {
            if (!skillIds.includes(skillId)) {
                await jobSkillService.deleteJobSkill(jobSkillId);
            }
        }

        // 2. Create newly added skills
        for (const skillId of skillIds) {
            if (!existingSkillMap.has(skillId)) {
                await jobSkillService.createJobSkill({
                    job: targetJobId,
                    skill: skillId,
                    isRequired: true,
                });
            }
        }
    };

    // Save as draft and redirect to attachment upload
    const handleSaveDraft = async () => {
        const userId = getUserId();
        if (!userId) {
            handleToast("User session not found. Please log in again.", "error");
            return;
        }

        try {
            setSavingDraft(true);
            const payload: ICreateJobDto = { ...formData, client: userId, status: JobStatus.DRAFT };
            let targetJobId = jobIdParam;

            if (jobIdParam) {
                await jobService.editJob(jobIdParam, payload);
                handleToast("Draft updated successfully!", "success");
            } else {
                const res = await jobService.createJob(payload);
                targetJobId = res?.data?.job?._id || res?.data?._id;
                handleToast("Draft created successfully!", "success");
            }

            if (targetJobId) {
                await syncJobSkills(targetJobId, selectedSkillIds);
                router.push(
                    `/upload-attachment?entity-type=${AttachmentEntityType.JOB}&entity-id=${targetJobId}`
                );
            }
        } catch (error: unknown) {
            const err = error as Error;
            handleToast(err.message || "Failed to save draft.", "error");
        } finally {
            setSavingDraft(false);
        }
    };

    // Save/publish job and proceed to upload attachments page
    const handlePublish = async () => {
        const userId = getUserId();
        if (!userId) {
            handleToast("User session not found. Please log in again.", "error");
            return;
        }

        try {
            setPublishing(true);
            const payload: ICreateJobDto = { ...formData, client: userId, status: JobStatus.OPEN };
            let targetJobId = jobIdParam;

            if (jobIdParam) {
                await jobService.editJob(jobIdParam, payload);
                handleToast("Job post updated successfully!", "success");
            } else {
                const res = await jobService.createJob(payload);
                targetJobId = res?.data?.job?._id || res?.data?._id;
                handleToast("Job post created successfully!", "success");
            }

            if (targetJobId) {
                await syncJobSkills(targetJobId, selectedSkillIds);
                router.push(
                    `/upload-attachment?entity-type=${AttachmentEntityType.JOB}&entity-id=${targetJobId}`
                );
            }
        } catch (error: unknown) {
            const err = error as Error;
            handleToast(err.message || "Failed to publish job posting.", "error");
        } finally {
            setPublishing(false);
        }
    };

    if (loadingJob) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-body-sm text-on-surface-variant">
                            Client Portal / My Jobs / Create New Job Post
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <h1 className="text-headline-lg text-on-surface">
                                {jobIdParam ? "Edit Job Posting" : "Create Job Posting"}
                            </h1>
                            <span className="flex items-center gap-1 text-label-sm text-primary bg-primary-container/10 px-2.5 py-1 rounded-full">
                                <ShieldCheck size={14} />
                                {me?.firstName
                                    ? `${me.firstName} ${me.lastName || ""}`.trim()
                                    : "Verified Client"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Auto-saved draft
                        </span>
                        <button
                            onClick={handleSaveDraft}
                            disabled={savingDraft || publishing}
                            className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {savingDraft ? "Saving…" : "Save Draft"}
                        </button>
                    </div>
                </div>

                <StepIndicator current={step} STEPS={STEPS} />

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 mt-10 items-start">
                    <div className="flex flex-col gap-6 min-w-0">
                        {step === 1 && (
                            <JobBasicsStep
                                formData={formData}
                                updateForm={updateForm}
                                selectedSkillIds={selectedSkillIds}
                                setSelectedSkillIds={setSelectedSkillIds}
                            />
                        )}
                        {step === 2 && (
                            <ScopeDurationStep formData={formData} updateForm={updateForm} />
                        )}
                        {step === 3 && (
                            <BudgetTermsStep formData={formData} updateForm={updateForm} />
                        )}

                        <div className="card p-4! flex flex-wrap items-center justify-between gap-4">
                            <p className="text-body-sm text-on-surface-variant">
                                Escrow deposit automatically calculated upon hiring confirmation.
                            </p>
                            <div className="flex items-center gap-3 shrink-0 ml-auto">
                                {step > 1 && (
                                    <button
                                        onClick={handlePrevStep}
                                        disabled={publishing || savingDraft}
                                        className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </button>
                                )}

                                {step === 3 && (
                                    <button
                                        onClick={handleSaveDraft}
                                        disabled={savingDraft || publishing}
                                        className="flex items-center gap-2 bg-surface-variant text-on-surface text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
                                    >
                                        {savingDraft ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            "Save as Draft"
                                        )}
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={step === 1 && !isStepOneComplete}
                                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Continue
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        disabled={publishing || savingDraft}
                                        onClick={handlePublish}
                                        className={`flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity ${publishing || savingDraft
                                            ? "cursor-not-allowed opacity-60"
                                            : "cursor-pointer"
                                            }`}
                                    >
                                        {publishing ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Continue to Attachments
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <JobPreviewSidebar
                        formData={formData}
                        onPublish={handlePublish}
                        publishing={publishing}
                    />
                </div>
            </div>
        </main>
    );
}