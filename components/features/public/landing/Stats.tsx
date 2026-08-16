/* eslint-disable react-hooks/refs */
'use client';

import { useInView } from '../../../../hooks/Useinview'
import { stats } from './Data';

export default function Stats() {
    const statsAnim = useInView();

    return (
        <section className="py-20 bg-surface border-y border-outline-variant">
            <div
                ref={statsAnim.ref}
                className={`max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center transition-all duration-700 ${statsAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                {stats.map((s, i) => (
                    <div key={s.label} style={{ transitionDelay: `${i * 120}ms` }} className="flex flex-col gap-2 stat-animate">
                        <p className="text-5xl md:text-6xl font-display font-black text-gradient leading-none">{s.value}</p>
                        <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}