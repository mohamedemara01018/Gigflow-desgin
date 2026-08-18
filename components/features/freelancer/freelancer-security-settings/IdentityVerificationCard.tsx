import SmallLoading from "@/components/ui/SmallLoading";
import { IVerificationRequest, verificationService } from "@/services/verification.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { formatDateTime } from "@/utils/functions.utils";
import { Briefcase, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function IdentityVerificationCard() {

    const [verification, setVerification] = useState<IVerificationRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const me = useSelector(selectMeSlice).me;

    const getVerificationByUserId = async () => {
        try {
            setLoading(true)
            if (!me?._id) {
                return;
            }
            const verification = await verificationService.getVerificationByUserId(me?._id as string);
            console.log('verification', verification)
            setVerification(verification)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getVerificationByUserId()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) {
        return <SmallLoading />
    }
    return (
        <section className="card">
            <h2 className="text-headline-md !text-[18px] !leading-6 text-on-surface">
                Identity Verification
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Verified freelancers get 3x more profile views.
            </p>

            <div className="flex items-center gap-3 bg-surface-container-low rounded-md p-4 mt-4">
                <span className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Briefcase size={18} />
                </span>
                <div>
                    <p className="text-body-md font-medium text-on-surface">
                        Government ID
                    </p>
                    <p className="text-body-sm text-primary">Verified</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Type
                    </p>
                    <p className="text-body-md text-on-surface mt-1">{verification?.documentType}</p>
                </div>
                <div>
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Verified On
                    </p>
                    <p className="text-body-md text-on-surface mt-1">{formatDateTime(String(verification?.createdAt)).date}</p>
                </div>
            </div>
        </section>
    );
}