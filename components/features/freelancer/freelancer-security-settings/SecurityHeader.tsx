import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function SecurityHeader() {
    return (
        <section className="rounded-lg bg-surface-container-low p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Security &amp; Identity
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-[520px]">
                        Manage your account security, two-factor authentication, and
                        verify your identity to build trust with clients.
                    </p>
                </div>

                <div className="bg-surface-container-high rounded-lg p-5 w-full md:w-[280px]">
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Overall Status
                    </p>
                    <p className="flex items-center gap-2 text-body-lg font-semibold text-on-surface mt-2">
                        <ShieldCheck size={20} className="text-primary" />
                        Level 3 Verified
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                        All requirements met
                    </p>
                    <div className="flex flex-col gap-1.5 mt-3">
                        {["Email", "Phone", "Government ID"].map((item) => (
                            <span
                                key={item}
                                className="flex items-center gap-2 text-body-sm text-on-surface"
                            >
                                <CheckCircle2 size={15} className="text-primary" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}