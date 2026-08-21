'use client'

import { IProfile } from "@/services/profile.service";

function StatsSection({ profile }: { profile: IProfile }) {
    console.log(profile)
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Job Success", value: profile.successScore, bar: true },
                { label: "Total Earnings", value: `$${profile.totalEarnings}k+`, bar: false },
                { label: "Completed Jobs", value: profile.completedJobs, bar: false },
                { label: "Total Hours", value: profile.totalHours, bar: false }
            ].map((stat, i) => (
                <div
                    key={i}
                    className="card border border-outline-variant p-4 rounded-xl hover:border-primary/30 transition-all cursor-default"
                    style={{ boxShadow: 'var(--shadow-level-2)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-level-3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-level-2)'; }}
                >
                    <p className="text-on-surface-variant text-[12px] leading-4 font-['Geist'] font-semibold uppercase tracking-wider">{stat.label}</p>
                    {stat.bar ? (
                        <div className="flex items-end gap-2 mt-2">
                            <h3 className="font-['Geist'] font-bold text-[48px] leading-14 text-primary">{stat.value}</h3>
                            <div className="w-full bg-surface-container-high h-1.5 rounded-full mb-1">
                                <div className="bg-primary h-full rounded-full" style={{ width: stat.value }}></div>
                            </div>
                        </div>
                    ) : (
                        <h3 className="font-['Geist'] font-bold text-[48px] leading-14 text-on-surface mt-2">{stat.value}</h3>
                    )}
                </div>
            ))}
        </section >
    )
}

export default StatsSection

