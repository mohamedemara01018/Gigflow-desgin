import { LucideIcon } from "lucide-react";

function KpiCard({
    label,
    value,
    meta,
    icon: Icon,
    progress,
    tone = "primary",
    metaTone = "primary",
}: {
    label: string;
    value: string;
    meta: string;
    icon: LucideIcon;
    progress: number;
    tone?: "primary" | "tertiary";
    metaTone?: "primary" | "muted";
}) {
    const bar = tone === "tertiary" ? "bg-tertiary" : "bg-primary";
    return (
        <div className="card !p-5">
            <span className="flex items-center justify-between text-body-sm text-on-surface-variant">
                {label}
                <Icon size={16} className={tone === "tertiary" ? "text-tertiary" : "text-primary"} />
            </span>
            <div className="flex items-end justify-between mt-2 gap-3">
                <p
                    className={`text-headline-lg !text-[28px] !leading-9 ${tone === "tertiary" ? "text-tertiary" : "text-on-surface"
                        }`}
                >
                    {value}
                </p>
                <span
                    className={`text-label-sm pb-1 ${metaTone === "primary" ? "text-primary" : "text-on-surface-variant"
                        }`}
                >
                    {meta}
                </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container-high mt-3 overflow-hidden">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
        </div>
    );
}

export default KpiCard