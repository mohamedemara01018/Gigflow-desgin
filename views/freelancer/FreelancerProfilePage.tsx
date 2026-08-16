/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import HeroSection from '@/components/features/public/profile/HeroSection';
import StatsSection from '@/components/features/public/profile/StatsSection';
import OverviewSection from '@/components/features/public/profile/OverviewSection';
import PortfolioSection from '@/components/features/public/profile/PortfolioSection';
import EmploymentEducationSection from '@/components/features/public/profile/EmploymentEducationSection';
import StatisticsSection from '@/components/features/public/profile/StatisticsSection';
import SidebarSection from '@/components/features/public/profile/SidebarSection';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { IProfile, profileService } from '@/services/profile.service';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { DURATION } from '@/utils/constant.utils';
import Loading from '@/components/ui/Loading';
import { IUserListItem, userService } from '@/services/user.service';
import { selectMeSlice } from '@/store/slices/authSlice';
import { employmentHistoryService, IEmploymentHistory } from '@/services/employmentHistory.service';
import { educationService, IEducation } from '@/services/education.service';
import { profileSkillService, IProfileSkill } from '@/services/profileSkill.service';
import { ILanguage, languageService } from '@/services/language.service';
import { portfolioItemService, IPortfolioItem } from '@/services/portfolioItem.service';

export default function FreelancerProfilePage({ id }: { id: string }) {
    const [loading, setLoading] = useState(true);
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const [profile, setProfile] = useState<IProfile | null>(null);
    const [freelancer, setFreelancer] = useState<IUserListItem | null>(null);
    const [employmentHistories, setEmploymentHistories] = useState<IEmploymentHistory[]>([]);
    const [educations, setEducations] = useState<IEducation[]>([]);
    const [profileSkills, setProfileSkills] = useState<IProfileSkill[]>([]);
    const [languages, setLanguages] = useState<ILanguage[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<IPortfolioItem[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch profile and user details concurrently
                const [profileRes, userRes] = await Promise.all([
                    profileService.getUserProfileById(String(id)),
                    userService.getUserById(String(id)),
                ]);

                const fetchedProfile = profileRes.data.profile;
                setProfile(fetchedProfile);
                setFreelancer(userRes.data.user);

                // 2. Fetch related details concurrently using profile ID & freelancer user ID
                if (fetchedProfile?._id) {
                    const [
                        employmentRes,
                        educationRes,
                        profileSkillsRes,
                        languagesRes,
                        portfolioRes
                    ] = await Promise.all([
                        employmentHistoryService.getAllEmploymentHistories(fetchedProfile._id),
                        educationService.getAllEducations(fetchedProfile._id),
                        profileSkillService.getProfileSkills({ profileId: fetchedProfile._id }),
                        languageService.getAllLanguages(fetchedProfile._id),
                        portfolioItemService.getAllPortfolioItems({ freelancer: String(id) }),
                    ]);

                    setEmploymentHistories(employmentRes.data.employmentHistories);
                    setEducations(educationRes.data.educations);
                    setProfileSkills(profileSkillsRes.data.profileSkills);
                    setLanguages(languagesRes.data.languages);
                    setPortfolioItems(portfolioRes.data.portfolioItems);
                }
            } catch (error: any) {
                handleAddToastification(error?.message || 'Failed to fetch profile data', 'error', DURATION);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading || !profile || !freelancer) {
        return <Loading />;
    }

    return (
        <>
            <HeroSection profile={profile} freelancer={freelancer} me={me!} />
            <StatsSection profile={profile} />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-8">
                    <OverviewSection profile={profile}/>
                    <PortfolioSection items={portfolioItems} />
                    <EmploymentEducationSection employmentHistories={employmentHistories} educations={educations} />
                    <StatisticsSection />
                </div>
                <SidebarSection
                    profile={profile}
                    me={me!}
                    profileSkills={profileSkills}
                    languages={languages}
                />
            </div>
        </>
    );
}