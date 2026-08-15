"use client";

import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { ALLOWED_IMG_TYPES, MAX_IMG_SIZE } from "@/utils/constant.utils";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import {
    ChangeEvent,
    DragEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";

interface IDropzone {
    label: string;
    hint: string;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    index: number;
}

function Dropzone({
    label,
    hint,
    files,
    setFiles,
    index,
}: IDropzone) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const file = files[index];

    /* ---------------- Toast ---------------- */

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(
            toastify({
                message,
                type,
                duration,
            })
        );
    };

    /* ---------------- Validation ---------------- */

    const validateFile = (file: File) => {
        if (file.size > MAX_IMG_SIZE) {
            handleAddToastification(
                "Image size must be less than 5MB",
                "warning",
                5000
            );

            return false;
        }

        if (!ALLOWED_IMG_TYPES.includes(file.type)) {
            handleAddToastification(
                "Image type must be JPG or PNG",
                "warning",
                5000
            );

            return false;
        }

        // Don't allow same file in another dropzone
        const alreadyExists = files.some(
            (existingFile, existingIndex) =>
                existingIndex !== index &&
                existingFile &&
                existingFile.name === file.name &&
                existingFile.size === file.size
        );

        if (alreadyExists) {
            handleAddToastification(
                `${file.name} has already been added.`,
                "warning",
                5000
            );

            return false;
        }

        return true;
    };

    /* ---------------- Select File ---------------- */

    const handleFile = (file: File) => {
        if (!validateFile(file)) {
            return;
        }

        setFiles((prev) => {
            const updated = [...prev];

            updated[index] = file;

            return updated;
        });
    };

    /* ---------------- Input Change ---------------- */

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        handleFile(file);

        // Allow selecting the same file again
        e.target.value = "";
    };

    /* ---------------- Drag Enter ---------------- */

    const handleDragEnter = (
        e: DragEvent<HTMLLabelElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
    };

    /* ---------------- Drag Leave ---------------- */

    const handleDragLeave = (
        e: DragEvent<HTMLLabelElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);
    };

    /* ---------------- Drag Over ---------------- */

    const handleDragOver = (
        e: DragEvent<HTMLLabelElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        // Important!
        // Without this, onDrop won't fire.
        e.dataTransfer.dropEffect = "copy";

        setIsDragging(true);
    };

    /* ---------------- Drop ---------------- */

    const handleDrop = (
        e: DragEvent<HTMLLabelElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];

        if (!droppedFile) return;

        handleFile(droppedFile);
    };

    /* ---------------- Preview ---------------- */

    useEffect(() => {
        if (!file) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(file);

        setPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    /* ---------------- Remove ---------------- */

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setFiles((prev) => {
            const updated = [...prev];

            updated[index] = undefined as unknown as File;

            return updated;
        });

        setPreview(null);
    };

    return (
        <label
            htmlFor={`file-${index}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                group
                relative
                flex
                min-h-28
                cursor-pointer
                items-center
                gap-4
                overflow-hidden
                rounded-xl
                border-2
                border-dashed
                px-5
                transition-all
                duration-200

                ${isDragging
                    ? "border-primary bg-primary-container"
                    : "border-outline-variant bg-surface-container-low hover:border-primary hover:bg-surface-container-highest"
                }
            `}
        >
            <input
                ref={inputRef}
                id={`file-${index}`}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
            />

            {preview ? (
                <>
                    {/* Preview */}

                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                        <Image
                            src={preview}
                            alt={`${label} preview`}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>

                    {/* File information */}

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate text-body-md font-medium text-on-surface">
                            {label}
                        </span>

                        <span className="truncate text-body-sm text-on-surface-variant">
                            {file?.name}
                        </span>

                        <span className="text-label-sm text-primary">
                            Click or drop another image to replace
                        </span>
                    </div>

                    {/* Remove */}

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-error-container
                            text-on-error-container
                            transition
                            hover:scale-105
                        "
                    >
                        <X size={16} />
                    </button>
                </>
            ) : (
                <>
                    {/* Icon */}

                    <span
                        className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            transition-colors

                            ${isDragging
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary"
                            }
                        `}
                    >
                        {isDragging ? (
                            <Upload size={22} />
                        ) : (
                            <ImagePlus size={22} />
                        )}
                    </span>

                    {/* Content */}

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-body-md font-medium text-on-surface">
                            {isDragging
                                ? "Drop your image here"
                                : label}
                        </span>

                        <span className="text-body-sm text-on-surface-variant">
                            {isDragging
                                ? "Release to upload"
                                : "Drag and drop or click to browse"}
                        </span>
                    </div>

                    {/* Hint */}

                    <span className="shrink-0 text-label-sm text-on-surface-variant">
                        {hint}
                    </span>
                </>
            )}
        </label>
    );
}

export default Dropzone;