"use client";

import { ShieldCheck } from "lucide-react";

export default function SecurityComplianceSection() {
    return (
        <section className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 text-on-surface">
                <ShieldCheck size={22} className="text-primary" />
                <h2 className="text-headline-sm font-semibold text-on-surface">
                    Security &amp; Encryption
                </h2>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                All transactions and payout operations are encrypted with 256-bit AES encryption. GigFlow adheres to
                strict PCI-DSS Level 1 compliance standards through Stripe infrastructure. Payout transfers are directly
                facilitated via Stripe Connect Express.
            </p>
        </section>
    );
}