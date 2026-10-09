/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/utils/constant.utils"

export const authService = {
    register: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when register')
        }

        return data
    },
    verfiyEmail: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when verify email')
        }

        return data
    },
    resendEmailCode: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/resend-email-code`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when resend code')
        }

        return data
    },
    login: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when login')
        }
        return data
    },
    logout: async () => {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when logout')
        }
        return data
    },
    forgetPassword: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/forget-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when login')
        }
        return data
    },
    resetPassword: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when login')
        }
        return data
    },
}