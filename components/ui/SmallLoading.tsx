'use client'

import { Loader2 } from "lucide-react"


function SmallLoading() {
    return (
        <div className="flex min-h-40 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
}

export default SmallLoading