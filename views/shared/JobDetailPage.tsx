/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplyCard from "@/components/features/shared/job-details/ApplyCard";
import JobDescription from "@/components/features/shared/job-details/JobDescription";
import JobDetailsCard from "@/components/features/shared/job-details/JobDetailsCard";
import JobHeader from "@/components/features/shared/job-details/JobHeader";
import { jobService, IJob } from "@/services/jobs.service";
import {
    ArrowLeft,
    Banknote,
    Briefcase,
    TrendingUp,
    CalendarDays,
} from "lucide-react";
import { IJobSkill, jobSkillService } from "@/services/jobSkill.service";
import { attachmentService, IAttachmentItem } from "@/services/attachment.service";
import Loading from "@/components/ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { UserRole, AttachmentEntityType } from "@/utils/enums.utils";
import { IProposal, proposalService } from "@/services/proposal.service";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import AttachmentCard from "@/components/ui/Attachmentscard";
import ClientInfoCard from "@/components/ui/ClientInfoCard";

interface JobDetailPageProps {
    jobId: string;
}

export default function JobDetailPage({ jobId }: JobDetailPageProps) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    const [job, setJob] = useState<IJob | null>(null);
    const [skills, setSkills] = useState<IJobSkill[]>([]);
    const [attachments, setAttachments] = useState<IAttachmentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Track application status and user's proposal details
    const [isApplied, setIsApplied] = useState<boolean>(false);
    const [proposal, setProposal] = useState<IProposal | null>(null);

    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role === UserRole.FREELANCER;

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // Check if freelancer has already applied to this job
    const fetchProposalOfJob = useCallback(async () => {
        if (!me?._id || !jobId) return;

        try {
            const res = await proposalService.getAllProposals({
                freelancer: me._id,
                job: jobId,
            });

            const existingProposals = res.data.proposals;
            if (existingProposals && existingProposals.length > 0) {
                setIsApplied(true);
                setProposal(existingProposals[0]);
            } else {
                setIsApplied(false);
                setProposal(null);
            }
        } catch (error: any) {
            handleToast(error.message || "Failed to fetch proposal details", "error");
        }
    }, [me?._id, jobId, handleToast]);

    useEffect(() => {
        if (isFreelancer) {
            fetchProposalOfJob();
        }
    }, [isFreelancer, fetchProposalOfJob]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [jobRes, skillsRes, attachmentsRes] = await Promise.all([
                    jobService.getJobById(jobId),
                    jobSkillService.getJobSkills({ jobId }),
                    attachmentService
                        .getEntityAttachments({
                            entity: AttachmentEntityType.JOB,
                            entityId: jobId,
                        })
                        .catch(() => null),
                ]);

                if (isMounted) {
                    if (jobRes.data?.job) {
                        setJob(jobRes.data.job);
                    }
                    if (skillsRes.data?.jobSkills) {
                        setSkills(skillsRes.data.jobSkills);
                    }
                    if (attachmentsRes?.data?.attachments) {
                        setAttachments(attachmentsRes.data.attachments);
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Failed to load job details";
                    setError(message);
                    handleToast(message, "error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (jobId) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [jobId, handleToast]);

    if (isLoading) {
        return <Loading />;
    }

    if (error || !job) {
        return (
            <div className="wrapper py-12 text-center">
                <p className="text-body-lg text-error mb-4">
                    {error || "Job not found"}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-primary hover:underline inline-flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back to search
                </button>
            </div>
        );
    }

    const jobDetails = [
        {
            icon: Banknote,
            label: job.type === "hourly" ? "Hourly Rate" : "Budget",
            value:
                job.type === "hourly"
                    ? `$${job.hourlyRateFrom ?? 0} - $${job.hourlyRateTo ?? 0}`
                    : `$${job.budget ?? 0}`,
        },
        {
            icon: Briefcase,
            label: "Job Type",
            value: job.type ? job.type.toUpperCase() : "Fixed",
        },
        {
            icon: TrendingUp,
            label: "Experience Level",
            value: job.experienceLevel || "Intermediate",
        },
        {
            icon: CalendarDays,
            label: "Duration",
            value: job.duration || "N/A",
        },
    ];

    return (
        <main className="bg-surface py-8">
            <div className="wrapper">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-primary text-body-md font-medium mb-6 hover:underline cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back to search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <div className="flex flex-col gap-6">
                        <JobHeader job={job} isFreelancer={isFreelancer} />
                        <JobDescription job={job} skills={skills} />
                    </div>

                    <aside className="flex flex-col gap-6">
                        {isFreelancer && (
                            <ApplyCard
                                job={job}
                                isApplied={isApplied}
                                proposal={proposal}
                            />
                        )}
                        <JobDetailsCard JOB_DETAILS={jobDetails} />
                        <AttachmentCard attachments={attachments} />
                        {isFreelancer && <ClientInfoCard client={job.client} className="" />}
                    </aside>
                </div>
            </div>
        </main>
    );
}