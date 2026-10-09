/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { getInitials } from '@/utils/functions.utils';
import React, { useState, useEffect } from 'react';

interface UserImageProps {
    avatarUrl?: string | null;
    firstName: string;
    lastName: string;
    className?: string;
}

function UserImage({ avatarUrl, firstName, lastName, className = '' }: UserImageProps) {
    const [imgError, setImgError] = useState(false);

    // Reset error state if the avatarUrl changes
    useEffect(() => {
        setImgError(false);
    }, [avatarUrl]);

    const showAvatar = avatarUrl && !imgError;

    return (
        <div
            className={`${className} rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all flex items-center justify-center`}
        >
            {showAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="w-full h-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-semibold select-none">
                    {getInitials(firstName, lastName)}
                </span>
            )}
        </div>
    );
}

export default UserImage;