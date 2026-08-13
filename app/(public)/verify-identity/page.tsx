/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import FormError from '@/components/ui/FormError'
import Loading from '@/components/ui/Loading'
import { IverificationServiceData, verificationService } from '@/services/verification.service'
import { selectMeSlice } from '@/store/slices/authSlice'
import { VerificationStatus } from '@/utils/enums.utils'
import VerificationInProgressPage from '@/views/verificationInProgress'
import VerifyIdentityPage from '@/views/verifyIdentityPage'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function page() {

    const [verification, setVerification] = useState<IverificationServiceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const me = useSelector(selectMeSlice).me;
    const router = useRouter();

    const getVerificationByUserId = async () => {
        try {
            setLoading(true)
            if (!me?._id) {
                return;
            }
            const verification = await verificationService.getVerificationByUserId(me?._id as string);
            console.log('verification', verification)
            setVerification(verification)
            router.replace('/')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getVerificationByUserId()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) {
        return <Loading />
    }

    return <div>
        <FormError error={error} />
        {
            verification?.status == VerificationStatus.PENDING
                ? <VerificationInProgressPage verification={verification!} />
                : <VerifyIdentityPage />
        }
    </div>


}

export default page