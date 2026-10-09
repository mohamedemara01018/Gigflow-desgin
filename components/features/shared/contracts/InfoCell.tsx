import { LucideIcon } from "lucide-react";

function InfoCell({
    leading,
    title,
    sub,
    trailing,
    TrailingIcon,
    onClick,
}: {
    leading: React.ReactNode;
    title: React.ReactNode;
    sub: string;
    trailing: string;
    TrailingIcon: LucideIcon;
    onClick?: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 bg-surface-container rounded-md px-3.5 py-3">
            <div className="flex items-center gap-3 min-w-0">
                {leading}
                <div className="min-w-0">
                    <p className="text-body-sm font-medium text-on-surface truncate">{title}</p>
                    <p className="text-label-sm text-on-surface-variant truncate">{sub}</p>
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary shrink-0 transition-colors cursor-pointer"
            >
                <TrailingIcon size={12} />
                {trailing}
            </button>
        </div>
    );
}
export default InfoCell