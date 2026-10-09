"use client";

import UserImage from "@/components/ui/UserImage";
import { IUserListItem } from "@/services/user.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { formatDateTime } from "@/utils/functions.utils";
import {
    Briefcase,
    Building2,
    MapPin,
    Star,
    ShieldCheck,
    Plus,
    Search,
    ChevronDown,
    MoreVertical,
    Users,
    FileText,
    MessageSquare as MessageIcon,
    ArrowUpRight,
    Download,
    CreditCard,
    Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

/* ---------------------------------------------------------
   Small shared pieces
--------------------------------------------------------- */

function StatCard({
    label,
    value,
    sub,
    icon: Icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: typeof Briefcase;
}) {
    return (
        <div className="card !p-4">
            <span className="flex items-center justify-between text-label-sm text-on-surface-variant">
                {label}
                <Icon size={14} />
            </span>
            <p className="text-headline-md !text-[26px] !leading-8 text-on-surface mt-1.5">
                {value}
            </p>
            {sub && <p className="text-label-sm text-on-surface-variant mt-1">{sub}</p>}
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
    return (
        <span className={`text-label-sm px-2.5 py-1 rounded-full font-medium ${className}`}>
            {children}
        </span>
    );
}

/* ---------------------------------------------------------
   Welcome header + client profile summary
--------------------------------------------------------- */


function ClientProfileCard({ me }: { me: IUserListItem }) {
    return (
        <section className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <UserImage className="w-14 h-14" avatarUrl={String(me.avatar)} firstName={me.firstName} lastName={me.lastName} />
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-body-lg font-semibold text-on-surface">
                            {me.firstName + ' ' + me.lastName}
                        </p>
                        <Badge className="bg-primary/10 text-primary flex items-center gap-1">
                            <ShieldCheck size={11} />
                            {!!me.stripeCustomerId ? 'Payment Verified' : 'not verified'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                            <Building2 size={13} />
                            Aura Technologies Inc.
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {me.city + ', ' + me.country}
                        </span>
                        <span>Member since {formatDateTime(String(me.createdAt)).date}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                    <p className="text-headline-md text-[20px]! leading-7! text-on-surface">18</p>
                    <p className="text-label-sm text-on-surface-variant">Jobs Posted</p>
                </div>
                <div className="text-center">
                    <p className="text-headline-md !text-[20px] !leading-7 text-primary">14</p>
                    <p className="text-label-sm text-on-surface-variant">Completed</p>
                </div>
                <div className="text-center">
                    <p className="text-headline-md !text-[20px] !leading-7 text-on-surface">$148.2k</p>
                    <p className="text-label-sm text-on-surface-variant">Total Spent</p>
                </div>
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-headline-md !text-[20px] !leading-7 text-on-surface">
                        4.95 <Star size={14} className="text-primary fill-primary" />
                    </p>
                    <p className="text-label-sm text-on-surface-variant">Rating Given</p>
                </div>
            </div>
        </section>
    );
}

/* ---------------------------------------------------------
   Quick actions
--------------------------------------------------------- */

function QuickActions() {

    const actions = [
        { label: "Post a New Job", icon: Plus, primary: true, href: "/client/jobs/create" },
        { label: "View My Jobs", icon: Briefcase, href: "/client/jobs" },
        {
            label: `View Contracts`,
            icon: ShieldCheck,
            href: "/contracts",
        },
    ];

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                Quick Action:
            </span>
            {actions.map(({ label, icon: Icon, primary, href }) => (
                <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-2 text-label-md rounded-md px-4 py-2 transition-colors ${primary
                        ? "bg-primary text-on-primary hover:opacity-90"
                        : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                        }`}
                >
                    <Icon size={15} />
                    {label}
                </Link>
            ))}
        </div>
    );
}

/* ---------------------------------------------------------
   My Jobs
--------------------------------------------------------- */

interface Job {
    id: string;
    status: "OPEN" | "IN_PROGRESS";
    category: string;
    createdAgo: string;
    expiresIn?: string;
    title: string;
    price: string;
    priceType: string;
    meta: string;
    freelancer?: { name: string; avatarUrl: string };
}

const JOBS: Job[] = [
    {
        id: "1",
        status: "OPEN",
        category: "Design & Creative",
        createdAgo: "Created 3 days ago",
        expiresIn: "Expires in 11 days",
        title: "Lead UI/UX & Design Systems Architect",
        price: "$12,000",
        priceType: "Fixed-Price · Expert Level",
        meta: "14 Proposals (4 unread) · Hires: 0/1 · Interviews: 2",
    },
    {
        id: "2",
        status: "IN_PROGRESS",
        category: "Software Development",
        createdAgo: "Created May 12",
        title: "Senior Next.js & WebGL Performance Engineer",
        price: "$95/hr",
        priceType: "Hourly (30 hrs/wk) · Expert Level",
        meta: "Active Contract (Milestone 2)",
        freelancer: {
            name: "Alex Rivera",
            avatarUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c",
        },
    },
    {
        id: "3",
        status: "OPEN",
        category: "Backend Architecture",
        createdAgo: "Posted Today",
        expiresIn: "Expires in 14 days",
        title: "Full-Stack Rust & Node.js Microservices Dev",
        price: "$80/hr",
        priceType: "Hourly · Intermediate",
        meta: "0 Proposals received · Hires: 0/1 · Instant Match enabled",
    },
];

const JOB_TABS = [
    { id: "all", label: "All", count: 6 },
    { id: "open", label: "Open", count: 3 },
    { id: "progress", label: "In Progress", count: 3 },
    { id: "draft", label: "Draft", count: 1 },
    { id: "completed", label: "Completed", count: 14 },
    { id: "closed", label: "Closed", count: 2 },
];

function JobCard({ job }: { job: Job }) {
    return (
        <div className="border border-outline-variant rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                        className={
                            job.status === "OPEN"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/15 text-secondary"
                        }
                    >
                        {job.status === "OPEN" ? "OPEN" : "IN PROGRESS"}
                    </Badge>
                    <span className="text-body-sm text-on-surface-variant">
                        {job.category} · {job.createdAgo}
                    </span>
                    {job.expiresIn && (
                        <span className="text-body-sm text-error">{job.expiresIn}</span>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <p className="text-body-lg font-semibold text-on-surface">{job.price}</p>
                    <p className="text-label-sm text-on-surface-variant">{job.priceType}</p>
                </div>
            </div>

            <p className="text-body-lg font-semibold text-on-surface mt-2">{job.title}</p>

            <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                {job.freelancer ? (
                    <div className="flex items-center gap-2">
                        <img
                            src={job.freelancer.avatarUrl}
                            alt={job.freelancer.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-body-sm text-on-surface-variant">
                            Contracted to {job.freelancer.name} (Hired: 1/1)
                        </span>
                    </div>
                ) : (
                    <span className="text-body-sm text-on-surface-variant">{job.meta}</span>
                )}

                <div className="flex items-center gap-2">
                    {job.status === "OPEN" ? (
                        <>
                            <button className="bg-primary text-on-primary text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity">
                                View Proposals
                            </button>
                            <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                                View Job
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                                View Contract
                            </button>
                            <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                                Message Talent
                            </button>
                        </>
                    )}
                    <button
                        aria-label="More options"
                        className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function MyJobsPanel() {
    const [activeTab, setActiveTab] = useState("all");
    const [query, setQuery] = useState("");

    return (
        <section className="card">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="flex items-center gap-2 text-headline-md text-on-surface">
                    My Jobs
                    <Badge className="bg-primary/10 text-primary">6 Active</Badge>
                </span>
            </div>
            <div className="flex flex-col gap-3 mt-4">
                {JOBS.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </section>
    );
}

/* ---------------------------------------------------------
   Recent Proposals
--------------------------------------------------------- */

interface Proposal {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    jss: number;
    postedAgo: string;
    status?: "Shortlisted" | "Under Review";
    bidAmount: string;
    duration: string;
    tags: string[];
}

const PROPOSALS: Proposal[] = [
    {
        id: "1",
        name: "Alex Rivera",
        title: "Senior Full-Stack & UI Architect",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c",
        rating: 4.99,
        reviewCount: 42,
        jss: 98,
        postedAgo: "2h ago",
        status: "Under Review",
        bidAmount: "$95/hr",
        duration: "4-6 weeks",
        tags: ["React", "Next.js", "WebGL", "Tailwind"],
    },
    {
        id: "2",
        name: "Elena Rostova",
        title: "Principal Design Systems Architect",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA-jYpvrrKHWq6QH0bEtD4yMSO5a8vX04LmXrNWNHQLXqiFjY4bQpqBti1DQGRg6OCFZCgtDViQabvIiy-spv4XaT8x35xqJPgwXdTGmvZ1vUsKTM8Kv2FOC3Ip4JtN8yX-6Nm_eOvunzubqcns7VCDZR9FiOPRVLwqhMZDvQQMOAN2JRoRLa5v3OwNMwQ-hg9qP0Pf96pYto8xQ6rO1hlPnP6XY-YJgKAXdouE4FACRvBUOmK7s2moHdeSvRkFrWfCXBPzD0kRjKM",
        rating: 5.0,
        reviewCount: 38,
        jss: 100,
        postedAgo: "5h ago",
        status: "Shortlisted",
        bidAmount: "$11,500",
        duration: "3 weeks",
        tags: ["Figma", "Design Tokens", "Fintech UX"],
    },
];

function ProposalCard({ proposal }: { proposal: Proposal }) {
    return (
        <div className="border border-outline-variant rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={proposal.avatarUrl}
                        alt={proposal.name}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-body-md font-semibold text-on-surface">
                            {proposal.name}
                        </p>
                        <p className="text-label-sm text-on-surface-variant">{proposal.title}</p>
                    </div>
                </div>
                {proposal.status && (
                    <Badge
                        className={
                            proposal.status === "Shortlisted"
                                ? "bg-tertiary/10 text-tertiary"
                                : "bg-surface-container-high text-on-surface-variant"
                        }
                    >
                        {proposal.status}
                    </Badge>
                )}
            </div>

            <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mt-2">
                <span className="flex items-center gap-1 text-on-surface">
                    <Star size={11} className="text-primary fill-primary" />
                    {proposal.rating.toFixed(2)} ({proposal.reviewCount})
                </span>
                <Badge className="bg-primary/10 text-primary">{proposal.jss}% JSS</Badge>
                <span>{proposal.postedAgo}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                    <p className="text-label-sm text-on-surface-variant">Bid Amount</p>
                    <p className="text-body-md font-semibold text-on-surface">
                        {proposal.bidAmount}
                    </p>
                </div>
                <div>
                    <p className="text-label-sm text-on-surface-variant">Est. Duration</p>
                    <p className="text-body-md font-semibold text-on-surface">
                        {proposal.duration}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {proposal.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 bg-primary text-on-primary text-label-md rounded-md py-2 hover:opacity-90 transition-opacity">
                    Hire Talent
                </button>
                {proposal.status === "Under Review" ? (
                    <>
                        <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-3 py-2 hover:bg-surface-container-highest transition-colors">
                            Shortlist
                        </button>
                        <button
                            aria-label="Message"
                            className="w-9 h-9 rounded-md flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                        >
                            <MessageIcon size={15} />
                        </button>
                    </>
                ) : (
                    <>
                        <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-3 py-2 hover:bg-surface-container-highest transition-colors">
                            Message
                        </button>
                        <button
                            aria-label="Dismiss"
                            className="w-9 h-9 rounded-md flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                        >
                            ×
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function RecentProposalsPanel() {
    return (
        <section className="card">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-headline-md text-on-surface">
                    Recent Proposals
                    <Badge className="bg-surface-container-high text-on-surface-variant">
                        23 Total
                    </Badge>
                </span>
                <button className="text-label-md text-primary hover:underline">
                    View All (23)
                </button>
            </div>

            <div className="grid sm:grid-cols-1 gap-4 mt-4">
                {PROPOSALS.map((p) => (
                    <ProposalCard key={p.id} proposal={p} />
                ))}
            </div>
        </section>
    );
}

/* ---------------------------------------------------------
   Active Contracts
--------------------------------------------------------- */

function ActiveContractsPanel() {
    return (
        <section className="card">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-headline-md text-on-surface">
                    Active Contracts
                    <Badge className="bg-primary/10 text-primary">4 Ongoing</Badge>
                </span>
                <button className="flex items-center gap-1 text-label-md text-primary hover:underline">
                    Manage All Contracts
                    <ArrowUpRight size={14} />
                </button>
            </div>

            <div className="border border-outline-variant rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c"
                            alt="Alex Rivera"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-body-md font-semibold text-on-surface">
                                    Alex Rivera
                                </p>
                                <Badge className="bg-primary/10 text-primary">ACTIVE</Badge>
                            </div>
                            <p className="text-label-sm text-on-surface-variant">
                                Senior Next.js &amp; WebGL Performance Engineer
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-label-sm text-on-surface-variant">
                        <div>
                            <p>Contract Terms</p>
                            <p className="text-body-sm text-on-surface font-medium">
                                $95/hr (30 hrs/wk)
                            </p>
                        </div>
                        <div>
                            <p>Agreed Max</p>
                            <p className="text-body-sm text-on-surface font-medium">$11,400</p>
                        </div>
                        <div>
                            <p>Exp. Completion</p>
                            <p className="text-body-sm text-on-surface font-medium">
                                Jun 30, 2024
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between text-body-sm">
                        <span className="text-on-surface-variant">
                            Current: Phase 2 - Offscreen WebGL Canvas Optimization
                        </span>
                        <span className="text-primary font-medium">68% Complete</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
                    </div>
                    <div className="flex items-center justify-between text-label-sm text-on-surface-variant mt-1.5">
                        <span>Started: Apr 15, 2024</span>
                        <span className="text-error">Milestone due in 4 days</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity">
                            <CreditCard size={15} />
                            Submit Payment ($2,850)
                        </button>
                        <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                            View Milestones
                        </button>
                        <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                            Message Freelancer
                        </button>
                    </div>
                    <button className="text-label-md text-error hover:underline">
                        End Contract
                    </button>
                </div>
            </div>
        </section>
    );
}




/* ---------------------------------------------------------
    Page
--------------------------------------------------------- */

export default function ClientPage() {
    const { me } = useSelector(selectMeSlice);
    return (
        <div className="wrapper py-6 flex flex-col gap-6">
            <ClientProfileCard me={me as IUserListItem} />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <StatCard label="Active Jobs" value="6" sub="+2 this month" icon={Briefcase} />
                <StatCard label="Open Jobs" value="3" sub="Receiving bids" icon={FileText} />
                <StatCard label="In Progress" value="3" sub="Activity works" icon={ShieldCheck} />
                <StatCard label="Completed" value="14" sub="100% on budget" icon={ShieldCheck} />
                <StatCard label="Total Spent" value="$148.2k" sub="$18.4k in Q2" icon={CreditCard} />
                <StatCard label="Contracts" value="4" sub="$34,500 active" icon={FileText} />
                <StatCard label="Proposals" value="23" sub="8 unreviewed" icon={FileText} />
            </div>

            <QuickActions />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
                <div className="flex flex-col gap-6">
                    <MyJobsPanel />
                    <ActiveContractsPanel />
                </div>

                <aside className="flex flex-col gap-6">
                    <RecentProposalsPanel />
                </aside>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 bg-surface-container-low rounded-lg p-4">
                <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <Info size={15} className="text-primary" />
                    New Organization View Preview — view how Aura Technologies onboarding
                    view appears when posting a first contract.
                </span>
                <button className="text-label-md text-on-surface hover:text-primary transition-colors">
                    Toggle Empty State Mockup
                </button>
            </div>
        </div>
    );
}