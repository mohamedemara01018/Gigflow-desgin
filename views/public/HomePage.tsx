'use client';

import { useDispatch, useSelector } from "react-redux";

import { fetchMe, selectMeSlice } from "@/store/slices/authSlice";
import { UserRole } from "@/utils/enums.utils";

import { AppDispatch } from "@/store/store";
import { useEffect } from "react";

import FreelancerPage from "../freelancer/FreelancerPage";
import ClientPage from "../client/ClientPage";
import LandingPage from "./LandingPage";
import AdminPage from "../admin/AdminPage";
import AdminDashboardLayout from "@/components/layout/admin/AdminDashboardLayout";



function HomePage() {
    const { me } = useSelector(selectMeSlice)
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    console.log('what heppen')

    switch (me?.role) {
        case UserRole.FREELANCER:
            return (<FreelancerPage />);

        case UserRole.CLIENT:
            return (<ClientPage />);

        case UserRole.ADMIN:
            return (
                <AdminDashboardLayout>
                    <AdminPage />
                </AdminDashboardLayout>
            );

        default:
            return (<LandingPage />);
    }
}

export default HomePage;