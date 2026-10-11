'use client'
import ToastificationItem from './NotificationItem'
import { useDispatch, useSelector } from 'react-redux'
import { removeToastify, selectToastificationSlice } from '@/store/slices/toastificationSlice'
import { AppDispatch } from '@/store/store';

function ToastificationContainer() {
    const dispatch: AppDispatch = useDispatch();
    const toastifications = useSelector(selectToastificationSlice);

    const handleRemoveToastify = (id: string) => {
        dispatch(removeToastify({ id }))
    }

    return (
        <div className="
                fixed
                top-4
                right-4
                z-9999
                flex
                w-[calc(100%-2rem)]
                max-w-sm
                flex-col
                gap-3
                pointer-events-none
            "
            aria-live="polite"
            aria-atomic="false"
        >
            {
                toastifications.map((toast) => {
                    return <div key={toast.id} >
                        <ToastificationItem toastification={toast} onRemove={handleRemoveToastify} />
                    </div>
                })
            }
        </div>
    )
}

export default ToastificationContainer