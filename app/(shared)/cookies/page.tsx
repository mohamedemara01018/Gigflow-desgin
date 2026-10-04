
import { Printer, Download, Settings2, ShieldCheck } from "lucide-react";
import PreferenceCenterCard from "@/components/features/shared/cookie-policy/Preferencecentercard";
import TableOfContents from "@/components/features/shared/cookie-policy/Tableofcontents";
import PolicySections from "@/components/features/shared/cookie-policy/Policysections";

export default function CookiePolicyPage() {
    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
                    <div>
                        <h1 className="text-headline-lg text-on-surface">Cookie & Tracking Technologies Policy</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-body-sm text-on-surface-variant">
                            <span>Effective Date: October 24, 2024</span>
                            <span>Last Updated: November 10, 2024</span>
                            <span className="text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded-full">
                                Version 4.2 · Current
                            </span>
                            <span className="flex items-center gap-1 text-label-sm text-primary">
                                <ShieldCheck size={13} />
                                GDPR / CCPA / UK-GDPR Aligned
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href="#preference-center"
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            <Settings2 size={16} />
                            Manage Preferences
                        </a>
                    </div>
                </div>

                {/* Preference Center */}
                <div className="mt-6">
                    <PreferenceCenterCard />
                </div>

                {/* TOC + Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6 mt-6 items-start">
                    <TableOfContents />
                    <PolicySections />
                </div>
            </div>
        </main>
    );
}