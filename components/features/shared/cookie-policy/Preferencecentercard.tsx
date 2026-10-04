'use client'
import { useState } from "react";
import { SlidersHorizontal, Lock } from "lucide-react";
import { PREFERENCE_CATEGORIES } from "./Cookie policy.data"

export default function PreferenceCenterCard() {
    const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(PREFERENCE_CATEGORIES.map((c) => [c.id, c.defaultOn]))
    );

    const toggle = (id: string, locked?: boolean) => {
        if (locked) return;
        setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const rejectAllOptional = () => {
        setPrefs(Object.fromEntries(PREFERENCE_CATEGORIES.map((c) => [c.id, !!c.locked])));
    };

    const acceptAll = () => {
        setPrefs(Object.fromEntries(PREFERENCE_CATEGORIES.map((c) => [c.id, true])));
    };

    return (
        <section id="preference-center" className="card border border-primary/20 bg-primary-container/5">
            <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" />
                <p className="text-label-sm text-primary tracking-wide">ACTIVE COOKIE PREFERENCE CENTER</p>
            </div>
            <h2 className="text-headline-md text-on-surface mt-2">Interactive Cookie Preference Center</h2>
            <p className="text-body-sm text-on-surface-variant mt-1.5">
                Configure how our platform uses browser storage and tracking. Your selections are saved locally and
                sync to your GigFlow account on your next sign-in.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {PREFERENCE_CATEGORIES.map((category) => {
                    const on = prefs[category.id];
                    return (
                        <div
                            key={category.id}
                            className="bg-surface-container-lowest border border-outline-variant rounded-md p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="flex items-center gap-1.5 text-body-md text-on-surface">
                                    {category.title}
                                </p>
                                {category.locked ? (
                                    <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant shrink-0">
                                        <Lock size={12} />
                                        Always Active
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={on}
                                        onClick={() => toggle(category.id)}
                                        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors cursor-pointer ${on ? "bg-primary" : "bg-surface-variant"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-surface-container-lowest transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>
                            <p className="text-body-sm text-on-surface-variant mt-1.5">{category.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 mt-5">
                <button
                    onClick={rejectAllOptional}
                    className="text-label-md text-on-surface-variant bg-surface-variant rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Reject All Optional
                </button>
                <button
                    onClick={acceptAll}
                    className="text-label-md text-on-surface-variant bg-surface-variant rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Accept All
                </button>
                <button className="text-label-md text-on-primary bg-primary rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                    Save My Preferences
                </button>
            </div>
        </section>
    );
}