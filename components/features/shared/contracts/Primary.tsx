import { LucideIcon } from "lucide-react";

function Primary({
    icon: Icon,
    children,
    onClick,
}: {
    icon?: LucideIcon;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 bg-primary text-on-primary text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
            {children}
            {Icon && <Icon size={13} />}
        </button>
    );
}

export default Primary