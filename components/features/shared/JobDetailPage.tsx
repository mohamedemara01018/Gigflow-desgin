"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplyCard from "@/components/features/job-details/ApplyCard";
import ClientInfoCard from "@/components/features/job-details/ClientInfoCard";
import JobDescription from "@/components/features/job-details/JobDescription";
import JobDetailsCard from "@/components/features/job-details/JobDetailsCard";
import JobHeader from "@/components/features/job-details/JobHeader";
import { jobService, IJob } from "@/services/jobs.service";
import {
    ArrowLeft,
    Banknote,
    Briefcase,
    TrendingUp,
    CalendarDays,
} from "lucide-react";
import { IJobSkill, jobSkillService } from "@/services/jobSkill.service";
import Loading from "@/components/ui/Loading";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { UserRole } from "@/utils/enums.utils";

interface JobDetailPageProps {
    jobId: string;
}

export default function JobDetailPage({ jobId }: JobDetailPageProps) {
    const router = useRouter();
    const [job, setJob] = useState<IJob | null>(null);
    const [skills, setSkills] = useState<IJobSkill[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role == UserRole.FREELANCER
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch job details and job skills concurrently
                const [jobRes, skillsRes] = await Promise.all([
                    jobService.getJobById(jobId),
                    jobSkillService.getJobSkills({ jobId }),
                ]);

                if (isMounted) {
                    if (jobRes.data?.job) {
                        setJob(jobRes.data.job);
                    }
                    if (skillsRes.data?.jobSkills) {
                        setSkills(skillsRes.data.jobSkills);
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Failed to load job details";
                    setError(message);
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
    }, [jobId]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (error || !job) {
        return (
            <div className="wrapper py-12 text-center">
                <p className="text-body-lg text-error mb-4">
                    {error || "Job not found"}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-primary hover:underline inline-flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to search
                </button>
            </div>
        );
    }

    // Format dynamic job details sidebar items
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
                        {isFreelancer && <ApplyCard job={job} />}
                        <JobDetailsCard JOB_DETAILS={jobDetails} />
                        <ClientInfoCard client={job.client} />
                    </aside>
                </div>
            </div>
        </main>
    );
}