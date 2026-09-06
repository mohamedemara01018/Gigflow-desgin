import { Globe } from "lucide-react";
import { IPortfolioItem } from "@/services/portfolioItem.service";

interface PortfolioSidebarProps {
    project: IPortfolioItem;
}

export default function PortfolioSidebar({ project }: PortfolioSidebarProps) {
    const { projectUrl, githubUrl, figmaUrl, technologies, freelancer } = project;
    const hasLinks = Boolean(projectUrl || githubUrl || figmaUrl);

    return (
        <aside className="flex flex-col gap-6">
            {hasLinks && (
                <section className="card p-5 rounded-xl border border-outline-variant bg-surface">
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                        Project Links
                    </span>
                    <div className="flex flex-col gap-2.5 mt-3">
                        {projectUrl && (
                            <a
                                href={projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-lg p-3"
                            >
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Globe size={15} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-body-sm font-medium text-on-surface">Live Web App</p>
                                    <p className="text-label-sm text-on-surface-variant truncate">
                                        {projectUrl.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>
                            </a>
                        )}
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-lg p-3"
                            >
                                <span className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                    <Globe size={15} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-body-sm font-medium text-on-surface">GitHub Repo</p>
                                    <p className="text-label-sm text-on-surface-variant truncate">
                                        {githubUrl.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>
                            </a>
                        )}
                        {figmaUrl && (
                            <a
                                href={figmaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-lg p-3"
                            >
                                <span className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                                    <Globe size={15} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-body-sm font-medium text-on-surface">Figma System</p>
                                    <p className="text-label-sm text-on-surface-variant truncate">
                                        {figmaUrl.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>
                            </a>
                        )}
                    </div>
                </section>
            )}

            {technologies && technologies.length > 0 && (
                <section className="card p-5 rounded-xl border border-outline-variant bg-surface">
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                        Technologies Used · {technologies.length}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {technologies.map((tech) => (
                            <span
                                key={tech._id}
                                className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full font-medium"
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {freelancer && (
                <section className="card p-5 rounded-xl border border-outline-variant bg-surface">
                    <div className="flex items-center gap-3">
                        {freelancer.avatar ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={freelancer.avatar}
                                alt={`${freelancer.firstName} ${freelancer.lastName}`}
                                className="w-11 h-11 rounded-full object-cover"
                            />
                        ) : (
                            <span className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-md font-semibold">
                                {freelancer.firstName?.charAt(0) || "F"}
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="text-body-md font-semibold text-on-surface truncate">
                                {freelancer.firstName} {freelancer.lastName}
                            </p>
                            {freelancer.title && (
                                <p className="text-body-sm text-on-surface-variant truncate">
                                    {freelancer.title}
                                </p>
                            )}
                        </div>
                    </div>

                    {freelancer.bio && (
                        <p className="text-body-sm text-on-surface-variant mt-3 line-clamp-3">
                            {freelancer.bio}
                        </p>
                    )}
                </section>
            )}
        </aside>
    );
}