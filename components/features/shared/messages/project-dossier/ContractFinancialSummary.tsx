'use client';

import { ShieldCheck } from "lucide-react";
import { IContract } from "@/services/contract.service";

interface ContractFinancialSummaryProps {
    contract: IContract;
    isHourly: boolean;
}

const money = (n: number = 0) =>
    `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function ContractFinancialSummary({ contract, isHourly }: ContractFinancialSummaryProps) {
    const total = contract.totalAmount || 0;
    const feePercent = 10;
    const fee = (total * feePercent) / 100;
    const net = total - fee;

    return (
        <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">
                    {isHourly ? "Estimated Total" : "Gross Total"}
                </span>
                <span className="text-on-surface">{money(total)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Service Fee ({feePercent}%)</span>
                <span className="text-on-surface">-{money(fee)}</span>
            </div>
            <div className="flex justify-between text-body-md font-semibold pt-1 border-t border-border">
                <span className="text-on-surface">Net Earnings</span>
                <span className="text-primary">{money(net)}</span>
            </div>

            <div className="flex items-center gap-2 text-body-xs text-on-surface-variant bg-surface-container p-2.5 rounded-lg mt-1 border border-border/50">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>Protected by Escrow Payment Assurance</span>
            </div>
        </div>
    );
}