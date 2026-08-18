import { AlertTriangle } from "lucide-react";

interface DangerZoneCardProps {
    onDeactivate: () => void;
    onDelete: () => void;
}

export function DangerZoneCard({ onDeactivate, onDelete }: DangerZoneCardProps) {
    return (
        <section className="border border-error/30 bg-error-container/30 rounded-lg p-5">
            <span className="flex items-center gap-2 text-body-md font-semibold text-error">
                <AlertTriangle size={18} />
                Danger Zone
            </span>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Irreversible actions related to your account data.
            </p>

            <div className="flex items-center justify-between mt-4">
                <div>
                    <p className="text-body-sm font-medium text-on-surface">
                        Deactivate Account
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                        Temporarily hide your profile. You can reactivate later.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDeactivate}
                    className="shrink-0 border border-outline-variant text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-low transition-colors"
                >
                    Deactivate
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>
                    <p className="text-body-sm font-medium text-error">
                        Delete Account
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                        Permanently remove all data. This cannot be undone.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    className="shrink-0 bg-error text-on-error text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
                >
                    Delete
                </button>
            </div>
        </section>
    );
}