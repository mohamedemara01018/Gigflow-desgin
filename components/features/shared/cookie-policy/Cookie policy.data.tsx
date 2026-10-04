export interface TocItem {
    id: string;
    number: number;
    label: string;
}

export const TOC_ITEMS: TocItem[] = [
    { id: "introduction", number: 1, label: "Introduction & Corporate Commitment" },
    { id: "what-are-cookies", number: 2, label: "What Are Cookies & Terminal Storage" },
    { id: "categories", number: 3, label: "Categories of Cookies We Use" },
    { id: "inventory", number: 4, label: "Detailed Cookie Inventory & Retention" },
    { id: "third-parties", number: 5, label: "Third-Party Providers & Subprocessors" },
    { id: "escrow-kyc", number: 6, label: "Escrow & KYC Verification Tracking" },
    { id: "user-rights", number: 7, label: "User Rights & How to Control Cookies" },
    { id: "regulatory", number: 8, label: "Global Regulatory Frameworks" },
    { id: "revision-log", number: 9, label: "Policy Updates & Revision Log" },
    { id: "contact-dpo", number: 10, label: "Contact Privacy & Data Protection Officer" },
];

export interface CookiePreferenceCategory {
    id: string;
    title: string;
    description: string;
    locked?: boolean;
    defaultOn: boolean;
}

export const PREFERENCE_CATEGORIES: CookiePreferenceCategory[] = [
    {
        id: "strictly-necessary",
        title: "Strictly Necessary",
        description: "Required for core session, authentication, and escrow security. Cannot be disabled.",
        locked: true,
        defaultOn: true,
    },
    {
        id: "functional-ui",
        title: "Functional & UI",
        description: "Remembers theme, language, and dashboard layout preferences across visits.",
        defaultOn: true,
    },
    {
        id: "telemetry-vitals",
        title: "Telemetry & Vitals",
        description: "Anonymized performance diagnostics for Core Web Vitals and error monitoring.",
        defaultOn: true,
    },
    {
        id: "partner-attribution",
        title: "Partner & Attribution",
        description: "Allows approved partners to measure campaign attribution off-platform.",
        defaultOn: false,
    },
];

export interface StorageMechanismCard {
    title: string;
    description: string;
}

export const STORAGE_MECHANISMS: StorageMechanismCard[] = [
    {
        title: "HTTP & Secure Cookies",
        description: "Small signed tokens sent with every request to authenticate sessions and prevent CSRF attacks.",
    },
    {
        title: "HTML5 Web Storage",
        description: "Browser-local key/value storage used for interface preferences and draft form data.",
    },
    {
        title: "IndexedDB Client Caches",
        description: "Structured client-side caches for offline contract drafts and attachment metadata.",
    },
    {
        title: "Telemetry Pixels & Beacons",
        description: "Lightweight network beacons used to measure page load performance and error rates.",
    },
];

export interface CookieCategoryRow {
    id: string;
    title: string;
    description: string;
    count: number;
}

export const COOKIE_CATEGORY_ROWS: CookieCategoryRow[] = [
    {
        id: "cat-1",
        title: "Category 1: Strictly Necessary (Essential Site Function)",
        description: "Session integrity, authentication tokens, load balancing, and fraud prevention.",
        count: 6,
    },
    {
        id: "cat-2",
        title: "Category 2: Functional Experience Enhancement",
        description: "Theme, language, currency, and saved dashboard layout preferences.",
        count: 4,
    },
    {
        id: "cat-3",
        title: "Category 3: Performance, Diagnostics & Telemetry",
        description: "Core Web Vitals, error tracing, and anonymized usage pattern analysis.",
        count: 5,
    },
    {
        id: "cat-4",
        title: "Category 4: Marketing, Attribution & Partner Cookies",
        description: "Campaign attribution shared with approved marketing and referral partners.",
        count: 3,
    },
];

export interface CookieInventoryRow {
    name: string;
    provider: string;
    classification: "Strictly Necessary" | "Functional" | "Telemetry" | "Partner & Attribution";
    purpose: string;
    retention: string;
}

export const COOKIE_INVENTORY: CookieInventoryRow[] = [
    {
        name: "_gf_session",
        provider: "gigflow.com",
        classification: "Strictly Necessary",
        purpose: "Maintains an authenticated session across page navigations.",
        retention: "Session",
    },
    {
        name: "_gf_csrf_token",
        provider: "gigflow.com",
        classification: "Strictly Necessary",
        purpose: "Validates form submissions to prevent cross-site request forgery.",
        retention: "Session",
    },
    {
        name: "gf_pref_currency",
        provider: "gigflow.com",
        classification: "Functional",
        purpose: "Remembers the selected display currency for budgets and bids.",
        retention: "1 Year",
    },
    {
        name: "gf_perf_vital_id",
        provider: "gigflow.com",
        classification: "Telemetry",
        purpose: "Anonymized identifier used to group Core Web Vitals samples.",
        retention: "30 Days",
    },
    {
        name: "_ga / _gid",
        provider: "google.com",
        classification: "Partner & Attribution",
        purpose: "Aggregated campaign attribution for approved marketing partners.",
        retention: "13 Months",
    },
];

export interface ProviderCard {
    name: string;
    category: string;
    description: string;
}

export const THIRD_PARTY_PROVIDERS: ProviderCard[] = [
    {
        name: "Stripe Payments Europe",
        category: "Payment Processing",
        description: "Processes milestone payouts and stores fraud-prevention cookies during checkout flows.",
    },
    {
        name: "Cloudflare, Inc.",
        category: "Edge Security & CDN",
        description: "Provides bot mitigation, rate limiting, and DDoS protection at the network edge.",
    },
    {
        name: "PostHog Analytics",
        category: "Product Analytics",
        description: "Collects anonymized interaction events used to improve the proposal workflow.",
    },
    {
        name: "Datadog Real User Monitor",
        category: "Performance Monitoring",
        description: "Captures frontend error traces and page load timing for reliability engineering.",
    },
];

export interface RevisionLogRow {
    version: string;
    date: string;
    summary: string;
    current?: boolean;
}

export const REVISION_LOG: RevisionLogRow[] = [
    {
        version: "4.2",
        date: "May 14, 2024",
        summary: "Added Partner & Attribution category and updated third-party subprocessor list.",
        current: true,
    },
    {
        version: "4.1",
        date: "Feb 2, 2024",
        summary: "Clarified retention periods for escrow and KYC verification session cookies.",
    },
    {
        version: "4.0",
        date: "Oct 18, 2023",
        summary: "Full rewrite aligned to GDPR, UK-GDPR, and CCPA/CPRA disclosure requirements.",
    },
];