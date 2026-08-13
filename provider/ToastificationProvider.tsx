import ToastificationContainer from '@/components/ui/toastification/ToastificationContainer'
import React from 'react'

function ToastificationProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
            <ToastificationContainer />
        </>
    )
}

export default ToastificationProvider