"use client";

import { ShieldCheck } from "lucide-react";

export default function ConversationFooter() {
    return (
        <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant bg-surface-container-low text-body-sm text-on-surface">
            <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-primary" />
                GigFlow SafePay Enabled
            </span>
            <span className="text-label-md text-primary font-medium">100% Secure</span>
        </div>
    );
}