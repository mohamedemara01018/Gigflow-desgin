/* eslint-disable react-hooks/refs */
'use client';

import { useInView } from '../../../../hooks/Useinview'
import { steps } from './Data';

const dashboardWidgets: [string, string, string][] = [
    ['Active Jobs', '12', '+3'],
    ['Proposals', '47', '+8'],
    ['Earned', '$8.4K', '+12%'],
];

const activity = [
    { text: 'New proposal from Alex R.', time: '2m ago', dot: 'bg-primary' },
    { text: 'Milestone #2 released — $2,400', time: '1h ago', dot: 'bg-secondary' },
    { text: 'Contract signed with TechCorp', time: '3h ago', dot: 'bg-tertiary' },
];

export default function Workflow() {
    const workflowAnim = useInView();

    return (
        <section id="workflow" className="py-24 bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Steps */}
                <div
                    ref={workflowAnim.ref}
                    className={`flex flex-col gap-2 transition-all duration-700 ${workflowAnim.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                >
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">How It Works</p>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-on-surface tracking-tight mb-10">
                        The GigFlow Workflow
                    </h2>
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex gap-5 group">
                            {/* Connector */}
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest border-2 border-primary/20 group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center font-display font-black text-primary text-sm transition-all duration-200 shadow-sm">
                                    {s.num}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-0.5 h-12 bg-linear-to-b from-primary/30 to-transparent mt-1" />
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 pt-2 pb-10">
                                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                                    {s.title}
                                </h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard mockup */}
                <div className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent rounded-3xl blur-3xl" />
                    <div className="relative glass-card border border-outline-variant rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
                        {/* Fake browser bar */}
                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex-1 bg-surface-container-low rounded-lg px-3 py-1 text-xs text-outline">
                                app.gigflow.io/dashboard
                            </div>
                        </div>
                        {/* Dashboard widgets */}
                        <div className="grid grid-cols-3 gap-3">
                            {dashboardWidgets.map(([label, val, delta]) => (
                                <div key={label} className="bg-surface-container-low rounded-xl p-3">
                                    <p className="text-xs text-on-surface-variant">{label}</p>
                                    <p className="text-xl font-black text-on-surface mt-0.5">{val}</p>
                                    <p className="text-xs text-primary font-semibold">{delta}</p>
                                </div>
                            ))}
                        </div>
                        {/* Activity list */}
                        <div className="flex flex-col gap-2">
                            {activity.map((item) => (
                                <div key={item.text} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container-low transition-colors">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                                    <span className="text-sm text-on-surface-variant flex-1">{item.text}</span>
                                    <span className="text-xs text-outline shrink-0">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}