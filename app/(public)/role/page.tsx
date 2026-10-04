'use client'
import { useState } from "react";
import { Briefcase, UserSearch, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/utils/enums.utils";

type Role = UserRole.CLIENT | UserRole.FREELANCER;

const ROLES: {
    id: Role;
    icon: typeof Briefcase;
    title: string;
    description: string;
    points: string[];
}[] = [
        {
            id: UserRole.CLIENT,
            icon: Briefcase,
            title: "I want to hire talent",
            description:
                "Access a global network of vetted professionals, manage projects with precision, and scale your business faster.",
            points: [
                "Post jobs and receive tailored proposals",
                "Secure escrow-based payment system",
            ],
        },
        {
            id: UserRole.FREELANCER,
            icon: UserSearch,
            title: "I want to work",
            description:
                "Find high-quality projects, build your professional portfolio, and enjoy the freedom of independent work.",
            points: [
                "Apply to premium gigs from top companies",
                "Build long-term professional relationships",
            ],
        },
    ];

export default function JoinSelection() {
    const [selected, setSelected] = useState<Role | null>(null);

    return (
        <main className="bg-surface px-6 py-16">
            <div className="mx-auto max-w-220 text-center">
                <h1 className="text-display-lg text-on-surface">
                    Join as a client or freelancer
                </h1>
                <p className="text-body-lg text-on-surface-variant mt-4">
                    Select how you&apos;d like to use the GigFlow platform to start your
                    journey.
                </p>

                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {ROLES.map(({ id, icon: Icon, title, description, points }) => {
                        const isSelected = selected === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelected(id)}
                                aria-pressed={isSelected}
                                className={`card text-left flex flex-col ${isSelected ? "border-primary shadow-(--shadow-level-3)" : ""
                                    }`}
                                style={{
                                    backgroundColor: isSelected ? "var(--color-surface-variant)" : "",
                                }}
                            >
                                <span className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full">
                                    <Icon size={28} strokeWidth={2} />
                                </span>

                                <h2 className="text-headline-md text-on-surface mt-6">
                                    {title}
                                </h2>

                                <p className="text-body-md text-on-surface-variant mt-3">
                                    {description}
                                </p>

                                <ul className="mt-5 flex flex-col gap-3">
                                    {points.map((point) => (
                                        <li
                                            key={point}
                                            className="text-body-sm text-on-surface flex items-start gap-2"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className="text-primary mt-0.5 shrink-0"
                                            />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        );
                    })}
                </div>

                <div className=" flex items-center justify-center">
                    <Link
                        href={`/register?role=${selected}`}
                        type="button"
                        className={`disabled:${!selected} block w-fit  text-label-md mt-10 rounded-full px-10 py-3.5 transition-colors duration-200 ${selected
                            ? "bg-primary text-on-primary"
                            : "bg-primary/50 text-on-primary cursor-not-allowed"
                            }`}
                    >
                        Create Account
                    </Link>
                </div>

                <p className="text-body-sm text-(--color-on-surface-variant) mt-4">
                    Already have an account?{" "}
                    <a
                        href="#"
                        className="text-(--color-primary) font-medium hover:underline"
                    >
                        Log in
                    </a>
                </p>
            </div>
        </main>
    );
}