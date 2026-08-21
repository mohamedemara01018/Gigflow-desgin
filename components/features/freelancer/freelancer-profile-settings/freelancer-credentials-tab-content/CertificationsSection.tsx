"use client";

import React from "react";
import { Award, Plus, ExternalLink, Pencil, Trash2, Loader2 } from "lucide-react";
import { ICertification } from "@/services/certification.service";

interface CertificationsSectionProps {
    certifications: ICertification[];
    loadingCerts: boolean;
    onOpenAddModal: () => void;
    onOpenEditModal: (cert: ICertification) => void;
    onDeleteCertification: (id: string) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
    certifications,
    loadingCerts,
    onOpenAddModal,
    onOpenEditModal,
    onDeleteCertification,
}) => {
    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                    <Award size={20} className="text-tertiary" />
                    Certifications
                </span>
                <button
                    onClick={onOpenAddModal}
                    className="flex items-center gap-1.5 text-primary text-label-md font-medium hover:underline cursor-pointer"
                >
                    <Plus size={16} />
                    Add New
                </button>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Highlight your formal training and industry credentials to stand out.
            </p>

            <div className="flex flex-col gap-3 mt-5">
                {loadingCerts ? (
                    <div className="flex items-center justify-center py-10 text-on-surface-variant gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-body-md">Loading certifications...</span>
                    </div>
                ) : certifications.length > 0 ? (
                    certifications.map((cert) => (
                        <div
                            key={cert._id}
                            className="flex items-center justify-between gap-4 border-l-4 border-primary bg-surface-container-low rounded-md p-4"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-12 rounded-md bg-surface-container-high flex items-center justify-center shrink-0">
                                    <Award size={20} className="text-on-surface-variant" />
                                </span>
                                <div>
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {cert.name}
                                    </p>
                                    {cert.issuer && (
                                        <p className="text-body-sm text-on-surface-variant">
                                            {cert.issuer}
                                        </p>
                                    )}
                                    <div className="flex items-center flex-wrap gap-3 mt-1.5 text-label-sm text-on-surface-variant">
                                        {cert.issueDate && (
                                            <span>Issued {formatDate(cert.issueDate)}</span>
                                        )}
                                        {cert.expirationDate && (
                                            <span>Expires {formatDate(cert.expirationDate)}</span>
                                        )}
                                        {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-primary font-medium hover:underline"
                                            >
                                                <ExternalLink size={12} />
                                                Show Credential
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onOpenEditModal(cert)}
                                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                    aria-label="Edit certification"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeleteCertification(cert._id)}
                                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                                    aria-label="Delete certification"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : null}

                <button
                    onClick={onOpenAddModal}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-md py-8 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer w-full"
                >
                    <span className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                        <Plus size={18} />
                    </span>
                    <span className="text-body-md font-medium">Add Certification</span>
                    <span className="text-body-sm text-center max-w-70">
                        Showcase your verified skills to clients. Upload certificates or link to digital badges.
                    </span>
                </button>
            </div>
        </section>
    );
};