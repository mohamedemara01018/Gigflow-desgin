/* eslint-disable @typescript-eslint/no-explicit-any */

export const authService = {
    register: async (formData: any) => {
        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to register account");
        }

        return data;
    },

    verfiyEmail: async (formData: any) => {
        const response = await fetch(`/api/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to verify email");
        }

        return data;
    },

    resendEmailCode: async (formData: any) => {
        const response = await fetch(`/api/auth/resend-email-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to resend verification code");
        }

        return data;
    },

    login: async (formData: any) => {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to log in");
        }
        return data;
    },

    logout: async () => {
        const response = await fetch(`/api/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to log out");
        }
        return data;
    },

    forgetPassword: async (formData: any) => {
        const response = await fetch(`/api/auth/forget-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to process forgot password request");
        }
        return data;
    },

    resetPassword: async (formData: any) => {
        const response = await fetch(`/api/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to reset password");
        }
        return data;
    },
};