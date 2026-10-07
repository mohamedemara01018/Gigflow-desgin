"use client";

import {
    Download,
    Plus,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Wallet,
    Lock,
    Bell,
    CheckCircle2,
    Calendar,
    ShieldCheck,
    MessageSquare,
    History,
    Briefcase,
    FileText,
    ExternalLink,
    Info,
    Eye,
    XCircle,
    Trash2,
    Copy,
    Send,
    Settings2,
    RefreshCw,
    Star,
    ArrowRight,
    Banknote,
    AlertTriangle,
    User,
    LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type ContractStatus = "active" | "pending" | "draft" | "completed";

interface Contract {
    id: string;
    code: string;
    status: ContractStatus;
    type: "Fixed-Price Escrow" | "Milestone Contract";
    title: string;
    description: string;
    amountLabel: string;
    amount: number;
    dates?: string;
    notice?: { text: string; tone: "error" | "neutral" };
    freelancer: { name: string; sub: string; avatarUrl?: string; verified?: boolean; initials?: string };
    job: { title: string; category: string; icon: LucideIcon };
    proposal: { line1: string; line2: string };
    milestone?: {
        label: string;
        quote: string;
        funded: number;
        total: number;
        filledSegments: number;
        totalSegments: number;
        remaining: number;
    };
    offerNote?: { text: string; action: string };
    feedback?: string;
}

const AVATAR =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c";

const CONTRACTS: Contract[] = [
    {
        id: "1",
        code: "#CT-8891",
        status: "active",
        type: "Fixed-Price Escrow",
        title: "Lead UI/UX & Design Systems Architect - Production Scale Design System & WebGL Tokens",
        description:
            "End-to-end Figma tokenization, sync with Tailwind CSS tokens engine, comprehensive Storybook UI component kit, and high-performance WebGL canvas integration documentation.",
        amountLabel: "Total Contract Value",
        amount: 11500,
        dates: "Apr 10, 2025 – May 30, 2025",
        freelancer: { name: "Alex Rivera", sub: "Top Rated Plus · 100% JSS", avatarUrl: AVATAR, verified: true },
        job: { title: "Design Systems Lead (SaaS)", category: "Category: Design & Creative", icon: Briefcase },
        proposal: { line1: "Bid: $11,500 (3 Milestones)", line2: "Submitted: Apr 08, 2025" },
        milestone: {
            label: "Milestone 1 of 3 In Progress",
            quote: '"Design Token Core Architecture"',
            funded: 3500,
            total: 11500,
            filledSegments: 1,
            totalSegments: 3,
            remaining: 8000,
        },
    },
    {
        id: "2",
        code: "#CT-8892",
        status: "pending",
        type: "Fixed-Price Escrow",
        title: "Next.js 15 Fullstack SaaS Architecture & Stripe Billing Engine Integration",
        description:
            "Server Actions migration, multi-tenant Postgres schema with Supabase RLS, recurring subscription lifecycle management, and webhooks error-recovery worker.",
        amountLabel: "Offered Budget",
        amount: 8200,
        notice: { text: "Awaiting Freelancer Signature · Expires in 48h", tone: "error" },
        freelancer: { name: "Sarah Lin", sub: "Top Rated · 99% JSS", avatarUrl: AVATAR },
        job: { title: "Senior Next.js Architect", category: "Category: Web & Software Dev", icon: Briefcase },
        proposal: { line1: "Bid: $8,200 (2 Milestones)", line2: "Offer Sent: Yesterday" },
        offerNote: {
            text: "Contract offer sent to Sarah Lin. Initial deposit of $4,100.00 will be debited to Escrow automatically once the offer is accepted.",
            action: "Modify Offer",
        },
    },
    {
        id: "3",
        code: "#CT-8895",
        status: "draft",
        type: "Milestone Contract",
        title: "AI Voice Agents & Realtime WebRTC Pipeline Development",
        description:
            "Sub-500ms voice pipeline using Deepgram Nova-2, Cartesia Sonic TTS, and OpenAI GPT-4o mini with fallback Twilio bridge.",
        amountLabel: "Draft Amount",
        amount: 5400,
        notice: { text: "Requires min 1 milestone before sending", tone: "error" },
        freelancer: { name: "Marcus Thorne", sub: "AI & Audio Engineer", initials: "MT" },
        job: { title: "Voice AI Pipeline Architect", category: "Category: AI & Machine Learning", icon: Briefcase },
        proposal: { line1: "Bid: $5,400.00", line2: "Shortlisted Applicant" },
    },
    {
        id: "4",
        code: "#CT-8870",
        status: "completed",
        type: "Fixed-Price Escrow",
        title: "Enterprise Design System Tokens, Dark Mode Matrix & Figma Plugin",
        description:
            "Delivered 84 design token primitives, automatic semantic color maps, token translation CLI pipeline, and a production Figma sync plugin.",
        amountLabel: "Total Paid Out",
        amount: 14200,
        dates: "Finished Mar 28, 2025 · 5.0 Star Feedback",
        freelancer: { name: "Julian Rivera", sub: "Top Rated Plus · 100% JSS", avatarUrl: AVATAR },
        job: { title: "Design Tokens Architect", category: "Category: Design & Creative", icon: Briefcase },
        proposal: { line1: "All 4 Milestones Released", line2: "Completed Mar 28, 2025" },
        feedback: 'Client Feedback: 5.0 ("Exceptional mastery")',
    },
];

const TABS = [
    { id: "all", label: "All", count: 14 },
    { id: "active", label: "Active", count: 5 },
    { id: "pending", label: "Pending Review", count: 2 },
    { id: "draft", label: "Draft", count: 2 },
    { id: "completed", label: "Completed", count: 4 },
    { id: "cancelled", label: "Cancelled / Rejected", count: 1 },
];

const STATUS_CONFIG: Record<
    ContractStatus,
    { label: string; badge: string; accent: string; icon: LucideIcon }
> = {
    active: { label: "Active", badge: "bg-primary/10 text-primary", accent: "border-primary", icon: CheckCircle2 },
    pending: { label: "Pending Review", badge: "bg-secondary/15 text-secondary", accent: "border-secondary", icon: Info },
    draft: { label: "Draft (Unsent)", badge: "bg-surface-container-high text-on-surface-variant", accent: "border-outline", icon: FileText },
    completed: { label: "Completed", badge: "bg-primary/10 text-primary", accent: "border-primary/50", icon: CheckCircle2 },
};

function KpiCard({
    label,
    value,
    meta,
    icon: Icon,
    progress,
    tone = "primary",
    metaTone = "primary",
}: {
    label: string;
    value: string;
    meta: string;
    icon: LucideIcon;
    progress: number;
    tone?: "primary" | "tertiary";
    metaTone?: "primary" | "muted";
}) {
    const bar = tone === "tertiary" ? "bg-tertiary" : "bg-primary";
    return (
        <div className="card !p-5">
            <span className="flex items-center justify-between text-body-sm text-on-surface-variant">
                {label}
                <Icon size={16} className={tone === "tertiary" ? "text-tertiary" : "text-primary"} />
            </span>
            <div className="flex items-end justify-between mt-2 gap-3">
                <p
                    className={`text-headline-lg !text-[28px] !leading-9 ${tone === "tertiary" ? "text-tertiary" : "text-on-surface"
                        }`}
                >
                    {value}
                </p>
                <span
                    className={`text-label-sm pb-1 ${metaTone === "primary" ? "text-primary" : "text-on-surface-variant"
                        }`}
                >
                    {meta}
                </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container-high mt-3 overflow-hidden">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

function Ghost({
    icon: Icon,
    children,
    danger,
}: {
    icon?: LucideIcon;
    children: React.ReactNode;
    danger?: boolean;
}) {
    return (
        <button
            className={`flex items-center gap-1.5 text-label-md rounded-md px-3.5 py-2 transition-colors ${danger
                    ? "bg-error/10 text-error hover:bg-error/15"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
        >
            {Icon && <Icon size={13} />}
            {children}
        </button>
    );
}

function Primary({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
    return (
        <button className="flex items-center gap-1.5 bg-primary text-on-primary text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity">
            {children}
            {Icon && <Icon size={13} />}
        </button>
    );
}

function InfoCell({
    leading,
    title,
    sub,
    trailing,
    TrailingIcon,
}: {
    leading: React.ReactNode;
    title: React.ReactNode;
    sub: string;
    trailing: string;
    TrailingIcon: LucideIcon;
}) {
    return (
        <div className="flex items-center justify-between gap-3 bg-surface-container-lowest rounded-md px-3.5 py-3">
            <div className="flex items-center gap-3 min-w-0">
                {leading}
                <div className="min-w-0">
                    <p className="text-body-sm font-medium text-on-surface truncate">{title}</p>
                    <p className="text-label-sm text-on-surface-variant truncate">{sub}</p>
                </div>
            </div>
            <button className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary shrink-0 transition-colors">
                <TrailingIcon size={12} />
                {trailing}
            </button>
        </div>
    );
}

function ContractCard({ c }: { c: Contract }) {
    const cfg = STATUS_CONFIG[c.status];
    const StatusIcon = cfg.icon;
    const JobIcon = c.job.icon;

    return (
        <article className={`card !p-0 overflow-hidden border-l-4 ${cfg.accent}`}>
            <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`flex items-center gap-1.5 text-label-sm px-2.5 py-1 rounded-full ${cfg.badge}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                        </span>
                        <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-md">
                            {c.type} · {c.code}
                        </span>
                        {c.notice && (
                            <span
                                className={`flex items-center gap-1.5 text-label-sm ${c.notice.tone === "error" ? "text-error" : "text-on-surface-variant"
                                    }`}
                            >
                                <AlertTriangle size={12} />
                                {c.notice.text}
                            </span>
                        )}
                        {c.dates && (
                            <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                                <Calendar size={12} />
                                {c.dates}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-label-sm text-on-surface-variant">{c.amountLabel}</p>
                        <p className="text-headline-md text-on-surface">
                            ${c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <h3 className="text-headline-md !text-[22px] !leading-7 text-on-surface mt-3">{c.title}</h3>
                <p className="text-body-sm text-on-surface-variant mt-1.5">{c.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 bg-surface-container-low rounded-lg p-3 mt-4">
                    <InfoCell
                        leading={
                            c.freelancer.avatarUrl ? (
                                <img
                                    src={c.freelancer.avatarUrl}
                                    alt={c.freelancer.name}
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <span className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-label-md font-semibold shrink-0">
                                    {c.freelancer.initials}
                                </span>
                            )
                        }
                        title={
                            <span className="flex items-center gap-1">
                                {c.freelancer.name}
                                {c.freelancer.verified && <ShieldCheck size={12} className="text-primary" />}
                            </span>
                        }
                        sub={c.freelancer.sub}
                        trailing="Profile"
                        TrailingIcon={User}
                    />
                    <InfoCell
                        leading={
                            <span className="w-10 h-10 rounded-md bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                                <JobIcon size={16} />
                            </span>
                        }
                        title={c.job.title}
                        sub={c.job.category}
                        trailing="Job"
                        TrailingIcon={ExternalLink}
                    />
                    <InfoCell
                        leading={
                            <span className="w-10 h-10 rounded-md bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                <FileText size={16} />
                            </span>
                        }
                        title={c.proposal.line1}
                        sub={c.proposal.line2}
                        trailing="Proposal"
                        TrailingIcon={FileText}
                    />
                </div>

                {c.milestone && (
                    <div className="mt-5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="flex items-center gap-2 text-body-sm font-medium text-on-surface">
                                <Lock size={13} className="text-primary" />
                                {c.milestone.label}
                                <span className="text-label-sm text-on-surface-variant font-normal">
                                    · {c.milestone.quote}
                                </span>
                            </span>
                            <span className="text-body-sm font-semibold text-primary">
                                ${c.milestone.funded.toLocaleString(undefined, { minimumFractionDigits: 2 })} Escrow Funded
                            </span>
                        </div>
                        <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: `repeat(${c.milestone.totalSegments}, 1fr)` }}>
                            {Array.from({ length: c.milestone.totalSegments }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-1.5 rounded-full ${i < c.milestone!.filledSegments ? "bg-primary" : "bg-surface-container-high"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-label-sm text-on-surface-variant mt-1.5">
                            <span>
                                Escrow Funded: ${c.milestone.funded.toLocaleString(undefined, { minimumFractionDigits: 2 })} (
                                {Math.round((c.milestone.funded / c.milestone.total) * 100)}%)
                            </span>
                            <span>Remaining to fund: ${c.milestone.remaining.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {c.offerNote && (
                    <div className="flex items-center justify-between gap-3 bg-secondary/10 rounded-md px-4 py-3 mt-5">
                        <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                            <Info size={14} className="text-secondary shrink-0" />
                            {c.offerNote.text}
                        </span>
                        <button className="text-label-md text-on-surface hover:text-primary shrink-0 transition-colors">
                            {c.offerNote.action}
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-3 mt-5">
                    {c.status === "active" && (
                        <>
                            <div className="flex items-center gap-2">
                                <Ghost icon={MessageSquare}>Message Freelancer</Ghost>
                                <Ghost icon={History}>Activity Log</Ghost>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ghost icon={Banknote}>Release Current Milestone</Ghost>
                                <Primary icon={ArrowRight}>View Contract Details</Primary>
                            </div>
                        </>
                    )}
                    {c.status === "pending" && (
                        <>
                            <div className="flex items-center gap-2">
                                <Ghost icon={MessageSquare}>Message Sarah</Ghost>
                                <Ghost icon={XCircle} danger>
                                    Withdraw Offer
                                </Ghost>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ghost icon={Eye}>Review Offer Terms</Ghost>
                                <Primary icon={ArrowRight}>View Full Details</Primary>
                            </div>
                        </>
                    )}
                    {c.status === "draft" && (
                        <>
                            <div className="flex items-center gap-2">
                                <Ghost icon={Trash2} danger>
                                    Delete Draft
                                </Ghost>
                                <Ghost icon={Copy}>Duplicate</Ghost>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ghost icon={Settings2}>Configure Milestones</Ghost>
                                <Primary icon={Send}>Send to Freelancer</Primary>
                            </div>
                        </>
                    )}
                    {c.status === "completed" && (
                        <>
                            <span className="flex items-center gap-1.5 text-label-md text-primary">
                                <Star size={13} />
                                {c.feedback}
                            </span>
                            <div className="flex items-center gap-2">
                                <Ghost icon={Download}>Download Invoices (PDF)</Ghost>
                                <Ghost icon={RefreshCw}>Re-hire Freelancer</Ghost>
                                <button className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary px-2 transition-colors">
                                    View Archived Record
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function MyContractsContent() {
    const [role, setRole] = useState<"client" | "freelancer">("client");
    const [tab, setTab] = useState("all");
    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    const [freelancerFilter, setFreelancerFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    const freelancers = useMemo(
        () => Array.from(new Set(CONTRACTS.map((c) => c.freelancer.name))),
        []
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = CONTRACTS.filter((c) => {
            if (tab !== "all" && tab !== "cancelled" && c.status !== tab) return false;
            if (tab === "cancelled") return false;
            if (type !== "all" && c.type !== type) return false;
            if (freelancerFilter !== "all" && c.freelancer.name !== freelancerFilter) return false;
            if (!q) return true;
            return (
                c.title.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q) ||
                c.freelancer.name.toLowerCase().includes(q) ||
                c.job.category.toLowerCase().includes(q)
            );
        });
        return sort === "amount" ? [...list].sort((a, b) => b.amount - a.amount) : list;
    }, [tab, query, type, freelancerFilter, sort]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Client Operations Portal
                    </span>
                    <span>/</span>
                    <span className="uppercase tracking-wide">Legal &amp; Escrow</span>
                </div>

                <div className="flex items-start justify-between flex-wrap gap-4 mt-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-headline-lg text-on-surface">My Contracts</h1>
                            <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                                14 Total
                            </span>
                            <span className="text-label-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                5 Active
                            </span>
                        </div>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Manage active milestones, released escrows, review offers, and track
                            counterparty delivery pipelines.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-surface-container-low rounded-md p-1">
                            {(["client", "freelancer"] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`text-label-md px-3.5 py-1.5 rounded transition-colors ${role === r
                                            ? "bg-surface-container-lowest text-on-surface shadow-[var(--shadow-level-2)]"
                                            : "text-on-surface-variant"
                                        }`}
                                >
                                    As {r === "client" ? "Client" : "Freelancer"}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 border border-outline-variant text-on-surface text-label-md rounded-md px-4 py-2.5 hover:bg-surface-container-low transition-colors">
                            <Download size={15} />
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity">
                            <Plus size={15} />
                            Create New Contract
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard label="Total Committed" value="$38,250.00" meta="+12.4% MoM" icon={Wallet} progress={65} />
                <KpiCard label="Secured in Escrow" value="$14,700.00" meta="5 Milestones" metaTone="muted" icon={Lock} progress={38} />
                <KpiCard label="Pending Actions" value="2 Required" meta="Review offers" metaTone="muted" icon={Bell} progress={20} tone="tertiary" />
                <KpiCard label="Avg Delivery Rate" value="98.2%" meta="On-schedule" icon={CheckCircle2} progress={98} />
            </div>

            <section className="card">
                <div className="flex items-center gap-2 flex-wrap">
                    {TABS.map((t) => {
                        const isActive = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-1.5 text-body-sm px-3.5 py-2 rounded-full transition-colors ${isActive
                                        ? "bg-primary text-on-primary"
                                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                                    }`}
                            >
                                {t.label}
                                <span
                                    className={`text-label-sm px-1.5 rounded-full ${isActive
                                            ? "bg-on-primary/20"
                                            : t.id === "cancelled"
                                                ? "bg-error/10 text-error"
                                                : "bg-surface-container-highest"
                                        }`}
                                >
                                    {t.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <div className="relative flex-1 min-w-[260px]">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search contracts by title, counterparty, job ID, or skill tag..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
                        />
                    </div>

                    {[
                        {
                            value: type,
                            set: setType,
                            options: [
                                { v: "all", l: "All Types" },
                                { v: "Fixed-Price Escrow", l: "Fixed-Price Escrow" },
                                { v: "Milestone Contract", l: "Milestone Contract" },
                            ],
                        },
                        {
                            value: freelancerFilter,
                            set: setFreelancerFilter,
                            options: [
                                { v: "all", l: "All Freelancers" },
                                ...freelancers.map((f) => ({ v: f, l: f })),
                            ],
                        },
                        {
                            value: sort,
                            set: setSort,
                            options: [
                                { v: "newest", l: "Newest First" },
                                { v: "amount", l: "Highest Value" },
                            ],
                        },
                    ].map((sel, i) => (
                        <div key={i} className="relative">
                            <select
                                value={sel.value}
                                onChange={(e) => sel.set(e.target.value)}
                                className="appearance-none bg-surface-container-low border border-outline-variant rounded-md pl-3 pr-8 py-2.5 text-body-sm text-on-surface outline-none min-w-[150px]"
                            >
                                {sel.options.map((o) => (
                                    <option key={o.v} value={o.v}>
                                        {o.l}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col gap-5">
                {visible.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-body-md text-on-surface-variant">
                            No contracts match your current filters.
                        </p>
                    </div>
                ) : (
                    visible.map((c) => <ContractCard key={c.id} c={c} />)
                )}
            </div>

            <div className="card !py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
                    <span>
                        Showing <span className="font-medium text-on-surface">1 – {visible.length}</span> of{" "}
                        <span className="font-medium text-on-surface">14</span> contracts
                    </span>
                    <span className="flex items-center gap-2">
                        Rows per page:
                        <select className="bg-surface-container-low border border-outline-variant rounded px-2 py-1 text-body-sm text-on-surface outline-none">
                            <option>4</option>
                            <option>8</option>
                        </select>
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        aria-label="Previous page"
                        className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant disabled:opacity-40"
                        disabled
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {[1, 2, 3, 4].map((p) => (
                        <button
                            key={p}
                            className={`w-8 h-8 rounded-md text-body-sm font-medium transition-colors ${p === 1
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface-variant hover:bg-surface-container-low"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        aria-label="Next page"
                        className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}