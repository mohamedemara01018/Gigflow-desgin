import FreelancerProfilePage from '@/views/freelancer/FreelancerProfilePage'

async function page({ params, }: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    console.log('id', id)

    return (
        <FreelancerProfilePage id={id} />
    )
}

export default page