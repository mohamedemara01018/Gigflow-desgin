import ClientJobProposalsPage from '@/views/client/ClientJobProposalsPage'
import React from 'react'

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <ClientJobProposalsPage jobId={id} />
    )
}

export default page