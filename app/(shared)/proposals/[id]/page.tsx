import ProposalDetailsPage from '@/views/shared/ProposalDetailsPage'
import React from 'react'

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <ProposalDetailsPage proposalId={id} />
    )
}

export default page