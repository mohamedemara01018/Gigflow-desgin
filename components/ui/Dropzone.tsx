"use client";

import {
    IToastificationType,
    toastify,
} from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { ALLOWED_IMG_TYPES, DURATION, MAX_IMG_SIZE } from "@/utils/constant.utils";
import { FileSlots } from "@/views/UploadDocumentPage";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/**
 * Files are stored by slot index (front/back/etc.), so a slot may be
 * empty until the user uploads something. `File[]` lies about that —
 * it claims every index always holds a real File.
 */


interface IDropzone {
    label: string;
    hint: string;
    files: FileSlots;
    setFiles: React.Dispatch<React.SetStateAction<FileSlots>>;
    index: number;
}

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png";

function validateFile(
    candidate: File,
    files: FileSlots,
    index: number
): string | null {
    if (candidate.size > MAX_IMG_SIZE) {
        return "Image size must be less than 5MB";
    }

    if (!ALLOWED_IMG_TYPES.includes(candidate.type)) {
        return "Image type must be JPG or PNG";
    }

    const isDuplicate = files.some(
        (existing, existingIndex) =>
            existingIndex !== index &&
            existing?.name === candidate.name &&
            existing?.size === candidate.size
    );

    if (isDuplicate) {
        return `${candidate.name} has already been added.`;
    }

    return null;
}

function Dropzone({ label, hint, files, setFiles, index }: IDropzone) {
    const dispatch: AppDispatch = useDispatch();
    const file = files[index];
    const [preview, setPreview] = useState<string | null>(null);

    const handleAddToastification = (message: string, type: IToastificationType, duration = 500) => {
        dispatch(toastify({ id: crypto.randomUUID(), message, type, duration }));
    };

    // Create/revoke an object URL whenever the assigned file changes.
    useEffect(() => {
        if (!file) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const error = validateFile(selectedFile, files, index);
        console.log(error)
        if (error) {
            handleAddToastification(error, "warning", DURATION);
            e.target.value = "";
            return;
        }

        setFiles((prev) => {
            const updated = [...prev];
            updated[index] = selectedFile;
            return updated;
        });

        // Reset so selecting the same file again still fires onChange.
        e.target.value = "";
    };

    const handleRemove = () => {
        setFiles((prev) => {
            const updated = [...prev];
            updated[index] = undefined;
            return updated;
        });
    };

    return (
        <div className="relative">
            <label
                htmlFor={`file-${index}`}
                className="group relative flex min-h-72 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low transition-all duration-200 hover:border-primary hover:bg-surface-container-highest"
            >
                <input
                    id={`file-${index}`}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {preview ? (
                    <div className="absolute inset-0">
                        <Image
                            src={preview}
                            alt={`${label} preview`}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <ImagePlus size={32} className="text-white" />
                            <span className="mt-2 text-sm font-medium text-white">
                                Change image
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                            <ImagePlus size={22} />
                        </span>
                        <span className="text-body-md font-medium text-on-surface">
                            {label}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                            Drag and drop or click to browse
                        </span>
                        <span className="mt-4 text-label-sm text-on-surface-variant">
                            {hint}
                        </span>
                    </>
                )}
            </label>

            {preview && (
                <button
                    type="button"
                    onClick={handleRemove}
                    aria-label={`Remove ${label}`}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-error text-on-error shadow-md transition-transform hover:scale-105"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

export default Dropzone;