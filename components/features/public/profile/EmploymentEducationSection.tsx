import EmptyState from '@/components/ui/Emptystate';
import { IEducation } from '@/services/education.service';
import { IEmploymentHistory } from '@/services/employmentHistory.service';
import { GraduationCap } from 'lucide-react';

interface EmploymentEducationProps {
    employmentHistories?: IEmploymentHistory[];
    educations?: IEducation[];
}

function EmploymentEducationSection({ employmentHistories = [], educations = [] }: EmploymentEducationProps) {
    // Helper to extract year from ISO string or return full year value directly
    const getYear = (dateString?: string | number) => {
        if (!dateString) return '';
        if (typeof dateString === 'number') return dateString;
        return new Date(dateString).getFullYear();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {/* Employment History Section */}
            <section className="card border border-outline-variant rounded-xl p-6" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-[32px] text-on-surface mb-6">Employment History</h2>

                {employmentHistories.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
                        {employmentHistories.map((job) => (
                            <div key={job._id} className="pl-8 relative hover:-translate-y-1 transition-transform cursor-default">
                                <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-surface ${job.currentlyWorking ? 'bg-primary' : 'bg-outline'}`}></div>

                                <h4 className="font-bold font-['Inter'] text-[16px] text-on-surface">
                                    {job.position} | {job.company}
                                </h4>

                                <p className="text-[12px] leading-[16px] font-['Geist'] font-semibold text-on-surface-variant">
                                    {getYear(job.startDate)} — {job.currentlyWorking ? 'Present' : getYear(job.endDate)}
                                </p>

                                {job.description && (
                                    <p className="text-[14px] leading-[20px] font-['Inter'] mt-2 text-on-surface-variant">
                                        {job.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title='No employment history provided.' size='compact' />
                )}
            </section>

            {/* Dynamic Education Section */}
            <section className="card border border-outline-variant rounded-xl p-6" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-[32px] text-on-surface mb-6">Education</h2>

                {educations.length > 0 ? (
                    <div className="space-y-6">
                        {educations.map((edu) => (
                            <div key={edu._id} className="flex gap-4 hover:-translate-y-1 transition-transform cursor-default">
                                <span className="text-primary mt-1">
                                    <GraduationCap size={24} />
                                </span>
                                <div className="flex-1">
                                    <h4 className="font-bold font-['Inter'] text-[16px] text-on-surface">
                                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || edu.school}
                                    </h4>

                                    <p className="text-[14px] leading-[20px] font-['Inter'] text-on-surface-variant">
                                        {edu.school}
                                    </p>

                                    {(edu.startYear || edu.endYear) && (
                                        <p className="text-[12px] leading-[16px] font-['Geist'] font-semibold text-on-surface-variant">
                                            {edu.startYear ? getYear(edu.startYear) : ''}
                                            {edu.startYear && edu.endYear ? ' — ' : ''}
                                            {edu.endYear ? getYear(edu.endYear) : ''}
                                        </p>
                                    )}

                                    {edu.description && (
                                        <p className="text-[14px] leading-[20px] font-['Inter'] mt-2 text-on-surface-variant">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title='No education details provided.' size='compact' />
                )}
            </section>
        </div>
    );
}

export default EmploymentEducationSection;