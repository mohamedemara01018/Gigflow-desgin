import ContractDetailsPage from "@/views/shared/ContractDetailsPage";
import React from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return <ContractDetailsPage contractId={id} />;
}