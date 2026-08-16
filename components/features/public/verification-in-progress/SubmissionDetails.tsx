import { IVerificationRequest } from "@/services/verification.service";
import { formatDateTime } from "@/utils/functions.utils";
import { Briefcase } from "lucide-react";

function SubmissionDetails({ verification }: { verification: IVerificationRequest }) {
    return (
        <section className="card flex gap-4">
            <span className="w-11 h-11 rounded-md bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                <Briefcase size={20} />
            </span>
            <div>
                <h2 className="text-headline-md text-on-surface">
                    Submission Details
                </h2>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
                    <div>
                        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                            Document Type
                        </p>
                        <p className="text-body-md font-medium text-on-surface mt-1">
                            {verification.documentType}
                        </p>
                    </div>
                    <div>
                        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                            Submitted On
                        </p>
                        <div className="flex justify-start items-center gap-2 flex-wrap">
                            <p className="text-body-md font-medium text-on-surface mt-1">
                                {formatDateTime(verification.submittedAt).date}
                            </p>
                            <span>|</span>
                            <p className="text-body-md font-medium text-on-surface mt-1">
                                {formatDateTime(verification.submittedAt).time}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                            Reference ID
                        </p>
                        <p className="text-body-md font-medium text-on-surface mt-1">
                            {verification._id}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SubmissionDetails