'use client'
import { FileText, FileJson, Download } from "lucide-react";
import { EXECUTED_DOCUMENTS } from "@/views/contract-details/contract-details.data";

export default function ExecutedDocumentsCard() {
    return (
        <section className="card">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-headline-md text-on-surface">Executed Documents</h2>
                <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded shrink-0">
                    {EXECUTED_DOCUMENTS.length} Signed Files
                </span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                {EXECUTED_DOCUMENTS.map((doc) => {
                    const Icon = doc.kind === "json" ? FileJson : FileText;
                    return (
                        <div
                            key={doc.name}
                            className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-md p-3"
                        >
                            <span className="w-8 h-8 rounded-md bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                                <Icon size={15} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-body-sm text-on-surface truncate">{doc.name}</p>
                                <p className="text-label-sm text-on-surface-variant truncate">{doc.meta}</p>
                            </div>
                            <button
                                aria-label={`Download ${doc.name}`}
                                className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
                            >
                                <Download size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
