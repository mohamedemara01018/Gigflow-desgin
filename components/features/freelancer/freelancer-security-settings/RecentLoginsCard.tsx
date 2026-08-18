export interface LoginRecord {
    location: string;
    detail: string;
    when: string;
    time: string;
}

interface RecentLoginsCardProps {
    logins: LoginRecord[];
}

export function RecentLoginsCard({ logins }: RecentLoginsCardProps) {
    return (
        <section className="card">
            <h2 className="text-headline-md !text-[18px] !leading-6 text-on-surface">
                Recent Logins
            </h2>
            <div className="flex flex-col divide-y divide-outline-variant mt-3">
                {logins.map((login, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-body-sm font-medium text-on-surface">
                                {login.location}
                            </p>
                            <p className="text-label-sm text-on-surface-variant">
                                {login.detail}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-body-sm text-on-surface">{login.when}</p>
                            <p className="text-label-sm text-on-surface-variant">
                                {login.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" className="text-label-md text-primary hover:underline mt-3">
                View Full History
            </button>
        </section>
    );
}