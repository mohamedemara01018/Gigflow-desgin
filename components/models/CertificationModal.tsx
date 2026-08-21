"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ICertification, ICreateCertificationDto } from "@/services/certification.service";


interface CertificationModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedCertification?: ICertification | null;
    isOpen: boolean;
    profileId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateCertificationDto) => void;
    onEdit: (id: string, payload: ICreateCertificationDto) => void;
}

// Utility to format ISO/Date strings to YYYY-MM-DD for HTML date inputs
const formatDateForInput = (date?: string | Date): string => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export default function CertificationModal({
    selectedCertification,
    isEdit,
    setIsEdit,
    isOpen,
    profileId,
    onClose,
    onSubmit,
    onEdit,
}: CertificationModalProps) {
    const [name, setName] = useState<string>("");
    const [issuer, setIssuer] = useState<string>("");
    const [issueDate, setIssueDate] = useState<string>("");
    const [expirationDate, setExpirationDate] = useState<string>("");
    const [credentialId, setCredentialId] = useState<string>("");
    const [credentialUrl, setCredentialUrl] = useState<string>("");

    // Sync state when modal opens or switches between create/edit modes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedCertification) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setName(selectedCertification.name || "");
                setIssuer(selectedCertification.issuer || "");
                setIssueDate(formatDateForInput(selectedCertification.issueDate));
                setExpirationDate(formatDateForInput(selectedCertification.expirationDate));
                setCredentialId(selectedCertification.credentialId || "");
                setCredentialUrl(selectedCertification.credentialUrl || "");
            } else {
                // Reset form fields for create mode
                setName("");
                setIssuer("");
                setIssueDate("");
                setExpirationDate("");
                setCredentialId("");
                setCredentialUrl("");
            }
        }
    }, [isOpen, isEdit, selectedCertification]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateCertificationDto = {
            profile: profileId,
            name,
            issuer: issuer || undefined,
            issueDate: issueDate ? new Date(issueDate) : undefined,
            expirationDate: expirationDate ? new Date(expirationDate) : undefined,
            credentialId: credentialId || undefined,
            credentialUrl: credentialUrl || undefined,
        };

        if (isEdit && selectedCertification?._id) {
            onEdit(selectedCertification._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! max-w-lg space-y-4 relative w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Certification" : "Add Certification"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Certification Name Input */}
                    <div className="w-full">
                        <label
                            htmlFor="cert-name"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Certification Name *
                        </label>
                        <input
                            id="cert-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. AWS Certified Solutions Architect"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Issuer Input */}
                    <div className="w-full">
                        <label
                            htmlFor="cert-issuer"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Issuer / Organization
                        </label>
                        <input
                            id="cert-issuer"
                            type="text"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                            placeholder="e.g. Amazon Web Services, Coursera"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="w-full">
                            <label
                                htmlFor="cert-issue-date"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Issue Date
                            </label>
                            <input
                                id="cert-issue-date"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                            />
                        </div>

                        <div className="w-full">
                            <label
                                htmlFor="cert-expiration-date"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Expiration Date
                            </label>
                            <input
                                id="cert-expiration-date"
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Credential ID Input */}
                    <div className="w-full">
                        <label
                            htmlFor="cert-credential-id"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Credential ID
                        </label>
                        <input
                            id="cert-credential-id"
                            type="text"
                            value={credentialId}
                            onChange={(e) => setCredentialId(e.target.value)}
                            placeholder="e.g. AWS-123456789"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Credential URL Input */}
                    <div className="w-full">
                        <label
                            htmlFor="cert-credential-url"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Credential URL
                        </label>
                        <input
                            id="cert-credential-url"
                            type="url"
                            value={credentialUrl}
                            onChange={(e) => setCredentialUrl(e.target.value)}
                            placeholder="https://example.com/verify/123"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}