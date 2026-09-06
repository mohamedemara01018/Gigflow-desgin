import { CheckCircle2 } from "lucide-react";


interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    badge?: string
}


export const Field: React.FC<FieldProps> = ({
    label,
    badge,
    ...probs
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-body-sm font-medium text-on-surface">{label}</label>
                {badge && (
                    <span className="flex items-center gap-1 text-label-sm text-primary font-medium">
                        <CheckCircle2 size={12} />
                        {badge.toUpperCase()}
                    </span>
                )}
            </div>
            <input
                {...probs}
                disabled={!!badge}
                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
            />
        </div>
    );
}
