"use client";

import { Clock, MapPin, Network } from "lucide-react";
import { IJob } from "@/services/jobs.service";
import { ICategory } from "@/services/category.service";
import { formatDistanceToNow } from "@/utils/functions.utils";

interface JobHeaderProps {
    job: IJob;
    isFreelancer?: boolean;
}

export default function JobHeader({ job }: JobHeaderProps) {
    const categoryName =
        typeof job.category === "object" && job.category !== null
            ? (job.category as ICategory).name
            : "Web Development";

    const formattedPostedTime = job.publishedAt
        ? formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true })
        : "Recently";

    return (
        <section className="card">
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-headline-lg text-on-surface">
                    {job.title}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-on-surface-variant">
                <span className="flex items-center gap-1.5 text-body-sm">
                    <Network size={16} />
                    {categoryName}
                </span>
                <span className="flex items-center gap-1.5 text-body-sm">
                    <MapPin size={16} />
                    {job.location || "Remote"}
                </span>
                <span className="flex items-center gap-1.5 text-body-sm">
                    <Clock size={16} />
                    Posted {formattedPostedTime}
                </span>
            </div>
        </section>
    );
}