"use client";

import { Eye, FolderOpen } from "lucide-react";

interface PortfolioMetricsProps {
    totalViews: number;
    liveProjects: number;
    progressPercent: number;
}

export default function PortfolioMetrics({
    totalViews,
    liveProjects,
    progressPercent,
}: PortfolioMetricsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="card">
                <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                    <Eye size={14} />
                    Total Impressions
                </span>
                <p className="text-headline-lg text-[32px]! leading-10! font-bold text-on-surface mt-2">
                    {totalViews.toLocaleString()}
                </p>
                <p className="text-body-sm text-primary mt-1">Across all projects</p>
            </div>

            <div className="card">
                <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                    <FolderOpen size={14} />
                    Live Projects
                </span>
                <p className="text-headline-lg text-[32px]! leading-10! font-bold text-on-surface mt-2">
                    {liveProjects}
                </p>
                <div className="h-1.5 rounded-full bg-surface-container-high mt-3 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="bg-primary text-on-primary rounded-lg p-5">
                <span className="text-label-sm uppercase tracking-wide opacity-90">
                    Portfolio Distribution
                </span>
                <div className="flex items-end gap-2 h-16 mt-3">
                    {[40, 65, 35, 90, 55, 70].map((h, i) => (
                        <span
                            key={i}
                            className="flex-1 rounded-sm bg-on-primary/40"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}