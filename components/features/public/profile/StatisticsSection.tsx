import { Star, TrendingUp } from 'lucide-react'


function StatisticsSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border border-outline-variant rounded-xl relative overflow-hidden group" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
                <h4 className="text-[14px] leading-[20px] font-['Geist'] font-medium text-on-surface-variant uppercase mb-4">Profile Views (Last 30 Days)</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-on-surface font-['Geist']">1,482</span>
                    <span className="text-primary text-[12px] leading-[16px] font-['Geist'] font-bold flex items-center">
                        <TrendingUp size={16} /> 12%
                    </span>
                </div>
                <div className="flex items-end gap-1 mt-6 h-12">
                    {['40%', '60%', '35%', '80%', '95%', '70%', '100%'].map((h, i, arr) => (
                        <div key={i} className={`flex-1 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer ${i === arr.length - 1 || i === arr.length - 2 ? 'bg-primary' : i === arr.length - 3 ? 'bg-primary/40' : 'bg-primary/20'}`} style={{ height: h }}></div>
                    ))}
                </div>
            </div>
            <div className="card border border-outline-variant rounded-xl relative overflow-hidden group" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
                <h4 className="text-[14px] leading-[20px] font-['Geist'] font-medium text-on-surface-variant uppercase mb-4">Client Satisfaction</h4>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <span className="font-bold text-[18px] leading-[28px] font-['Inter'] text-on-surface">5.0</span>
                </div>
                <p className="text-[14px] leading-[20px] font-['Inter'] text-on-surface-variant">&quot;Alex is one of the top developers we&apos;ve worked with. Communication is 10/10.&quot;</p>
                <p className="text-[12px] leading-[16px] font-['Geist'] font-bold mt-2 text-on-surface">— TechFlow CEO</p>
            </div>
        </section>
    )
}

export default StatisticsSection