import MessagesPage from "@/views/shared/MessagesPage";

interface PageProps {
    searchParams: Promise<{
        recipient?: string;
        job?: string;
        proposal?: string;
    }>;
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    return (
        <MessagesPage
            recipient={resolvedParams.recipient}
            job={resolvedParams.job}
            proposal={resolvedParams.proposal}
        />
    );
}