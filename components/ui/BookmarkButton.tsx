"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { savedJobService } from "@/services/savedJob.service";
import { toastify, IToastificationType } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";

interface BookmarkButtonProps {
    jobId: string;
    initialIsSaved?: boolean;
    variant?: "icon" | "button";
    size?: number;
    className?: string;
    onSaveChange?: (isSaved: boolean) => void;
}

export default function BookmarkButton({
    jobId,
    initialIsSaved = false,
    variant = "icon",
    size = 18,
    className = "",
    onSaveChange,
}: BookmarkButtonProps) {
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    const [isSaved, setIsSaved] = useState<boolean>(initialIsSaved);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isCheckingSavedStatus, setIsCheckingSavedStatus] = useState<boolean>(false);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // Fetch initial saved status from API on mount
    useEffect(() => {
        let isMounted = true;

        const checkSavedStatus = async () => {
            if (!me?._id || !jobId) return;

            try {
                setIsCheckingSavedStatus(true);
                const response = await savedJobService.isJobSaved({
                    user: me._id,
                    job: jobId,
                });

                if (isMounted) {
                    const status = response.data?.isSaved ?? false;
                    setIsSaved(status);
                    onSaveChange?.(status);
                }
            } catch {
                // Fail silently for status check to preserve default prop fallback
            } finally {
                if (isMounted) {
                    setIsCheckingSavedStatus(false);
                }
            }
        };

        checkSavedStatus();

        return () => {
            isMounted = false;
        };
    }, [jobId, me?._id, onSaveChange]);

    const handleToggleSave = async () => {
        if (!me?._id) {
            handleToast("Please log in to save jobs", "error");
            return;
        }

        if (isSaving || isCheckingSavedStatus) return;

        const nextState = !isSaved;
        setIsSaved(nextState); // Optimistic UI update
        setIsSaving(true);

        try {
            const response = await savedJobService.toggleSaveJob({
                user: me._id,
                job: jobId,
            });

            const newStatus = response.data?.isSaved ?? nextState;
            setIsSaved(newStatus);
            onSaveChange?.(newStatus);

            handleToast(
                response.message || (newStatus ? "Job saved!" : "Job removed from saved list"),
                "success"
            );
        } catch (err: unknown) {
            setIsSaved(!nextState); // Rollback on failure
            const error = err as Error;
            handleToast(error.message || "Failed to update saved job", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = isSaving || isCheckingSavedStatus;

    if (variant === "button") {
        return (
            <button
                type="button"
                disabled={isLoading}
                onClick={handleToggleSave}
                className={`bg-surface border border-outline-variant text-on-surface text-label-md rounded-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50 ${className}`}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={size} className="animate-spin text-tertiary" />
                        <span>Updating...</span>
                    </>
                ) : (
                    <>
                        <Bookmark
                            size={size}
                            className={isSaved ? "fill-primary text-primary" : ""}
                        />
                        <span>{isSaved ? "Saved Job" : "Save Job"}</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-label={isSaved ? "Unsave job" : "Save job"}
            disabled={isLoading}
            onClick={handleToggleSave}
            className={`shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 ${isSaved
                    ? "border-primary text-primary bg-primary/10"
                    : "border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary"
                } ${className}`}
        >
            {isLoading ? (
                <Loader2 size={size} className="animate-spin text-tertiary" />
            ) : (
                <Bookmark size={size} className={isSaved ? "fill-primary" : ""} />
            )}
        </button>
    );
}