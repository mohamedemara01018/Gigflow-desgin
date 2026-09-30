"use client";

import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";
import { FileEdit } from "lucide-react";

interface CoverLetterPitchCardProps {
    coverLetter?: string;
    skillsAligned?: string[];
}



export default function CoverLetterPitchCard({
    coverLetter,
}: CoverLetterPitchCardProps) {
    const characterCount = coverLetter?.length ?? 0;
    const maxCharacters = 5000;

    return (
        <section className="card">
            <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                    <FileEdit size={18} className="text-primary" />
                    Cover Letter & Technical Pitch
                </h2>
                <span className="text-body-sm text-on-surface-variant shrink-0">
                    {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()} characters
                </span>
            </div>


            <div className="text-body-md text-on-surface-variant mt-5">
                {coverLetter ? (
                    <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                        <ReadOnlyOverview content={coverLetter} width="100%" tabletWidth="100%"/>
                    </div>
                ) : (
                    <p className="italic text-on-surface-variant">
                        No cover letter provided for this proposal.
                    </p>
                )}
            </div>
        </section>
    );
}