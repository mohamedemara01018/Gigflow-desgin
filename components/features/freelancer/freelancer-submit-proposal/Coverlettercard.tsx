'use client';

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/core";

const MAX_CHARS = 5000;

interface CoverLetterCardProps {
    coverLetter: string;
    handleEditorReady: (editor: Editor) => void;
}

export default function CoverLetterCard({ coverLetter, handleEditorReady }: CoverLetterCardProps) {
    const textLength = coverLetter.replace(/<[^>]*>/g, "").length;

    return (
        <section className="card">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-headline-md text-on-surface">Cover Letter Pitch</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Highlight why your expertise aligns with the project architecture goals.
                    </p>
                </div>
                <span className="text-body-sm text-on-surface-variant shrink-0">
                    {textLength.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </span>
            </div>

            <div className="mt-4 border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest">
                <SimpleEditor
                    content={coverLetter}
                    maxWidth="100%"
                    tabletWidth="100%"
                    onEditReady={handleEditorReady}
                />
            </div>
        </section>
    );
}