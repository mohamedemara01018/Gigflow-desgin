"use client";

import { AvailabilityStatus, ProfileVisibility } from "@/utils/enums.utils";

interface VisibilityAndStatusCardProps {
    visibility: ProfileVisibility;
    availability: AvailabilityStatus;
    onVisibilityChange: (value: ProfileVisibility) => void;
    onAvailabilityChange: (value: AvailabilityStatus) => void;
}

const VISIBILITY_OPTIONS: { id: ProfileVisibility; label: string }[] = [
    { id: ProfileVisibility.PUBLIC, label: "Public" },
    { id: ProfileVisibility.CLIENTS_ONLY, label: "Clients Only" },
    { id: ProfileVisibility.PRIVATE, label: "Private" },
];

const AVAILABILITY_OPTIONS: { id: AvailabilityStatus; label: string; dotClass: string }[] = [
    { id: AvailabilityStatus.AVAILABLE, label: "Available for work", dotClass: "bg-primary" },
    { id: AvailabilityStatus.BUSY, label: "Busy", dotClass: "bg-error" },
    { id: AvailabilityStatus.NOT_AVAILABLE, label: "Not Available", dotClass: "bg-on-surface-variant" },
];

export function VisibilityAndStatusCard({
    visibility,
    availability,
    onVisibilityChange,
    onAvailabilityChange,
}: VisibilityAndStatusCardProps) {
    return (
        <section className="card">
            <h3 className="text-headline-md !text-[18px] !leading-6 text-on-surface">
                Visibility &amp; Status
            </h3>

            {/* Profile Visibility */}
            <div className="mt-4">
                <label className="text-body-sm font-medium text-on-surface block mb-2">
                    Profile Visibility
                </label>
                <div className="flex bg-surface-container-low rounded-md p-1">
                    {VISIBILITY_OPTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onVisibilityChange(id)}
                            className={`flex-1 text-label-sm px-2 py-1.5 rounded transition-colors ${visibility === id
                                    ? "bg-surface-container-highest text-primary font-medium shadow-[var(--shadow-level-2)]"
                                    : "text-on-surface-variant"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="mt-5">
                <label className="text-body-sm font-medium text-on-surface block mb-2">
                    Availability
                </label>
                <div className="flex flex-col gap-2.5">
                    {AVAILABILITY_OPTIONS.map(({ id, label, dotClass }) => {
                        const isSelected = availability === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onAvailabilityChange(id)}
                                className={`flex items-center justify-between rounded-md px-3.5 py-2.5 border-2 transition-colors ${isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-outline-variant"
                                    }`}
                            >
                                <span className="flex items-center gap-2.5">
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary" : "border-outline"
                                            }`}
                                    >
                                        {isSelected && (
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </span>
                                    <span className="text-body-sm text-on-surface">{label}</span>
                                </span>
                                <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}