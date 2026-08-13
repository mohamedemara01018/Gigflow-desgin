'use client'
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import DocumentTypePage from "@/views/DocumentTypePage";
import StepIndicator from "@/components/features/verify-identity/StepIndicator";
import UploadDocumentPage, { FileSlots } from "@/views/UploadDocumentPage";
import { AttachmentEntityType, DocumentType } from "@/utils/enums.utils";
import ReviewDocumentPage from "@/views/ReviewDocumentPage";
import { verificationService } from "@/services/verification.service";
import { useDispatch, useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/authSlice";
import FormError from "@/components/ui/FormError";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { attachmentService } from "@/services/attachment.service";

export default function VerifyIdentityPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const stepParam = searchParams.get('step');
    const docTypeParam = searchParams.get('document-type');
    const me = useSelector(selectMeSlice).me

    const [selected, setSelected] = useState<string>(docTypeParam || DocumentType.PASSPORT);
    const [step, setStep] = useState(Number(stepParam) || 1);
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notesError, setNotesError] = useState(false);

    const [files, setFiles] = useState<FileSlots>([]);

    const dispatch: AppDispatch = useDispatch();
    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }))
    }

    // Keep local state in sync with the URL, not just on first mount —
    // otherwise browser back/forward silently desyncs step & document type.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(Number(stepParam) || 1);
        setSelected(docTypeParam || DocumentType.PASSPORT);
    }, [stepParam, docTypeParam]);

    const goToStep = (nextStep: number) => {
        router.push(`/verify-identity?step=${nextStep}&document-type=${selected}`)
    }

    const handleNextStep = () => {
        if (step === 2) {
            const hasEmptySlot = files.length === 0 || files.some((file) => !file);
            if (hasEmptySlot) {
                handleAddToastification('Please upload all required document images before continuing.', "warning", 5000);
                return;
            }
        }
        goToStep(step + 1)
    }

    const handlePrevStep = () => {
        goToStep(step - 1)
    }

    const handleVerify = async () => {
        setError('')

        if (!me?._id) {
            setError('User not found')
            handleAddToastification('User not found', "warning", 5000);
            return
        }
        if (!selected) {
            setError('You must select your document type')
            handleAddToastification('You must select your document type', "warning", 5000);
            return
        }
        if (notes.length === 0) {
            setNotesError(true)
            handleAddToastification('Please provide your notes', "warning", 5000);
            return
        }
        if (files.length === 0 || files.some((file) => !file)) {
            handleAddToastification('Please upload all required document images.', "warning", 5000);
            return
        }

        try {
            setLoading(true)

            const createdVerification = await verificationService.createVerification({
                user: me._id,
                documentType: selected,
                notes,
            })

            await attachmentService.createAttachment({
                files,
                entityId: createdVerification.data.verificationRequest._id,
                entityType: AttachmentEntityType.VERIFICATION,
                uploadedBy: me._id,
            })

            handleAddToastification(createdVerification.message, "success", 5000);
            window.location.reload();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong while submitting your verification.';
            setError(message)
            handleAddToastification(message, "warning", 5000);
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="bg-surface min-h-screen py-12">
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

            {step === 1 && <DocumentTypePage selected={selected} setSelected={setSelected} />}

            {step === 2 && <UploadDocumentPage selected={selected} files={files} setFiles={setFiles} />}

            {step === 3 && (
                <ReviewDocumentPage
                    documentType={selected}
                    notes={notes}
                    setNotes={setNotes}
                    notesError={notesError}
                    setNotesError={setNotesError}
                    imgs={['https://images.pexels.com/photos/7108126/pexels-photo-7108126.jpeg', 'https://images.pexels.com/photos/7108126/pexels-photo-7108126.jpeg']}
                />
            )}

            <div className="max-w-160 mx-auto py-10 flex items-center justify-between">
                {step > 1 ? (
                    <button
                        onClick={handlePrevStep}
                        className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                ) : <span />}

                {step < 3 && (
                    <button
                        onClick={handleNextStep}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Continue
                        <ArrowRight size={18} />
                    </button>
                )}

                {step === 3 && (
                    <button
                        disabled={loading}
                        onClick={handleVerify}
                        className={`flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-6 py-3 hover:opacity-90 transition-opacity ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify'}
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>
        </main>
    );
}