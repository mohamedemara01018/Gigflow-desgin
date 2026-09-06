"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ICloudinaryImage } from "@/services/portfolioItem.service";

interface PortfolioGalleryProps {
    gallery: ICloudinaryImage[];
    title: string;
}

export default function PortfolioGallery({ gallery, title }: PortfolioGalleryProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const activeImage: ICloudinaryImage | null = gallery[activeIndex] ?? null;

    if (gallery.length === 0) return null;

    return (
        <div className="card p-0! overflow-hidden rounded-xl border border-outline-variant bg-surface">
            <div className="relative bg-surface-container-lowest flex items-center justify-center min-h-62.5 max-h-105">
                {activeImage?.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={activeImage.image}
                        alt={title}
                        className="w-full h-auto max-h-105 object-contain bg-black/5"
                    />
                )}
                <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-inverse-surface/80 text-inverse-on-surface text-label-sm px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Slide {activeIndex + 1} of {gallery.length}
                </span>
                {activeImage?.image && (
                    <a
                        href={activeImage.image}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/90 text-on-surface text-label-sm px-3 py-1.5 rounded-md shadow-md backdrop-blur-sm hover:bg-surface-container-lowest transition-colors"
                    >
                        <Search size={13} />
                        Full View
                    </a>
                )}
            </div>

            {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-outline-variant">
                    {gallery.map((img, index) => (
                        <button
                            key={img.publicId || index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                                index === activeIndex
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                        >
                            {img.image && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={img.image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}