'use client'
import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

const SECTIONS = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "eligibility", label: "2. User Eligibility" },
    { id: "security", label: "3. Account Security" },
    { id: "fees", label: "4. Fees & Payments" },
    { id: "escrow", label: "5. Escrow Services" },
    { id: "ip", label: "6. Intellectual Property" },
    { id: "termination", label: "7. Termination" },
];

function TableOfContents({ activeId }: { activeId: string }) {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav className="sticky top-8">
            <p className="text-label-sm uppercase tracking-wide text-(--color-on-surface-variant)">
                Contents
            </p>
            <ul className="flex flex-col gap-3 mt-3">
                {SECTIONS.map(({ id, label }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id}>
                            <button
                                onClick={() => scrollTo(id)}
                                className={`text-body-md text-left transition-colors ${
                                    isActive
                                        ? "text-(--color-primary) font-semibold"
                                        : "text-(--color-on-surface-variant) hover:text-(--color-on-surface)"
                                }`}
                            >
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function Callout({
    title,
    children,
    variant = "info",
}: {
    title: string;
    children: React.ReactNode;
    variant?: "info" | "warning";
}) {
    if (variant === "warning") {
        return (
            <div className="bg-(--color-surface-container-low) border-l-4 border-(--color-primary) rounded-(--radius-md) px-5 py-4 my-6">
                <p className="text-body-md font-semibold text-(--color-on-surface)">
                    {title}
                </p>
                <p className="text-body-sm text-(--color-on-surface-variant) mt-1.5 leading-relaxed">
                    {children}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-(--color-surface-container-low) rounded-(--radius-md) px-5 py-4 flex gap-3">
            <Info size={20} className="text-(--color-primary) shrink-0 mt-0.5" />
            <div>
                <p className="text-body-md font-semibold text-(--color-on-surface)">
                    {title}
                </p>
                <p className="text-body-sm text-(--color-on-surface-variant) mt-1.5 leading-relaxed">
                    {children}
                </p>
            </div>
        </div>
    );
}

function Section({
    id,
    number,
    title,
    children,
}: {
    id: string;
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-8">
            <h2 className="text-headline-md text-(--color-on-surface)">
                {number}. {title}
            </h2>
            <div className="flex flex-col gap-4 mt-3 text-body-md text-(--color-on-surface-variant) leading-relaxed">
                {children}
            </div>
        </section>
    );
}

export default function TermsOfServicePage() {
    const [activeId, setActiveId] = useState(SECTIONS[0].id);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <main className="bg-(--color-surface) min-h-screen px-6 md:px-10 py-8">
            <div className="max-w-[1280px] mx-auto">
                <span className="text-label-sm uppercase tracking-wide text-(--color-primary)">
                    Legal Information
                </span>
                <h1 className="text-display-lg text-(--color-on-surface) mt-2">
                    Terms of Service
                </h1>
                <p className="text-body-lg text-(--color-on-surface-variant) mt-4 max-w-[640px]">
                    Effective Date: October 25, 2024. Please read these terms carefully
                    before using the GigFlow ecosystem.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 mt-10">
                    <TableOfContents activeId={activeId} />

                    <article className="card flex flex-col gap-8">
                        <Callout title="Important Notice">
                            By accessing or using GigFlow, you agree to be bound by these
                            Terms of Service. If you do not agree to all the terms and
                            conditions, then you may not access the website or use any
                            services.
                        </Callout>

                        <Section id="acceptance" number="1" title="Acceptance of Terms">
                            <p>
                                Welcome to GigFlow. These Terms of Service (&quot;Terms&quot;)
                                constitute a legally binding agreement between you, whether
                                personally or on behalf of an entity (&quot;you&quot;, &quot;User&quot;, &quot;Client&quot;,
                                or &quot;Freelancer&quot;) and GigFlow Ecosystems Inc. (&quot;GigFlow&quot;, &quot;we&quot;,
                                &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of the
                                GigFlow platform.
                            </p>
                            <p>
                                GigFlow operates as a platform that connects Clients seeking
                                services with Freelancers offering services. We do not
                                provide the services directly, nor are we an employer,
                                broker, or agent for any User.
                            </p>
                        </Section>

                        <Section id="eligibility" number="2" title="User Eligibility">
                            <p>
                                To use GigFlow, you must be capable of forming a binding
                                contract with us. By using the platform, you represent and
                                warrant that:
                            </p>
                            <ul className="flex flex-col gap-2">
                                {[
                                    "You are at least 18 years of age (or the age of legal majority in your jurisdiction).",
                                    "You have the legal authority to enter into these Terms, particularly if you are registering on behalf of a company or other legal entity.",
                                    "Your use of the platform does not violate any applicable law or regulation.",
                                    "You have not been previously suspended or removed from the platform.",
                                ].map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        <Section id="security" number="3" title="Account Security">
                            <p>
                                You are responsible for maintaining the confidentiality of
                                your account credentials and for all activities that occur
                                under your account. You agree to notify GigFlow immediately of
                                any unauthorized use of your account or any other breach of
                                security.
                            </p>
                            <Callout title="Prohibited Activities" variant="warning">
                                You may not share your account credentials, transfer your
                                account to another party, or create multiple accounts for the
                                purpose of circumventing platform rules or manipulating the
                                marketplace.
                            </Callout>
                        </Section>

                        <Section id="fees" number="4" title="Fees & Payments">
                            <p>
                                GigFlow charges service fees for use of the platform. These
                                fees are subject to change, and we will provide notice of any
                                changes before they apply to new transactions.
                            </p>
                            <p>
                                Clients agree to pay Freelancers for completed services as
                                agreed upon in their specific contracts. All payments must be
                                processed through the GigFlow platform to be eligible for our
                                payment protection programs.
                            </p>
                            <p>
                                <strong className="text-(--color-on-surface)">
                                    Circumvention:
                                </strong>{" "}
                                Attempting to move payments outside the GigFlow platform to
                                avoid service fees is a material breach of these Terms and may
                                result in immediate account termination.
                            </p>
                        </Section>

                        <Section id="escrow" number="5" title="Escrow Services">
                            <p>
                                GigFlow utilizes an escrow service to provide payment
                                protection. When a Client funds a milestone or project, the
                                funds are held securely in escrow until the work is delivered
                                by the Freelancer and approved by the Client.
                            </p>
                            <p>
                                In the event of a dispute, GigFlow offers a dispute resolution
                                process. Both parties agree to cooperate with the dispute
                                resolution process in good faith and accept the final
                                determination made by GigFlow&apos;s resolution team.
                            </p>
                        </Section>

                        <Section id="ip" number="6" title="Intellectual Property">
                            <p>
                                <strong className="text-(--color-on-surface)">
                                    Platform IP:
                                </strong>{" "}
                                GigFlow retains all right, title, and interest in the platform
                                itself, including its design, code, logos, and trademarks. You
                                may not copy, modify, or distribute our intellectual property
                                without written consent.
                            </p>
                            <p>
                                <strong className="text-(--color-on-surface)">
                                    User Content:
                                </strong>{" "}
                                By posting content on the platform (such as portfolios or job
                                descriptions), you grant GigFlow a non-exclusive license to
                                use, display, and distribute that content for the purpose of
                                operating the platform.
                            </p>
                            <p>
                                <strong className="text-(--color-on-surface)">
                                    Work Product:
                                </strong>{" "}
                                Unless otherwise agreed in a specific contract between Client
                                and Freelancer, upon full payment for a project, the
                                Freelancer grants the Client all intellectual property rights
                                to the completed work product.
                            </p>
                        </Section>

                        <Section id="termination" number="7" title="Termination">
                            <p>
                                You may terminate these Terms at any time by closing your
                                account and ceasing all use of the platform. However, you
                                remain responsible for any outstanding obligations, including
                                payments for ongoing or completed projects.
                            </p>
                            <p>
                                GigFlow reserves the right to suspend or terminate your
                                account at our discretion, without notice, if we believe you
                                have violated these Terms or engaged in conduct detrimental to
                                the platform or other users.
                            </p>
                        </Section>
                    </article>
                </div>
            </div>
        </main>
    );
}