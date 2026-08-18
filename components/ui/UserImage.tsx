import { getInitials } from '@/utils/functions.utils'
import React from 'react'


interface UserImageProbs {
    avatarUrl: string,
    firstName: string,
    lastName: string
    className: string
}

function UserImage({ avatarUrl, firstName, lastName, className }: UserImageProbs) {
    return (
        <div
            className={`${className} rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all`}
        >
            {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
            ) : (
                <span className="w-full h-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-semibold">
                    {getInitials(firstName, lastName)}
                </span>
            )}
        </div>
    )
}

export default UserImage