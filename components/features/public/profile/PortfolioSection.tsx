import Image from 'next/image';
import { IPortfolioItem } from '@/services/portfolioItem.service';
import EmptyState from '@/components/ui/Emptystate';

interface PortfolioSectionProps {
    items: IPortfolioItem[];
    isOwner?: boolean;
    onAddProject?: () => void;
    onSelectProject?: (item: IPortfolioItem) => void;
}

export default function PortfolioSection({
    items = [],
    isOwner = false,
    onAddProject,
    onSelectProject,
}: PortfolioSectionProps) {
    const fallbackImage =
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";

    return (
        <section
            className="card border border-outline-variant rounded-xl p-6"
            style={{ boxShadow: 'var(--shadow-level-2)' }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-[32px] text-on-surface">
                    Portfolio
                </h2>
                {isOwner && (
                    <button
                        onClick={onAddProject}
                        className="bg-primary/5 text-primary px-4 py-1.5 rounded-lg text-[14px] leading-[20px] font-['Geist'] font-medium hover:bg-primary/10 transition-colors"
                    >
                        Add Project
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <EmptyState title='No portfolio projects to display yet.' size='compact' />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => {
                        const imageUrl = item.thumbnail?.image || fallbackImage;

                        return (
                            <div
                                key={item._id}
                                onClick={() => onSelectProject?.(item)}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-outline-variant relative bg-surface-container-low">
                                    <Image
                                        src={imageUrl}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-surface text-on-surface px-4 py-2 rounded-lg text-[14px] leading-[20px] font-['Geist'] font-medium shadow-md">
                                            View Details
                                        </span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-[18px] leading-[28px] font-['Inter'] text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                                    {item.title}
                                </h4>

                                {item.description && (
                                    <p className="text-[14px] text-on-surface-variant font-['Inter'] line-clamp-2 mt-1 mb-2">
                                        {item.description}
                                    </p>
                                )}

                                {item.technologies && item.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                        {item.technologies.map((tech) => (
                                            <span
                                                key={tech._id || tech.name}
                                                className="bg-surface-container-high px-2.5 py-0.5 rounded text-[12px] text-on-surface-variant font-['Inter'] font-medium"
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}