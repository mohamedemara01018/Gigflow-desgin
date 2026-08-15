import { SearchX, LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    /**
     * "compact" — icon + single line, for use inside a table row or a
     * tight card slot (e.g. `<td colSpan={n}><EmptyState size="compact" .../></td>`).
     * "default" — icon circle + title + description + optional action,
     * for standalone use (empty pages, empty tabs, empty search pages).
     */
    size?: "compact" | "default";
    className?: string;
}

function EmptyState({
    icon: Icon = SearchX,
    title,
    description,
    action,
    size = "default",
    className = "",
}: EmptyStateProps) {
    if (size === "compact") {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-2 min-h-40 text-on-surface-variant ${className}`}
            >
                <Icon size={20} />
                <p className="text-body-md">{title}</p>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col items-center justify-center text-center gap-3 py-14 ${className}`}
        >
            <span className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                <Icon size={24} />
            </span>
            <div>
                <p className="text-body-lg font-medium text-on-surface">{title}</p>
                {description && (
                    <p className="text-body-sm text-on-surface-variant mt-1.5 max-w-90">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

export default EmptyState;