import FreelancerUpdateProposalPage from "@/views/freelancer/FreelancerUpdateProposalPage";

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <FreelancerUpdateProposalPage proposalId={id} />
    )
}

export default page