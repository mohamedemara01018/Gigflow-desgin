import React from 'react'

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log(id)
    return (
        <div>page</div>
    )
}

export default page