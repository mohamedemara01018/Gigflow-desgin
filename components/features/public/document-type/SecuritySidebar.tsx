import { Fingerprint, Lock, ShieldCheck } from "lucide-react";

function SecuritySidebar() {
    return (
        <aside className="flex flex-col gap-6">
            <section className="bg-surface-container-low rounded-lg p-6">
                <div className="flex items-center gap-2 text-on-surface">
                    <ShieldCheck size={22} className="text-primary" />
                    <h2 className="text-headline-md text-[20px]! leading-7!">
                        Secure &amp; Private
                    </h2>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                    We use bank-level encryption to protect your sensitive documents.
                    Your ID is used strictly for verification and is never shared
                    publicly on your profile.
                </p>
                <span className="flex items-center gap-2 text-body-sm text-on-surface font-medium mt-4">
                    <Lock size={16} className="text-primary" />
                    End-to-end Encrypted
                </span>
            </section>

            <section className="relative bg-surface-container-low rounded-lg h-56 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-20 h-20 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-(--shadow-level-2) ring-8 ring-primary/10">
                        <Fingerprint size={32} className="text-primary" />
                    </span>
                </div>
            </section>
        </aside>
    );
}

export default SecuritySidebar