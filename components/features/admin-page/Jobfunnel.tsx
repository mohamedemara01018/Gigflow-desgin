interface FunnelStage {
    label: string;
    percent: number;
    colorClass: string;
}

const STAGES: FunnelStage[] = [
    { label: "Open", percent: 45, colorClass: "bg-primary" },
    { label: "In Progress", percent: 30, colorClass: "bg-secondary" },
    { label: "Completed", percent: 20, colorClass: "bg-primary" },
    { label: "Cancelled", percent: 5, colorClass: "bg-error" },
];

interface JobFunnelProps {
    newUsers?: number;
    suspendedUsers?: number;
}

function JobFunnel({ newUsers = 342, suspendedUsers = 12 }: JobFunnelProps) {
    return (
        <section className="card flex flex-col">
            <h2 className="text-headline-md text-on-surface">Job Funnel</h2>

            <div className="flex flex-col gap-5 mt-6">
                {STAGES.map(({ label, percent, colorClass }) => (
                    <div key={label}>
                        <div className="flex items-center justify-between text-body-sm">
                            <span className="text-on-surface font-medium">{label}</span>
                            <span className="text-on-surface-variant">{percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${colorClass}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between bg-surface-container-lowest rounded-md px-4 py-3.5 mt-6">
                <span className="text-body-sm text-on-surface-variant">
                    New Users vs Suspended
                </span>
                <span className="flex items-center gap-1.5 text-body-md font-semibold">
                    <span className="text-primary">+{newUsers}</span>
                    <span className="text-on-surface-variant font-normal">/</span>
                    <span className="text-error">-{suspendedUsers}</span>
                </span>
            </div>
        </section>
    );
}

export default JobFunnel;