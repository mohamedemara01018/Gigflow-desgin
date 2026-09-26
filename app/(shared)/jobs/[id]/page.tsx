import JobDetailPage from "@/views/shared/JobDetailPage";
import React from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return <JobDetailPage jobId={id} />;
}