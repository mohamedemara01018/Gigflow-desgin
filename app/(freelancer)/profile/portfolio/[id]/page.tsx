import FreelancerPortfolioItemDetails from "@/views/freelancer/FreelancerPortfolioItemDetails"

async function page({ params, }: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    console.log('id', id)

    return (
        <FreelancerPortfolioItemDetails id={id} />
    )
}

export default page