/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { IPortfolioItem } from '@/services/portfolioItem.service';
import EmptyState from '@/components/ui/Emptystate';

interface PortfolioSectionProps {
    items: IPortfolioItem[];
}

export default function PortfolioSection({
    items = [],

}: PortfolioSectionProps) {
    const fallbackImage =
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";

    return (
        <section
            className="card border border-outline-variant rounded-xl p-6"
            style={{ boxShadow: 'var(--shadow-level-2)' }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface">
                    Portfolio
                </h2>

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
                                className="group flex flex-col h-full rounded-xl"
                            >
                                {/* Thumbnail Container */}
                                <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-outline-variant relative bg-surface-container-low">
                                    <img
                                        src={imageUrl}
                                        alt={item.title}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay with View Details Link */}
                                    <div className="absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Link
                                            href={`/profile/portfolio/${item._id}`}
                                            className="inline-flex items-center gap-2 bg-primary text-on-primary text-label-md font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity shadow-md"
                                        >
                                            <ExternalLink size={16} />
                                            View Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                                    <Link href={`/profile/portfolio/${item._id}`}>
                                        {item.title}
                                    </Link>
                                </h4>

                                {/* Description */}
                                {item.description && (
                                    <p className="text-[14px] text-on-surface-variant font-['Inter'] line-clamp-2 mt-1 mb-2">
                                        {item.description}
                                    </p>
                                )}

                                {/* Tech Stack Tags */}
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