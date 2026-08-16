import EmptyState from '@/components/ui/Emptystate'
import { IProfile } from '@/services/profile.service'
import { Pencil } from 'lucide-react'


function OverviewSection({ profile }: { profile: IProfile }) {
    return (
        <section className="card border border-outline-variant rounded-xl p-8" style={{ boxShadow: 'var(--shadow-level-2)' }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface">Professional Overview</h2>
                <button className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"><Pencil size={20} /></button>
            </div>

            {
                profile.overview ? <div className="space-y-4 text-on-surface-variant leading-relaxed text-[16px] font-['Inter']">
                    <p>I am a highly skilled Senior Full-stack Developer with over 8 years of experience building scalable web applications and enterprise solutions. My expertise lies in architecting robust backends with Node.js and Go, paired with high-performance, pixel-perfect frontends using React and Next.js.</p>
                    <p>Throughout my career, I&apos;ve helped startups and established enterprises alike deliver mission-critical features, optimize infrastructure costs, and lead engineering teams toward technical excellence. I specialize in turning complex requirements into elegant, maintainable codebases.</p>
                    <p>Currently focusing on modern AI integration and cloud-native architectures.</p>
                </div> :
                    <EmptyState title="No overview added yet." size="compact" />
            }

        </section>
    )
}

export default OverviewSection

