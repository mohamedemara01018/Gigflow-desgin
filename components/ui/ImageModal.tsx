/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageModalProps {
    isOpen: boolean;
    src: string;
    alt?: string;
    onClose: () => void;
}

export default function ImageModal({
    isOpen,
    src,
    alt = "Full screen preview",
    onClose,
}: ImageModalProps) {
    // Handle Escape key press & prevent background scroll
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out"
        >
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                aria-label="Close fullscreen view"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-surface-container/50 text-on-surface hover:bg-surface-container hover:scale-105 transition-all cursor-pointer"
            >
                <X size={24} />
            </button>

            {/* Expanded Image */}
            <img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default select-none"
            />
        </div>
    );
}