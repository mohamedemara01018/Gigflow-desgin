/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useRef, ChangeEvent, DragEvent, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Upload,
    File,
    X,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    ShieldCheck,
    Loader2,
    FileText,
    Image as ImageIcon,
    Paperclip,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { attachmentService, IAttachmentItem } from "@/services/attachment.service";
import { AttachmentEntityType } from "@/utils/enums.utils";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

interface UploadedFileItem {
    id: string;
    file: File;
    progress: number;
    status: "uploading" | "completed" | "error";
    errorMessage?: string;
    url?: string;
}

export default function UploadAttachmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch: AppDispatch = useDispatch();

    const { me } = useSelector(selectMeSlice);

    const entityId = searchParams.get("entity-id") || "";
    const rawEntityType = searchParams.get("entity-type") || AttachmentEntityType.JOB;
    const entityType = (
        Object.values(AttachmentEntityType).includes(rawEntityType as AttachmentEntityType)
            ? rawEntityType
            : AttachmentEntityType.JOB
    ) as AttachmentEntityType;

    // Server-persisted attachments
    const [existingAttachments, setExistingAttachments] = useState<IAttachmentItem[]>([]);
    const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Newly selected files to upload
    const [files, setFiles] = useState<UploadedFileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // 1. Fetch existing attachments on load
    const fetchExistingAttachments = useCallback(async () => {
        if (!entityId) {
            setIsLoadingExisting(false);
            return;
        }

        try {
            setIsLoadingExisting(true);
            const response = await attachmentService.getEntityAttachments({
                entity: entityType,
                entityId,
            });
            setExistingAttachments(response.data.attachments || []);
        } catch (err: unknown) {
            const error = err as Error;
            handleToast(error.message || "Failed to load existing attachments.", "error");
        } finally {
            setIsLoadingExisting(false);
        }
    }, [entityId, entityType, handleToast]);

    useEffect(() => {
        fetchExistingAttachments();
    }, [fetchExistingAttachments]);

    useEffect(() => {
        const intervals = activeIntervals.current;
        return () => {
            intervals.forEach((interval) => clearInterval(interval));
            intervals.clear();
        };
    }, []);

    // 2. Delete single existing attachment
    const handleDeleteExistingAttachment = async (attachmentId: string) => {
        try {
            setDeletingId(attachmentId);
            await attachmentService.deleteAttachment(attachmentId);
            setExistingAttachments((prev) => prev.filter((item) => item._id !== attachmentId));
            handleToast("Attachment deleted successfully.", "success");
        } catch (err: unknown) {
            const error = err as Error;
            handleToast(error.message || "Failed to delete attachment.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const validateFile = useCallback((file: File): string | null => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Unsupported file format. Please upload PDF, PNG, JPG, or DOCX.";
        }
        return null;
    }, []);

    const simulateFileUpload = useCallback((fileId: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 15;

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                activeIntervals.current.delete(fileId);

                setFiles((prev) =>
                    prev.map((item) =>
                        item.id === fileId ? { ...item, progress: 100, status: "completed" } : item
                    )
                );
            } else {
                setFiles((prev) =>
                    prev.map((item) =>
                        item.id === fileId ? { ...item, progress } : item
                    )
                );
            }
        }, 200);

        activeIntervals.current.set(fileId, interval);
    }, []);

    const processFiles = useCallback(
        (newFiles: FileList | File[]) => {
            const fileArray = Array.from(newFiles);

            fileArray.forEach((file) => {
                const error = validateFile(file);
                const fileId = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

                if (error) {
                    handleToast(`${file.name}: ${error}`, "error");
                    return;
                }

                const newItem: UploadedFileItem = {
                    id: fileId,
                    file,
                    progress: 0,
                    status: "uploading",
                };

                setFiles((prev) => [...prev, newItem]);
                simulateFileUpload(fileId);
            });
        },
        [handleToast, validateFile, simulateFileUpload]
    );

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            processFiles(e.target.files);
            e.target.value = "";
        }
    };

    const removeFile = (id: string) => {
        const activeInterval = activeIntervals.current.get(id);
        if (activeInterval) {
            clearInterval(activeInterval);
            activeIntervals.current.delete(id);
        }
        setFiles((prev) => prev.filter((item) => item.id !== id));
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes) return "0 B";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith("image/")) return <ImageIcon size={20} className="text-tertiary" />;
        if (mimeType.includes("pdf")) return <FileText size={20} className="text-primary" />;
        return <File size={20} className="text-secondary" />;
    };

    const isUploadingAny = files.some((f) => f.status === "uploading");
    const completedFiles = files.filter((item) => item.status === "completed");

    // 3. Upload new files and finish
    const handleCompleteUpload = async () => {
        if (isUploadingAny) {
            handleToast("Please wait for all uploads to finish before proceeding.", "error");
            return;
        }

        if (!entityId) {
            handleToast("Missing Entity ID. Unable to link attachments.", "error");
            return;
        }

        const userId = me?._id;
        if (!userId) {
            handleToast("User session not found. Please log in again.", "error");
            return;
        }

        // If no new files were selected, redirect back directly
        if (completedFiles.length === 0) {
            router.push("/client/jobs");
            return;
        }

        setIsSubmitting(true);
        try {
            const rawFilesToUpload = completedFiles.map((item) => item.file);

            await attachmentService.createAttachment({
                files: rawFilesToUpload,
                entityId,
                entityType,
                uploadedBy: userId,
            });

            handleToast("Attachments updated successfully!", "success");
            router.push("/client/jobs");
        } catch (err: unknown) {
            const error = err as Error;
            handleToast(error.message || "Failed to finalize attachment upload.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-body-sm text-on-surface-variant">
                            Client Portal / My Jobs / Attachments
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <h1 className="text-headline-lg text-on-surface">Manage Job Attachments</h1>
                            <span className="flex items-center gap-1 text-label-sm text-primary bg-primary-container/10 px-2.5 py-1 rounded-full">
                                <ShieldCheck size={14} />
                                Secure Cloud Storage
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card flex flex-col gap-6">
                    <div>
                        <h2 className="text-headline-md text-on-surface flex items-center gap-2">
                            <Paperclip size={20} className="text-primary" />
                            Project Files & Supporting Specs
                        </h2>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Attach technical requirements, Figma design mocks, wireframes, or reference documents for freelancers.
                        </p>
                    </div>

                    {/* Existing Server Attachments */}
                    {isLoadingExisting ? (
                        <div className="flex items-center justify-center p-6 bg-surface-container-low rounded-lg gap-2 text-on-surface-variant">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Loading existing attachments...</span>
                        </div>
                    ) : existingAttachments.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-label-md text-on-surface font-semibold">
                                Existing Attachments ({existingAttachments.length})
                            </h3>
                            <div className="flex flex-col gap-2">
                                {existingAttachments.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between p-3 rounded-md border border-outline-variant bg-surface-container-low"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-4">
                                            {getFileIcon(item.mimeType)}
                                            <div className="min-w-0">
                                                <p className="text-label-md text-on-surface font-medium truncate">
                                                    {item.originalName || item.fileName}
                                                </p>
                                                <p className="text-body-sm text-on-surface-variant">
                                                    {formatFileSize(item.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline flex items-center gap-1 text-body-sm"
                                            >
                                                View <ExternalLink size={14} />
                                            </a>
                                            <button
                                                type="button"
                                                disabled={deletingId === item._id}
                                                onClick={() => handleDeleteExistingAttachment(item._id)}
                                                className="text-on-surface-variant hover:text-error transition-colors p-1 cursor-pointer disabled:opacity-50"
                                                title="Delete attachment"
                                            >
                                                {deletingId === item._id ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Drag and Drop Zone for New Files */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging
                            ? "border-primary bg-primary-container/10 scale-[1.01]"
                            : "border-outline-variant hover:border-primary hover:bg-surface-container-low"
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg,.docx,.doc,.txt"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mb-3">
                            <Upload size={24} />
                        </div>
                        <p className="text-label-lg text-on-surface font-medium">
                            Click to upload or drag and drop new files
                        </p>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            PDF, PNG, JPG, or DOCX (Max file size: {MAX_FILE_SIZE_MB}MB)
                        </p>
                    </div>

                    {/* Pending Upload Files List */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2">
                            <h3 className="text-label-md text-on-surface font-semibold">
                                Files Ready to Upload ({files.length})
                            </h3>
                            <div className="flex flex-col gap-2">
                                {files.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-md border border-outline-variant bg-surface-container-low"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-4">
                                            {getFileIcon(item.file.type)}
                                            <div className="min-w-0">
                                                <p className="text-label-md text-on-surface font-medium truncate">
                                                    {item.file.name}
                                                </p>
                                                <p className="text-body-sm text-on-surface-variant">
                                                    {formatFileSize(item.file.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            {item.status === "uploading" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-surface-variant rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-primary h-full transition-all duration-200"
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-body-sm text-on-surface-variant w-8 text-right">
                                                        {item.progress}%
                                                    </span>
                                                </div>
                                            )}

                                            {item.status === "completed" && (
                                                <span className="flex items-center gap-1 text-label-sm text-primary">
                                                    <CheckCircle size={16} /> Ready
                                                </span>
                                            )}

                                            {item.status === "error" && (
                                                <span className="flex items-center gap-1 text-label-sm text-error">
                                                    <AlertCircle size={16} /> Failed
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(item.id);
                                                }}
                                                className="text-on-surface-variant hover:text-error transition-colors p-1 cursor-pointer"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40 mt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/client/jobs")}
                            className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        >
                            Back to Jobs
                        </button>

                        <button
                            type="button"
                            onClick={handleCompleteUpload}
                            disabled={isSubmitting || isUploadingAny}
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Changes & View Job
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}