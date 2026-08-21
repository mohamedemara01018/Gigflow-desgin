"use client";

import { ChevronDown, Wallet } from "lucide-react";
import { ExperienceLevel } from "@/utils/enums.utils";

interface RatesAndExperienceSectionProps {
    hourlyRate: number | "";
    experienceLevel: ExperienceLevel;
    onHourlyRateChange: (value: number | "") => void;
    onExperienceLevelChange: (value: ExperienceLevel) => void;
}

export function RatesAndExperienceSection({
    hourlyRate,
    experienceLevel,
    onHourlyRateChange,
    onExperienceLevelChange,
}: RatesAndExperienceSectionProps) {
    return (
        <section className="card">
            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                <span className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                    <Wallet size={16} />
                </span>
                Rates &amp; Experience
            </span>

            <div className=" space-y-4 mt-5">
                <div>
                    <label className="text-body-sm font-medium text-on-surface block mb-2">
                        Hourly Rate
                    </label>
                    <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-md px-3.5">
                        <span className="text-body-md text-on-surface-variant">$</span>
                        <input
                            value={hourlyRate}
                            onChange={(e) =>
                                onHourlyRateChange(
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            type="number"
                            className="w-full bg-transparent py-2.5 px-2 text-body-md text-on-surface outline-none"
                        />
                        <span className="text-body-sm text-on-surface-variant">/hr</span>
                    </div>
                </div>

                <div>
                    <label className="text-body-sm font-medium text-on-surface block mb-2">
                        Experience Level
                    </label>
                    <div className="relative">
                        <select
                            value={experienceLevel}
                            onChange={(e) =>
                                onExperienceLevelChange(e.target.value as ExperienceLevel)
                            }
                            className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 pr-9 text-body-md text-on-surface outline-none"
                        >
                            <option value={ExperienceLevel.ENTRY}>Entry Level</option>
                            <option value={ExperienceLevel.INTERMEDIATE}>Intermediate</option>
                            <option value={ExperienceLevel.EXPERT}>Expert Level</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}