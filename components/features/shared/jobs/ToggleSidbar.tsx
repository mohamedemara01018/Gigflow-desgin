'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { onOpen } from '@/store/slices/toggleSidebarSlice'
import { SlidersHorizontal } from 'lucide-react'
import { useDispatch } from 'react-redux'

function ToggleSidbar() {
    const dispatch = useDispatch()
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div
            onClick={() => dispatch(onOpen())}
            className={`bg-surface-container w-fit p-2 rounded-sm text-on-surface cursor-pointer ${isMobile ? '' : 'hidden'}`}>
            <SlidersHorizontal size={25} />
        </div>
    )
}

export default ToggleSidbar