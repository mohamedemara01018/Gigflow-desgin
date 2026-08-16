import SettingsNav from '@/components/features/freelancer/freelancer-settings/SettingsNav'
import React from 'react'

function SettingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="wrapper">
            

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 mt-6">
                <div className="flex flex-col gap-6">
                    <SettingsNav />
                    {/* <ProfileStrengthCard
                        percent={75}
                        suggestions={[
                            { label: "Add Education", boost: "+10%" },
                            { label: "Verify Identity", boost: "+15%" },
                        ]}
                    /> */}
                </div>

                {children}
            </div>
        </div>
    )
}

export default SettingLayout