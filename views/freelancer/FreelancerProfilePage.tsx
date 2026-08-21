/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import HeroSection from '@/components/features/freelancer/profile/HeroSection';
import StatsSection from '@/components/features/freelancer/profile/StatsSection';
import OverviewSection from '@/components/features/freelancer/profile/OverviewSection';
import PortfolioSection from '@/components/features/freelancer/profile/PortfolioSection';
import EmploymentEducationSection from '@/components/features/freelancer/profile/EmploymentEducationSection';
import StatisticsSection from '@/components/features/freelancer/profile/StatisticsSection';
import SidebarSection from '@/components/features/freelancer/profile/SidebarSection';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { DURATION } from '@/utils/constant.utils';
import Loading from '@/components/ui/Loading';
import { IUserListItem, userService } from '@/services/user.service';
import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { employmentHistoryService, IEmploymentHistory } from '@/services/employmentHistory.service';
import { educationService, IEducation } from '@/services/education.service';
import { profileSkillService, IProfileSkill } from '@/services/profileSkill.service';
import { ILanguage, languageService } from '@/services/language.service';
import { portfolioItemService, IPortfolioItem } from '@/services/portfolioItem.service';
import { fetchUserProfileById, selectUserProfileSlice } from '@/store/slices/profile/getUserProfileSlice';
import { IProfile } from '@/services/profile.service';
// 1. Import your certification service and interface
import { certificationService, ICertification } from '@/services/certification.service';

export default function FreelancerProfilePage({ id }: { id: string }) {
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    // Select profile state from Redux
    const { profile, isLoading: userProfileLoading } = useSelector(selectUserProfileSlice) as { profile: IProfile, isLoading: boolean };

    const [subResourcesLoading, setSubResourcesLoading] = useState(true);
    const [freelancer, setFreelancer] = useState<IUserListItem | null>(null);
    const [employmentHistories, setEmploymentHistories] = useState<IEmploymentHistory[]>([]);
    const [educations, setEducations] = useState<IEducation[]>([]);
    const [profileSkills, setProfileSkills] = useState<IProfileSkill[]>([]);
    const [languages, setLanguages] = useState<ILanguage[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<IPortfolioItem[]>([]);
    // 2. Define certification state
    const [certifications, setCertifications] = useState<ICertification[]>([]);

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setSubResourcesLoading(true);

                // 1. Dispatch Redux thunk for user profile & fetch user details concurrently
                const [profileAction, userRes] = await Promise.all([
                    dispatch(fetchUserProfileById(String(id))),
                    userService.getUserById(String(id)),
                ]);

                // Extract profile from unwrap payload
                const fetchedProfile = fetchUserProfileById.fulfilled.match(profileAction)
                    ? profileAction.payload
                    : null;

                setFreelancer(userRes.data.user);

                // 2. Fetch related details concurrently using profile ID
                if (fetchedProfile?._id) {
                    const [
                        employmentRes,
                        educationRes,
                        profileSkillsRes,
                        languagesRes,
                        portfolioRes,
                        certificationsRes // 3. Catch response from concurrent call
                    ] = await Promise.all([
                        employmentHistoryService.getAllEmploymentHistories(fetchedProfile._id),
                        educationService.getAllEducations(fetchedProfile._id),
                        profileSkillService.getProfileSkills({ profileId: fetchedProfile._id }),
                        languageService.getAllLanguages(fetchedProfile._id),
                        portfolioItemService.getAllPortfolioItems({ freelancer: String(id) }),
                        certificationService.getAllCertifications(fetchedProfile._id), // 4. Trigger certification API call
                    ]);

                    setEmploymentHistories(employmentRes.data.employmentHistories);
                    setEducations(educationRes.data.educations);
                    setProfileSkills(profileSkillsRes.data.profileSkills);
                    setLanguages(languagesRes.data.languages);
                    setPortfolioItems(portfolioRes.data.portfolioItems);
                    setCertifications(certificationsRes.data.certifications); // 5. Update certifications state
                }
            } catch (error: any) {
                handleAddToastification(error?.message || 'Failed to fetch profile data', 'error', DURATION);
            } finally {
                setSubResourcesLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, dispatch]);

    const isLoading = userProfileLoading || subResourcesLoading;

    if (isLoading || !profile || !freelancer) {
        return <Loading />;
    }

    return (
        <>
            <HeroSection profile={profile} freelancer={freelancer} me={me!} />
            <StatsSection profile={profile} />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-8">
                    <OverviewSection profile={profile} me={me!} />
                    <PortfolioSection items={portfolioItems} />
                    <EmploymentEducationSection employmentHistories={employmentHistories} educations={educations} />
                    <StatisticsSection />
                </div>
                <SidebarSection
                    profile={profile}
                    me={me!}
                    profileSkills={profileSkills}
                    languages={languages}
                    certifications={certifications} // Pass to Sidebar or applicable section
                />
            </div>
        </>
    );
}