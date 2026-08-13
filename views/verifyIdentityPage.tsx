/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import DocumentTypePage from "@/views/DocumentTypePage";
import StepIndicator from "@/components/features/verify-identity/StepIndicator";
import UploadDocumentPage from "@/views/UploadDocumentPage";
import { DocumentType } from "@/utils/enums.utils";
import ReviewDocumentPage from "@/views/ReviewDocumentPage";
import { verificationService } from "@/services/verification.service";
import { useDispatch, useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/authSlice";
import FormError from "@/components/ui/FormError";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";



export default function VerifyIdentityPage() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const stp = searchParams.get('step');
    const docType = searchParams.get('document-type');
    const me = useSelector(selectMeSlice).me

    const [selected, setSelected] = useState<string>(docType || DocumentType.PASSPORT);
    const [step, setStep] = useState(Number(stp) || 1);
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notesError, setNotesError] = useState(false);
    const dispatch: AppDispatch = useDispatch();

    const handleNextStep = () => {
        setStep(step + 1)
        router.push(`/verify-identity?step=${step + 1}&document-type=${selected}`)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
        router.push(`/verify-identity?step=${step - 1}&document-type=${selected}`)
    }

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }))
    }

    const handleVerify = async () => {
        try {
            if (!me?._id) {
                setError('user not found')
                handleAddToastification('user not found', "warning", 5000);

                return
            }
            if (!selected) {
                setError('you must select your document')
                handleAddToastification('you must select your document', "warning", 5000);
                return
            }
            if (notes.length == 0) {
                setNotesError(true)
                handleAddToastification('please provide your notes', "warning", 5000);
                return
            }
            setLoading(true)
            const createdVerification = await verificationService.createVerification({
                "user": me?._id,
                "documentType": selected,
                "notes": notes
            })
            handleAddToastification(createdVerification.message, "success", 5000);
            window.location.reload();
            console.log('createdVerification', createdVerification)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className=" bg-surface min-h-screen py-12">
            <div className="text-center max-w-160 mx-auto">
                <h1 className="text-display-lg text-on-surface">
                    Verify Your Identity
                </h1>
                <p className="text-body-lg text-on-surface-variant mt-4">
                    To ensure trust and security on GigFlow, we need to verify your
                    identity. This process usually takes less than 2 minutes.
                </p>
            </div>

            <StepIndicator current={step} />
            <div className="pt-16 wrapper">
                <FormError error={error} />
            </div>
            {
                step == 1 && <DocumentTypePage selected={selected} setSelected={setSelected} />
            }

            {
                step == 2 && <UploadDocumentPage selected={selected} />
            }

            {
                step == 3 && <ReviewDocumentPage documentType={selected} notes={notes} setNotes={setNotes} notesError={notesError} setNotesError={setNotesError} imgs={['https://images.pexels.com/photos/7108126/pexels-photo-7108126.jpeg', 'https://images.pexels.com/photos/7108126/pexels-photo-7108126.jpeg']} />
            }

            <div className="max-w-160 m-auto py-10 relative ">
                {step > 1 && <button
                    onClick={handlePrevStep}
                    className="absolute left-0 flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity cursor-pointer">
                    <ArrowLeft size={18} />
                    Back
                </button>}
                {step < 3 && <button
                    onClick={handleNextStep}
                    className="absolute right-0 flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity cursor-pointer">
                    Continue
                    <ArrowRight size={18} />
                </button>}
                {step == 3 && <button
                    disabled={loading}
                    onClick={handleVerify}
                    className={`absolute right-0 flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity  ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    {loading ? <Loader2 /> : 'Verify'}
                    <ArrowRight size={18} />
                </button>}
            </div>
        </main >
    );
}

