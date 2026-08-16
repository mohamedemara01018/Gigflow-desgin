import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

type StatCardVariant = "primary" | "tertiary" | "neutral" | "error-soft" | "tertiary-soft";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    variant?: StatCardVariant;
    trend?: {
        label: string;
        positive: boolean;
    };
}

const VARIANT_CLASSES: Record<StatCardVariant, string> = {
    primary: "bg-primary text-on-primary",
    tertiary: "bg-tertiary text-on-tertiary",
    neutral: "bg-surface-container-high text-on-surface border border-outline-variant",
    "error-soft": "bg-error-container text-on-error-container",
    "tertiary-soft": "bg-tertiary/10 text-tertiary border border-tertiary/20",
};

const MUTED_ICON_CLASSES: Record<StatCardVariant, string> = {
    primary: "text-on-primary/70",
    tertiary: "text-on-tertiary/70",
    neutral: "text-on-surface-variant",
    "error-soft": "text-on-error-container/70",
    "tertiary-soft": "text-tertiary/70",
};

const LABEL_CLASSES: Record<StatCardVariant, string> = {
    primary: "text-on-primary/90",
    tertiary: "text-on-tertiary/90",
    neutral: "text-on-surface-variant",
    "error-soft": "text-on-error-container/90",
    "tertiary-soft": "text-tertiary/80",
};

function StatCard({ label, value, icon: Icon, variant = "neutral", trend }: StatCardProps) {
    return (
        <div className={`rounded-lg p-5 flex flex-col justify-between min-h-[130px] ${VARIANT_CLASSES[variant]}`}>
            <div className="flex items-start justify-between">
                <span className={`text-body-sm font-medium ${LABEL_CLASSES[variant]}`}>
                    {label}
                </span>
                <Icon size={20} className={MUTED_ICON_CLASSES[variant]} />
            </div>

            <div>
                <p className="text-headline-lg !text-[28px] !leading-9 font-semibold mt-2">
                    {value}
                </p>
                {trend && (
                    <span
                        className={`flex items-center gap-1 text-body-sm mt-1 ${LABEL_CLASSES[variant]}`}
                    >
                        {trend.positive ? (
                            <TrendingUp size={14} />
                        ) : (
                            <TrendingDown size={14} />
                        )}
                        {trend.label}
                    </span>
                )}
            </div>
        </div>
    );
}

export default StatCard;