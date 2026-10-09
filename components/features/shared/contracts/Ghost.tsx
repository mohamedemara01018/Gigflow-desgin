import { LucideIcon } from "lucide-react";

function Ghost({
    icon: Icon,
    children,
    danger,
    onClick,
}: {
    icon?: LucideIcon;
    children: React.ReactNode;
    danger?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 text-label-md rounded-md px-3.5 py-2 transition-colors cursor-pointer ${danger
                ? "bg-error/10 text-error hover:bg-error/15"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
        >
            {Icon && <Icon size={13} />}
            {children}
        </button>
    );
}

export default Ghost