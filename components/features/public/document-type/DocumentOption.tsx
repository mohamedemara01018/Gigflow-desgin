import { BookOpen, CheckCircle2 } from "lucide-react";

function DocumentOption({
    icon: Icon,
    title,
    description,
    selected,
    onSelect,
    className = "",
}: {
    icon: typeof BookOpen;
    title: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`text-left rounded-lg p-5 transition-colors ${selected
                ? "bg-primary/5 border-2 border-primary"
                : "bg-surface-container-low border-2 border-transparent hover:border-outline-variant"
                } ${className}`}
        >
            <div className="flex items-start justify-between">
                <Icon size={24} className="text-primary" />
                {selected && <CheckCircle2 size={20} className="text-primary" />}
            </div>
            <p className="text-headline-md text-[20px]! leading-7! text-on-surface mt-3">
                {title}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1.5">
                {description}
            </p>
        </button>
    );
}

export default DocumentOption