'use client'
import {
    CircleEllipsis,
} from "lucide-react";
import VerificationTimeline from "@/components/features/verification-in-progress/VerificationTimeline";
import SubmissionDetails from "@/components/features/verification-in-progress/SubmissionDetails";
import FaqAccordion from "./FaqAccordion";
import { IverificationServiceData } from "@/services/verification.service";
import { VerificationStatus } from "@/utils/enums.utils";




export default function VerificationInProgressPage({ verification }: { verification: IverificationServiceData }) {
    return (
        <main className="bg-surface min-h-screen">
            <div className="bg-surface-container-low py-16">
                <div className="wrapper text-center">
                    <span className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <span className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center">
                            <CircleEllipsis size={26} />
                        </span>
                    </span>

                    <h1 className="text-display-lg text-on-surface mt-6">
                        Verification in Progress
                    </h1>
                    <p className="text-body-lg text-on-surface-variant mt-4">
                        We&apos;re currently reviewing your submitted documents. This process
                        ensures the safety and security of the GigFlow marketplace for
                        everyone.
                    </p>
                </div>
            </div>

            <div className="px-6 md:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-300 mx-auto">
                    <div className="flex flex-col gap-6">
                        <VerificationTimeline status={verification.status as VerificationStatus} />
                        <SubmissionDetails verification={verification} />
                    </div>

                    <aside>
                        <FaqAccordion />
                    </aside>
                </div>
            </div>
        </main>
    );
}