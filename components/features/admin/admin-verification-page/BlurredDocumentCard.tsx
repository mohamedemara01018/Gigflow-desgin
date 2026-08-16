/* eslint-disable @next/next/no-img-element */
"use client";

import ImageModal from "@/components/ui/ImageModal";
import { IAttachmentItem } from "@/services/attachment.service";
import { useState } from "react";

function BlurredDocumentCard({ attach }: { attach: IAttachmentItem }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div
                onClick={handleOpen}
                className="group relative rounded-lg overflow-hidden bg-surface-container-high h-36 cursor-pointer border border-outline-variant hover:border-outline transition-colors"
            >
                <div
                    className="absolute inset-0 transition-all duration-300 overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-surface-variant) 0%, var(--color-outline-variant) 100%)",
                    }}
                >
                    <img
                        src={attach.url}
                        alt={attach.fileName || "Document attachment"}
                        className="w-full h-full object-cover blur-sm group-hover:blur-none group-hover:scale-105 transition-all duration-300"
                    />
                </div>

                {/* Optional overlay title tag */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-label-sm truncate">{attach.fileName}</p>
                </div>
            </div>

            {/* Render Modal OUTSIDE the clickable card container */}
            <ImageModal
                src={attach.url}
                alt={attach.fileName}
                isOpen={isOpen}
                onClose={handleClose}
            />
        </>
    );
}

export default BlurredDocumentCard;