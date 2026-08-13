import { VerificationStatus } from "@/utils/enums.utils";
import { CheckCircle2 } from "lucide-react";




function TimelineDot({ status }: { status: VerificationStatus }) {
    if (status === VerificationStatus.PENDING) {
        return (
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
            </span>
        );
    }
    if (status === VerificationStatus.IN_REVIEW) {
        return (
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="w-3 h-3 rounded-full bg-primary" />
            </span>
        );
    }
    return (
        <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-outline-variant" />
        </span>
    );
}

export default TimelineDot