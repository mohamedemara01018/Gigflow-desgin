import type { LucideIcon } from "lucide-react";
import { Mail, Users, Video, Send, Layers, Zap, MapPin } from "lucide-react";

export type JobStat = { icon: LucideIcon; label: string };

export interface OpenJobPosting {
    status: "open";
    id: string;
    category: string;
    metaText: string; // "Created 3 days ago" / "Posted Today"
    expiresLabel: string; // "Expires in 11 days"
    featured?: boolean;
    visibility: "public" | "invite-only";
    price: string;
    priceSub: string;
    title: string;
    tags: string[];
    stats: JobStat[];
    proposalsCount?: number;
}

export interface InProgressJobPosting {
    status: "in-progress";
    id: string;
    category: string;
    metaText: string; // "Created May 12"
    price: string;
    priceSub: string;
    title: string;
    contractor: {
        name: string;
        initials: string;
        details: string;
    };
    escrowLabel: string;
    footerNote: string; // "19 Total Proposals · Manual time allowed"
}

export interface DraftJobPosting {
    status: "draft";
    id: string;
    category: string;
    metaText: string; // "Saved yesterday"
    price: string;
    priceSub: string;
    title: string;
    tags: string[];
    draftInfo: string;
}

export type JobPosting = OpenJobPosting | InProgressJobPosting | DraftJobPosting;

export const JOB_TABS: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All", count: 6 },
    { id: "open", label: "Open", count: 3 },
    { id: "in-progress", label: "In Progress", count: 3 },
    { id: "draft", label: "Draft", count: 1 },
    { id: "completed", label: "Completed", count: 14 },
    { id: "closed", label: "Closed", count: 2 },
];

export const JOB_POSTINGS: JobPosting[] = [
    {
        status: "open",
        id: "job-ui-design-systems",
        category: "Design & Creative",
        metaText: "Created 3 days ago",
        expiresLabel: "Expires in 11 days",
        featured: true,
        visibility: "public",
        price: "$12,000",
        priceSub: "Fixed-Price · Expert Level",
        title: "Lead UI/UX & Design Systems Architect",
        tags: ["Figma", "Design Systems", "Token Studio"],
        proposalsCount: 4,
        stats: [
            { icon: Mail, label: "14 Proposals (4 unread)" },
            { icon: Users, label: "Hires: 0/1" },
            { icon: Video, label: "Interviews: 2" },
            { icon: Send, label: "Invites sent: 8" },
            { icon: Layers, label: "Cap: 30 proposals" },
        ],
    },
    {
        status: "in-progress",
        id: "job-nextjs-webgl",
        category: "Software Development",
        metaText: "Created May 12",
        price: "$95/hr",
        priceSub: "Hourly (30 hrs/wk) · Expert Level · 3 to 6 mos",
        title: "Senior Next.js & WebGL Performance Engineer",
        contractor: {
            name: "Alex Rivera",
            initials: "AR",
            details: "Hired: 1/1 · Milestone 2 in review · 18.5 hrs logged this week",
        },
        escrowLabel: "Payment Verified Escrow",
        footerNote: "19 Total Proposals · Manual time allowed",
    },
    {
        status: "open",
        id: "job-rust-node-microservices",
        category: "Backend Architecture",
        metaText: "Posted Today",
        expiresLabel: "Expires in 14 days",
        visibility: "public",
        price: "$80/hr",
        priceSub: "Hourly · Intermediate Level · Range $70 - $90/hr",
        title: "Full-Stack Rust & Node.js Microservices Dev",
        tags: ["Rust", "Node.js", "gRPC"],
        stats: [
            { icon: Mail, label: "0 Proposals received" },
            { icon: Users, label: "Hires: 0/1" },
            { icon: Zap, label: "Instant Match enabled" },
            { icon: MapPin, label: "Location: Worldwide" },
        ],
    },
    {
        status: "draft",
        id: "job-llm-rag-pipeline",
        category: "AI & Machine Learning",
        metaText: "Saved yesterday",
        price: "$14,000",
        priceSub: "Fixed-Price · Expert Level (Estimated)",
        title: "LLM Fine-Tuning & RAG Pipeline Architect",
        tags: ["PyTorch", "LangChain"],
        draftInfo: "Unpublished Draft · 0 Proposals · 2 Attachments saved · Ready to post",
    },
];