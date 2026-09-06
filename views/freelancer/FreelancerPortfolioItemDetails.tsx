"use client";

import { useEffect, useState } from "react";
import {
    portfolioItemService,
    IPortfolioItem,
    ICloudinaryImage,
} from "@/services/portfolioItem.service";
import Loading from "@/components/ui/Loading";
import PortfolioMetrics from "@/components/features/freelancer/freelancer-portfolio-item-details/PortfolioMetrics";
import PortfolioGallery from "@/components/features/freelancer/freelancer-portfolio-item-details/PortfolioGallery";
import PortfolioProjectInfo from "@/components/features/freelancer/freelancer-portfolio-item-details/PortfolioProjectInfo";
import PortfolioSidebar from "@/components/features/freelancer/freelancer-portfolio-item-details/PortfolioSidebar";


export interface PortfolioProjectDetailProps {
    id: string;
}

export default function FreelancerPortfolioItemDetails({
    id,
}: PortfolioProjectDetailProps) {
    const [project, setProject] = useState<IPortfolioItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        const fetchPortfolioItem = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await portfolioItemService.getPortfolioItemById(id);
                if (isMounted) {
                    setProject(response?.data?.portfolioItem ?? null);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : "Failed to load portfolio item";
                    setError(errorMessage);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPortfolioItem();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return <Loading />;
    }

    if (error || !project) {
        return (
            <div className="p-6 text-center card my-6">
                <p className="text-body-lg font-medium text-error">
                    {error || "Portfolio item not found"}
                </p>
            </div>
        );
    }

    const gallery: ICloudinaryImage[] = project.thumbnail?.image
        ? [project.thumbnail, ...project.images]
        : project.images;

    return (
        <div>
            {/* Header & Status */}
            <div>
                <div className="flex items-center justify-between flex-wrap gap-3 mt-3 pb-4 border-b border-outline-variant">
                    <span className="bg-primary/10 text-primary text-label-md font-medium rounded-full px-3.5 py-1.5 capitalize">
                        {project.status}
                    </span>
                </div>
            </div>

            {/* Metrics */}
            <PortfolioMetrics project={project} />

            {/* Main Content & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <PortfolioGallery gallery={gallery} title={project.title} />
                    <PortfolioProjectInfo title={project.title} description={project.description} />
                </div>

                <PortfolioSidebar project={project} />
            </div>
        </div>
    );
}