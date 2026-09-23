import ClientUpdateJobPage from '@/views/client/ClientUpdateJobPage'
import React from 'react'

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <ClientUpdateJobPage jobId={id} />
    )
}

export default page