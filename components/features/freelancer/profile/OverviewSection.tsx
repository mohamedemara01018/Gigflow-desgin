import EmptyState from '@/components/ui/Emptystate'
import ReadOnlyOverview from '@/components/ui/ReadOnlyOverview'
import { IProfile } from '@/services/profile.service'
import { IUserListItem } from '@/services/user.service'
import { UserRole } from '@/utils/enums.utils'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

function OverviewSection({ profile, me }: { profile: IProfile, me: IUserListItem }) {
    const router = useRouter();
    return (
        <section className="card border border-outline-variant rounded-xl p-8 w-full" style={{ boxShadow: 'var(--shadow-level-2)' }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface">Professional Overview</h2>
                {
                    me.role == UserRole.FREELANCER && <button
                        onClick={() => router.push('/settings/profile')}
                        className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"><Pencil size={20} /></button>
                }
            </div>

            {
                profile.overview ? (
                    <div className="w-full">
                        <ReadOnlyOverview content={profile.overview} tabletWidth='83vw' width='55vw' />
                    </div>
                ) : (
                    <EmptyState title="No overview added yet." size="compact" />
                )
            }
        </section>
    )
}

export default OverviewSection