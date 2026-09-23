'use client'

import { Clock, Tag, Info, Users, Zap } from "lucide-react";
import { ICreateJobDto } from "@/services/jobs.service";
import { JobType } from "@/utils/enums.utils";

interface StepProps {
    formData: ICreateJobDto;
    updateForm: (patch: Partial<ICreateJobDto>) => void;
}

const PAYMENT_TABS: { id: JobType; label: string; icon: typeof Clock }[] = [
    { id: JobType.HOURLY, label: "Hourly Rate", icon: Clock },
    { id: JobType.FIXED, label: "Fixed Price Project", icon: Tag },
];

export default function BudgetTermsStep({ formData, updateForm }: StepProps) {
    const isFeatured = Boolean((formData as ICreateJobDto & { featured?: boolean }).featured);

    const toggleFeatured = () => {
        updateForm({ featured: !isFeatured } as Partial<ICreateJobDto>);
    };

    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-primary" />
                3. Budget & Payment Terms
            </h2>

            {/* Payment Type Selection */}
            <div className="mt-6 inline-flex bg-surface-container border border-outline-variant rounded-md p-1">
                {PAYMENT_TABS.map(({ id, label, icon: Icon }) => {
                    const active = formData.type === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => updateForm({ type: id })}
                            className={`flex items-center gap-2 text-label-md rounded px-4 py-2 transition-colors cursor-pointer ${active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Hourly vs Fixed Rate Inputs */}
            {formData.type === JobType.HOURLY ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div>
                        <label htmlFor="hourlyRateFrom" className="text-label-md text-on-surface">
                            Minimum Hourly Rate ($/hr)
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                            <input
                                id="hourlyRateFrom"
                                type="number"
                                min={0}
                                value={formData.hourlyRateFrom ?? ""}
                                onChange={(e) =>
                                    updateForm({
                                        hourlyRateFrom: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                placeholder="65"
                                className="w-full bg-surface-container border border-outline-variant rounded-md pl-8 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="hourlyRateTo" className="text-label-md text-on-surface">
                            Maximum Hourly Rate ($/hr)
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                            <input
                                id="hourlyRateTo"
                                type="number"
                                min={0}
                                value={formData.hourlyRateTo ?? ""}
                                onChange={(e) =>
                                    updateForm({
                                        hourlyRateTo: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                placeholder="95"
                                className="w-full bg-surface-container border border-outline-variant rounded-md pl-8 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-6">
                    <label htmlFor="budget" className="text-label-md text-on-surface">
                        Total Project Budget ($)
                    </label>
                    <div className="relative mt-2 max-w-xs">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                        <input
                            id="budget"
                            type="number"
                            min={0}
                            value={formData.budget || ""}
                            onChange={(e) =>
                                updateForm({
                                    budget: e.target.value === "" ? 0 : Number(e.target.value),
                                })
                            }
                            placeholder="8,500"
                            className="w-full bg-surface-container border border-outline-variant rounded-md pl-8 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>
            )}

            <div className="flex items-start gap-2 mt-4 text-body-sm text-on-surface-variant">
                <Info size={15} className="shrink-0 mt-0.5" />
                <p>
                    Senior talent in this category typically bill between $65 – $110/hr on GigFlow, based on recent hires with a similar scope.
                </p>
            </div>

            {/* Proposal Cap Section */}
            <div className="mt-6 border border-outline-variant rounded-md p-4 bg-surface-container">
                <div className="flex items-center gap-2">
                    <Users size={15} className="text-on-surface-variant" />
                    <label htmlFor="maxProposals" className="text-label-md text-on-surface">
                        Max Proposal Cap
                    </label>
                </div>
                <div className="flex items-center justify-between gap-4 mt-2">
                    <p className="text-body-sm text-on-surface-variant">
                        Automatically pause incoming proposals when target is reached to save review time.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                        <input
                            id="maxProposals"
                            type="number"
                            min={0}
                            value={formData.maxProposals ?? ""}
                            onChange={(e) =>
                                updateForm({
                                    maxProposals: e.target.value === "" ? null : Number(e.target.value),
                                })
                            }
                            placeholder="30"
                            className="w-20 bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-body-md text-on-surface text-center focus:outline-none focus:border-primary transition-colors"
                        />
                        <span className="text-body-sm text-on-surface-variant">candidates</span>
                    </div>
                </div>
            </div>

            {/* Feature Toggle Section */}
            <div className="mt-4 border border-outline-variant rounded-md p-4 bg-surface-container flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary-container/15 text-primary shrink-0">
                    <Zap size={16} />
                </span>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-label-md text-on-surface">Feature This Job Post</p>
                        <span className="text-label-sm text-on-primary bg-primary px-2 py-0.5 rounded-full">3x Faster Hires</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Pinned to the top of talent search results and highlighted with a neon badge.
                    </p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isFeatured}
                    onClick={toggleFeatured}
                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer ${isFeatured ? "bg-primary" : "bg-surface-variant"
                        }`}
                >
                    <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-surface-container-lowest transition-transform ${isFeatured ? "translate-x-5.5" : "translate-x-0.5"
                            }`}
                    />
                </button>
            </div>
        </section>
    );
}