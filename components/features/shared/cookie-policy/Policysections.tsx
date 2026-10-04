'use client'
import type { ReactNode } from "react";
import { Cookie, ShieldCheck, Mail, LifeBuoy, MapPin, PhoneCall, Download, Eraser } from "lucide-react";
import {
    COOKIE_CATEGORY_ROWS,
    COOKIE_INVENTORY,
    REVISION_LOG,
    STORAGE_MECHANISMS,
    THIRD_PARTY_PROVIDERS,
    TOC_ITEMS,
} from "./Cookie policy.data";
import Link from "next/link";

function Section({ id, number, label, children }: { id: string; number: number; label: string; children: ReactNode }) {
    return (
        <section id={id} className="card scroll-mt-6">
            <p className="text-label-sm text-primary tracking-wide">SECTION {number}</p>
            <h2 className="text-headline-md text-on-surface mt-1">
                {number}. {label}
            </h2>
            <div className="mt-4 flex flex-col gap-4">{children}</div>
        </section>
    );
}

const classificationTone: Record<string, string> = {
    "Strictly Necessary": "bg-surface-container-high text-on-surface-variant",
    Functional: "bg-secondary-container text-on-secondary-container",
    Telemetry: "bg-tertiary-container/20 text-tertiary",
    "Partner & Attribution": "bg-primary-container/15 text-primary",
};

export default function PolicySections() {
    return (
        <div className="flex flex-col gap-6">
            {/* 1. Introduction */}
            <Section id={TOC_ITEMS[0].id} number={1} label={TOC_ITEMS[0].label.replace("& Corporate Commitment", "& Corporate Commitment")}>
                <p className="text-body-md text-on-surface-variant">
                    GigFlow Technologies Inc. (&ldquo;GigFlow,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
                    committed to transparent data practices. This policy explains how we use cookies, pixels, local
                    storage, and similar terminal storage technologies across our platform, and the choices available
                    to you.
                </p>
                <p className="text-body-md text-on-surface-variant">
                    This policy complements our broader Privacy Policy and Terms of Service, and applies to all
                    visitors, registered freelancers, and client accounts interacting with GigFlow web and mobile
                    properties.
                </p>
                <div className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-body-sm text-on-surface-variant">
                        <span className="text-on-surface font-medium">Data Compliance Officer:</span> GigFlow maintains
                        a dedicated privacy engineering team responsible for auditing every cookie and tracking
                        technology deployed on this domain against our data minimization standards.
                    </p>
                </div>
            </Section>

            {/* 2. What Are Cookies */}
            <Section id={TOC_ITEMS[1].id} number={2} label="What Are Cookies & Terminal Storage Mechanisms?">
                <p className="text-body-md text-on-surface-variant">
                    Cookies are small text files placed on your device by a website. GigFlow also uses related
                    terminal storage technologies—browser storage, structured client databases, and network
                    beacons—to deliver secure sessions, remember preferences, and measure performance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STORAGE_MECHANISMS.map((mech) => (
                        <div key={mech.title} className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                            <p className="flex items-center gap-2 text-body-md text-on-surface">
                                <Cookie size={15} className="text-primary shrink-0" />
                                {mech.title}
                            </p>
                            <p className="text-body-sm text-on-surface-variant mt-1.5">{mech.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 3. Categories */}
            <Section id={TOC_ITEMS[2].id} number={3} label="Categories of Cookies We Use">
                <p className="text-body-md text-on-surface-variant">
                    We group every cookie and storage mechanism into one of four categories, aligned with the
                    European Data Protection Board (EDPB) and California Consumer Privacy Act (CCPA) classification
                    guidance.
                </p>
                <div className="flex flex-col gap-2">
                    {COOKIE_CATEGORY_ROWS.map((row) => (
                        <div
                            key={row.id}
                            className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest border border-outline-variant rounded-md p-4"
                        >
                            <div className="min-w-0">
                                <p className="text-body-md text-on-surface">{row.title}</p>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">{row.description}</p>
                            </div>
                            <span className="text-label-md text-primary bg-primary-container/15 rounded-full px-3 py-1 shrink-0">
                                View All ({row.count})
                            </span>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 4. Inventory */}
            <Section id={TOC_ITEMS[3].id} number={4} label="Detailed Cookie Inventory & Retention">
                <p className="text-body-md text-on-surface-variant">
                    A full, continuously audited list of every cookie and identifier set on this domain and its
                    retention period.
                </p>
                <div className="border border-outline-variant rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Cookie / Identifier</th>
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Provider</th>
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Classification</th>
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Purpose & Retention</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COOKIE_INVENTORY.map((row) => (
                                    <tr key={row.name} className="border-b border-outline-variant last:border-0">
                                        <td className="px-4 py-3 align-top">
                                            <code className="text-body-sm text-on-surface bg-surface-container-high rounded px-1.5 py-0.5">
                                                {row.name}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 align-top text-body-sm text-on-surface-variant whitespace-nowrap">{row.provider}</td>
                                        <td className="px-4 py-3 align-top">
                                            <span className={`text-label-sm rounded px-2 py-0.5 whitespace-nowrap ${classificationTone[row.classification]}`}>
                                                {row.classification}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top text-body-sm text-on-surface-variant">
                                            {row.purpose}
                                            <span className="text-on-surface-variant/70"> · Retention: {row.retention}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>

            {/* 5. Third-Party Providers */}
            <Section id={TOC_ITEMS[4].id} number={5} label="Third-Party Service Providers & Subprocessors">
                <p className="text-body-md text-on-surface-variant">
                    GigFlow works with a short list of vetted subprocessors, each bound by a Data Processing Agreement
                    (DPA) limiting use of any data collected via cookies to the purposes described below.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THIRD_PARTY_PROVIDERS.map((provider) => (
                        <div key={provider.name} className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-body-md text-on-surface">{provider.name}</p>
                                <span className="text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2 py-0.5 shrink-0">
                                    {provider.category}
                                </span>
                            </div>
                            <p className="text-body-sm text-on-surface-variant mt-1.5">{provider.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 6. Escrow & KYC */}
            <Section id={TOC_ITEMS[5].id} number={6} label="Escrow & KYC Verification Session Tracking">
                <p className="text-body-md text-on-surface-variant">
                    To maintain compliance with international anti-money laundering (AML) and Know Your Customer
                    (KYC) regulations, GigFlow applies additional session integrity controls during identity
                    verification, escrow funding, and document capture flows.
                </p>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <p className="flex items-center gap-2 text-body-md text-on-surface">
                        <ShieldCheck size={16} className="text-primary shrink-0" />
                        Hardware-Assisted Elements & Document Capture Cookies
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1.5">
                        During identity verification, we set short-lived cookies that bind your session to the device
                        camera input used for document capture, preventing replay and spoofing attacks.
                    </p>
                    <ul className="flex flex-col gap-1.5 mt-3 list-disc pl-5 text-body-sm text-on-surface-variant">
                        <li>Session-bound tokens expire immediately after verification completes.</li>
                        <li>No biometric data is persisted in cookies or browser storage.</li>
                        <li>Escrow funding sessions are independently signed and auditable.</li>
                    </ul>
                </div>
            </Section>

            {/* 7. User Rights */}
            <Section id={TOC_ITEMS[6].id} number={7} label="User Rights & How to Control Cookies">
                <p className="text-body-md text-on-surface-variant">
                    Beyond the Preference Center above, your browser offers platform-level signals that GigFlow
                    honors automatically.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="text-body-md text-on-surface">Global Privacy Control (GPC)</p>
                        <p className="text-body-sm text-on-surface-variant mt-1.5">
                            GigFlow automatically applies an opt-out of non-essential tracking when your browser
                            sends a GPC signal, without requiring further action.
                        </p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="text-body-md text-on-surface">Do Not Track</p>
                        <p className="text-body-sm text-on-surface-variant mt-1.5">
                            While not yet a formal web standard, GigFlow treats an enabled Do Not Track header the
                            same as disabling Telemetry & Partner cookies.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        <Eraser size={15} />
                        Clear Cookie Storage
                    </button>
                    <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        <Download size={15} />
                        Export My Data
                    </button>
                </div>
            </Section>

            {/* 8. Regulatory Frameworks */}
            <Section id={TOC_ITEMS[7].id} number={8} label="Global Regulatory Frameworks">
                <p className="text-body-md text-on-surface-variant">
                    GigFlow aligns its cookie and tracking practices with the most relevant global privacy
                    regulations:
                </p>
                <div className="flex flex-col gap-2">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="text-body-md text-on-surface">European Union (GDPR) & UK-GDPR</p>
                        <p className="text-body-sm text-on-surface-variant mt-1.5">
                            Non-essential cookies require affirmative opt-in consent before being set, with granular
                            category-level controls provided via the Preference Center above.
                        </p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="text-body-md text-on-surface">California Consumer Privacy Act (CCPA / CPRA)</p>
                        <p className="text-body-sm text-on-surface-variant mt-1.5">
                            California residents may opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of
                            personal information via cookies, including Partner & Attribution cookies, at any time.
                        </p>
                    </div>
                </div>
            </Section>

            {/* 9. Revision Log */}
            <Section id={TOC_ITEMS[8].id} number={9} label="Policy Updates & Revision Log">
                <p className="text-body-md text-on-surface-variant">
                    We review this policy at least annually, or whenever we introduce a new tracking technology or
                    subprocessor.
                </p>
                <div className="border border-outline-variant rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Version</th>
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Date</th>
                                    <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Summary of Material Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {REVISION_LOG.map((row) => (
                                    <tr key={row.version} className="border-b border-outline-variant last:border-0">
                                        <td className="px-4 py-3 align-top whitespace-nowrap">
                                            <span className={`text-label-sm rounded px-2 py-0.5 ${row.current ? "bg-primary-container/15 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                                                v{row.version}
                                                {row.current ? " · Current" : ""}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top text-body-sm text-on-surface-variant whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-3 align-top text-body-sm text-on-surface-variant">{row.summary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>

            {/* 10. Contact DPO */}
            <Section id={TOC_ITEMS[9].id} number={10} label="Contact Privacy & Data Protection Officer">
                <p className="text-body-md text-on-surface-variant">
                    If you have questions about this policy or wish to exercise a data subject right, contact our
                    Data Protection Officer directly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <Mail size={13} />
                            DPO Email
                        </p>
                        <p className="text-body-md text-on-surface mt-1.5">mohamed.fullstack.eng@gmail.com</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <LifeBuoy size={13} />
                            Support Center
                        </p>
                        <p className="text-body-md text-on-surface mt-1.5">Open a Privacy Ticket</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <MapPin size={13} />
                            Postal Address
                        </p>
                        <p className="text-body-md text-on-surface mt-1.5">GigFlow Technologies Inc., San Francisco, CA</p>
                    </div>
                </div>
                <Link href={'/contact-support'} className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer w-fit">
                    <PhoneCall size={15} />
                    contact support
                </Link>
            </Section>
        </div>
    );
}