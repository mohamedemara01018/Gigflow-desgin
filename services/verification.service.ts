/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/utils/constant.utils";

export interface IverificationServiceResponse {
    message: string,
    data: {
        verification: {
            _id: string
            documentType: string,
            notes: string
            rejectionReason: string
            reviewedAt: string
            reviewedBy: string
            status: string
            submittedAt: string
        }
    }

}

export interface IverificationServiceData {
    _id: string
    documentType: string,
    notes: string
    rejectionReason: string
    reviewedAt: string
    reviewedBy: string
    status: string
    submittedAt: string
}


export const verificationService = {
    createVerification: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/verifiction`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when verification process')
        }
        return data
    },

    getVerificationByUserId: async (userId: string) => {
        const response = await fetch(`${BASE_URL}/api/verifiction/user/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data: IverificationServiceResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong ')
        }
        return data.data.verification
    }
}