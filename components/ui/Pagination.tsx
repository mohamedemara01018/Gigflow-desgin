'use client';

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    itemLabel?: string;
    siblingCount?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    isLoading = false,
    itemLabel = "items",
    siblingCount = 1,
}: PaginationProps) {
    // Generate page array with ellipsis markers
    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5; // siblings + first + last + current + 2*dots

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, "...", totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from(
                { length: rightItemCount },
                (_, i) => totalPages - rightItemCount + i + 1
            );
            return [firstPageIndex, "...", ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
        }

        return [];
    }, [totalPages, siblingCount, currentPage]);

    if (isLoading || totalItems === 0) return null;

    const fromItem = (currentPage - 1) * pageSize + 1;
    const toItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <p className="text-body-sm text-on-surface-variant">
                Showing {fromItem}-{toItem} of {totalItems} {itemLabel}
            </p>

            <div className="flex items-center gap-1.5">
                {/* Previous Page Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:border-outline transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Number Buttons */}
                {paginationRange.map((pageNumber, idx) => {
                    if (pageNumber === "...") {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-body-sm"
                            >
                                <MoreHorizontal size={14} />
                            </span>
                        );
                    }

                    const page = pageNumber as number;
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-label-md transition-colors cursor-pointer ${isActive
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface-variant hover:bg-surface-container-high"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Page Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:border-outline transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}