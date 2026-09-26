import FreelancerSubmitProposalPage from "@/views/freelancer/FreelancerSubmitProposalPage";

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log('apply i d', id)
    return (
        <FreelancerSubmitProposalPage jobId={id} />
    )
}

export default page