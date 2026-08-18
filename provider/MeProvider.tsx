'use client'
import Loading from '@/components/ui/Loading';
import { fetchMe, selectMeSlice } from '@/store/slices/auth/authSlice';
import { AppDispatch } from '@/store/store';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function MeProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const dispatch: AppDispatch = useDispatch();
    const { me, initialized } = useSelector(selectMeSlice);

    // 1. fetch user once
    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);


    if (!initialized) {
        return (
            <Loading />
        );
    }

    console.log('me', me)
    return children
}

export default MeProvider