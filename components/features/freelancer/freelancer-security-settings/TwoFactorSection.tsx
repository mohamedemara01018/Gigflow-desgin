import { ShieldCheck, Smartphone } from "lucide-react";

interface TwoFactorSectionProps {
    enabled: boolean;
    onEnable: () => void;
    onDisable: () => void;
}

export function TwoFactorSection({ enabled, onEnable, onDisable }: TwoFactorSectionProps) {
    return (
        <section className="card">
            <div className="flex items-center justify-between">
                <h2 className="text-headline-md text-on-surface">
                    Two-Factor Authentication (2FA)
                </h2>
                <span
                    className={`flex items-center gap-1.5 text-label-md px-3 py-1 rounded-full ${enabled
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                >
                    <ShieldCheck size={13} />
                    {enabled ? "Enabled" : "Disabled"}
                </span>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Add an extra layer of security to your account.
            </p>

            <div className="flex items-center justify-between bg-surface-container-low rounded-md p-4 mt-5">
                <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-primary" />
                    <div>
                        <p className="text-body-md font-medium text-on-surface">
                            Authenticator App
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                            Google Authenticator or Authy
                        </p>
                    </div>
                </div>
                {enabled ? (
                    <button
                        type="button"
                        onClick={onDisable}
                        className="text-label-md text-error hover:underline"
                    >
                        Disable
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onEnable}
                        className="text-label-md text-primary hover:underline"
                    >
                        Enable
                    </button>
                )}
            </div>
        </section>
    );
}