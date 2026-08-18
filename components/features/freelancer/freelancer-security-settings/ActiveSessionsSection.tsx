import { Smartphone, Laptop, LogOut } from "lucide-react";

export interface Session {
    id: string;
    device: string;
    location: string;
    detail: string;
    current?: boolean;
}

interface ActiveSessionsSectionProps {
    sessions: Session[];
    onLogoutAll: () => void;
}

export function ActiveSessionsSection({ sessions, onLogoutAll }: ActiveSessionsSectionProps) {
    return (
        <section className="card">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-headline-md text-on-surface">Active Sessions</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Devices currently logged into your account.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onLogoutAll}
                    className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                >
                    Log out all other devices
                </button>
            </div>

            <div className="flex flex-col gap-3 mt-5">
                {sessions.map((session) => {
                    const Icon = session.device.includes("iPhone") ? Smartphone : Laptop;
                    return (
                        <div
                            key={session.id}
                            className={`flex items-center justify-between rounded-md p-4 ${session.current
                                    ? "bg-surface-container-low"
                                    : "border border-outline-variant"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className="text-on-surface-variant" />
                                <div>
                                    <span className="flex items-center gap-2">
                                        <p className="text-body-md font-medium text-on-surface">
                                            {session.device}
                                        </p>
                                        {session.current && (
                                            <span className="text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                CURRENT
                                            </span>
                                        )}
                                    </span>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        {session.location} • {session.detail}
                                    </p>
                                </div>
                            </div>
                            {!session.current && (
                                <button
                                    type="button"
                                    aria-label={`Log out ${session.device}`}
                                    className="text-on-surface-variant hover:text-error transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}