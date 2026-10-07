import MessagesPage from "@/views/shared/MessagesPage";

interface PageProps {
    searchParams: Promise<{
        id?: string;
        conversationId?: string;
        recipient?: string;
        job?: string;
        proposal?: string;
    }>;
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    return (
        <MessagesPage
            initialConversationId={resolvedParams.id || resolvedParams.conversationId}
            recipient={resolvedParams.recipient}
            job={resolvedParams.job}
            proposal={resolvedParams.proposal}
        />
    );
}