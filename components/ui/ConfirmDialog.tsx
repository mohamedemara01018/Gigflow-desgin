import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    tone?: "danger" | "default";
    confirmingCount?: number;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    tone = "danger",
    confirmingCount,
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <button
                aria-label="Close dialog"
                onClick={onCancel}
                className="absolute inset-0 bg-inverse-surface/40"
            />

            <div className="relative bg-surface-container-high rounded-lg shadow-(--shadow-level-3) w-full max-w-110 p-6">
                <button
                    onClick={onCancel}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <X size={18} />
                </button>

                <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${tone === "danger"
                        ? "bg-error-container text-on-error-container"
                        : "bg-primary/10 text-primary"
                        }`}
                >
                    <AlertTriangle size={22} />
                </span>

                <h2 className="text-headline-md text-on-surface mt-4">{title}</h2>
                <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    {description}
                    {confirmingCount && confirmingCount > 1 && (
                        <span className="block mt-1 font-medium text-on-surface">
                            This will affect {confirmingCount} selected users.
                        </span>
                    )}
                </p>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="text-label-md text-on-surface border border-outline-variant rounded-md px-5 py-2.5 hover:bg-surface-container-low transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`text-label-md rounded-md px-5 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-60 ${tone === "danger"
                            ? "bg-error text-on-error"
                            : "bg-primary text-on-primary"
                            }`}
                    >
                        {isLoading ? "Please wait…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;