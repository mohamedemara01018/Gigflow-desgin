import { Eye, Calendar, Briefcase } from "lucide-react";
import { formatDateTime } from "@/utils/functions.utils";
import { IPortfolioItem } from "@/services/portfolioItem.service";

interface PortfolioMetricsProps {
    project: IPortfolioItem;
}

export default function PortfolioMetrics({ project }: PortfolioMetricsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="card p-4 rounded-xl border border-outline-variant bg-surface">
                <span className="flex items-center gap-1.5 text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                    <Eye size={13} />
                    Total Views
                </span>
                <p className="text-headline-md text-[22px]! leading-7! font-bold text-on-surface mt-1.5">
                    {project.views?.toLocaleString() ?? 0}
                </p>
            </div>
            <div className="card p-4 rounded-xl border border-outline-variant bg-surface">
                <span className="flex items-center gap-1.5 text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                    <Calendar size={13} />
                    Completed
                </span>
                <p className="text-headline-md text-[22px]! leading-7! font-bold text-on-surface mt-1.5">
                    {formatDateTime(String(project.completedAt)).date}
                </p>
            </div>
            {project.role && (
                <div className="card p-4 rounded-xl border border-outline-variant bg-surface col-span-2 sm:col-span-1">
                    <span className="flex items-center gap-1.5 text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                        <Briefcase size={13} />
                        Role
                    </span>
                    <p className="text-body-lg font-semibold text-on-surface mt-1.5 truncate">
                        {project.role}
                    </p>
                </div>
            )}
        </div>
    );
}