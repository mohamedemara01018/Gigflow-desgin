export interface ContractStat {
    label: string;
    value: string;
}

export interface ContractParty {
    role: "client" | "freelancer";
    name: string;
    initials: string;
    tierBadge: string;
    title: string;
    location: string;
    localTime: string;
    stats: ContractStat[];
    footerLeft: string;
    footerRight: string;
}

export const CONTRACT_SUMMARY = {
    badges: ["Active Contract", "Fixed-Price Escrow", "SafePay Vault Guarded"],
    title: "Lead UI/UX & Design Systems Architect",
    durationLabel: "Duration: Apr 10, 2025 - May 30, 2025",
    contractId: "CT-8891-2025-AXR",
    shortId: "CT-8891",
    statusLabel: "Milestone 1 Work Submitted · Review Required",
    unreadMessages: 3,
};

export const CLIENT_PARTY: ContractParty = {
    role: "client",
    name: "Marcus Vance",
    initials: "MV",
    tierBadge: "Enterprise Plus",
    title: "VP of Product · Aura Technologies Inc.",
    location: "San Francisco, CA",
    localTime: "09:42 AM PST",
    stats: [
        { label: "Total Spent", value: "$248.5k" },
        { label: "Hire Rate", value: "94%" },
        { label: "Active Contracts", value: "38" },
    ],
    footerLeft: "Verified Billing Method",
    footerRight: "Member since Jan 2021",
};

export const FREELANCER_PARTY: ContractParty = {
    role: "freelancer",
    name: "Alex Rivera",
    initials: "AR",
    tierBadge: "Top Rated Plus",
    title: "Senior Staff UI/UX & Design Systems Architect",
    location: "London, United Kingdom",
    localTime: "05:42 PM BST",
    stats: [
        { label: "Job Success Score", value: "100%" },
        { label: "Platform Earned", value: "$120k+" },
        { label: "Base Benchmark", value: "$145/hr" },
    ],
    footerLeft: "Identity & Tax ID Verified",
    footerRight: "eIDAS Signed",
};

export interface EscrowAllocationSegment {
    label: string;
    amount: number;
    tone: "secured" | "pending" | "planned";
}

export const ESCROW_LEDGER = {
    contractTotal: 11500,
    milestoneCount: 3,
    secured: 3500,
    securedPercent: 30.4,
    released: 0,
    releasedNote: "Pending approval of Phase 1",
    scheduled: 8000,
    scheduledNote: "Phase 2 ($4.5k) & Phase 3 ($3.5k)",
    plannedPercent: 69.6,
    feePercent: 10,
    feeAmount: 1150,
    netPayout: 10350,
    segments: [
        { label: "Secured Escrow ($3,500)", amount: 3500, tone: "secured" },
        { label: "Pending Escrow Funding ($4,500)", amount: 4500, tone: "pending" },
        { label: "Planned Future Escrow ($3,500)", amount: 3500, tone: "planned" },
    ] as EscrowAllocationSegment[],
};

export type MilestoneStatus = "submitted" | "awaiting-deposit" | "planned";

export interface MilestoneAttachment {
    name: string;
    meta?: string;
}

export interface Milestone {
    id: string;
    index: number;
    status: MilestoneStatus;
    statusLabel: string;
    secondaryBadge?: string;
    title: string;
    description: string;
    value: string;
    dueLabel: string;
    dueUrgent?: boolean;
    deliverables?: string[];
    submission?: {
        author: string;
        date: string;
        quote: string;
        attachments: MilestoneAttachment[];
    };
    fundingNote?: string;
    fundingAction?: string;
}

export const MILESTONES: Milestone[] = [
    {
        id: "m1",
        index: 1,
        status: "submitted",
        statusLabel: "Work Submitted · Review Ready",
        secondaryBadge: "$3,500.00 in Escrow",
        title: "Phase 1: Design System Audit, Core Token Architecture & Style Dictionary",
        description:
            "Initial discovery, primitive tokens, semantic color scale, typography system, and cross-platform token compilation.",
        value: "$3,500.00",
        dueLabel: "Due Apr 25, 2025 (in 5 days)",
        dueUrgent: true,
        deliverables: [
            "Comprehensive Figma UI Kit audit & component redundancy log",
            "Style Dictionary multi-platform token taxonomy (.json / CSS Variables)",
            "Automated GitHub Action pipeline exporting tokens to NPM package",
            "Figma Tokens Studio sync integration & semantic theme test document",
        ],
        submission: {
            author: "Alex Rivera",
            date: "Apr 18, 2025 at 03:22 PM",
            quote:
                "Completed core primitive and semantic tokens, with full CI build passing on Aura Design Tokens v1.0. Read the included handoff README.",
            attachments: [{ name: "tokens-v1.0-release.zip", meta: "4.2 MB" }, { name: "Figma Library Preview" }],
        },
    },
    {
        id: "m2",
        index: 2,
        status: "awaiting-deposit",
        statusLabel: "Awaiting Escrow Deposit",
        secondaryBadge: "Next in sequence",
        title: "Phase 2: Multi-Brand Component Library & React/Tailwind Prototypes",
        description: "Creation of 42 atomic components, light/dark themes, and Storybook interactive documentation.",
        value: "$4,500.00",
        dueLabel: "Due May 12, 2025",
        fundingNote: "Funds will be deposited into the SafePay escrow vault and locked prior to work start.",
        fundingAction: "Pre-fund Milestone 2 ($4,500.00)",
    },
    {
        id: "m3",
        index: 3,
        status: "planned",
        statusLabel: "Planned Phase",
        title: "Phase 3: WebGL Token Integrations, Documentation & Engineering Handoff",
        description: "Full developer documentation, React component release, and final QA verification sessions.",
        value: "$3,500.00",
        dueLabel: "Due May 30, 2025",
    },
];

export interface AuditEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    done: boolean;
}

export const AUDIT_TRAIL: AuditEvent[] = [
    {
        id: "a1",
        title: "Work Submitted for Milestone 1",
        date: "Apr 18, 2025 · 15:22 UTC",
        description:
            "Freelancer Alex Rivera submitted work deliverables with attachment tokens-v1.0-release.zip. Client notified.",
        done: true,
    },
    {
        id: "a2",
        title: "Contract Accepted by Alex Rivera",
        date: "Apr 10, 2025 · 08:44 UTC",
        description: "eIDAS verified digital signature recorded. Milestone 1 work period officially commenced.",
        done: true,
    },
    {
        id: "a3",
        title: "Contract Offer Sent to Alex Rivera",
        date: "Apr 09, 2025 · 18:10 UTC",
        description: "Client Marcus Vance sent formal offer agreement matching accepted proposal terms.",
        done: true,
    },
    {
        id: "a4",
        title: "Milestone 1 Escrow Deposit Funded ($3,500.00)",
        date: "Apr 09, 2025 · 18:05 UTC",
        description: "Payment via Aura Technologies corporate account verified by SafePay Escrow Vault.",
        done: true,
    },
    {
        id: "a5",
        title: "Contract Draft Created",
        date: "Apr 08, 2025 · 21:15 UTC",
        description: "Initiated by Marcus Vance following interview rounds and scope consensus.",
        done: false,
    },
];

export const AUDIT_HASH = "7f8b91a2…c4e9182b54";

export interface GovernanceTerm {
    title: string;
    description: string;
}

export const GOVERNANCE_TERMS: GovernanceTerm[] = [
    {
        title: "Full IP Transfer on Release",
        description:
            "All custom design tokens, code, and documentation transfer unconditionally to client immediately upon milestone escrow release.",
    },
    {
        title: "36-Month Mutual NDA Active",
        description:
            "Both parties are bound by the standard GigFlow Master Confidentiality Agreement protecting proprietary code & roadmaps.",
    },
    {
        title: "SafePay 14-Day Dispute Arbitration",
        description:
            "Unresolved disputes are subject to binding GigFlow mediation before funds can be reversed or forfeited.",
    },
];

export interface ExecutedDocument {
    name: string;
    meta: string;
    kind: "pdf" | "json";
}

export const EXECUTED_DOCUMENTS: ExecutedDocument[] = [
    { name: "Master_Services_Agreement_CT8891.pdf", meta: "eSigned by Vance & Rivera · 1.8 MB", kind: "pdf" },
    { name: "Scope_Statement_Token_System_v1.pdf", meta: "Attached to Job Proposal · 840 KB", kind: "pdf" },
    { name: "Cryptographic_Audit_Certificate.json", meta: "Valid eIDAS hash snapshot · 12 KB", kind: "json" },
];
