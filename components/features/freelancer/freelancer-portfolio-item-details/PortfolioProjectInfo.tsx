interface PortfolioProjectInfoProps {
    title: string;
    description: string;
}

export default function PortfolioProjectInfo({ title, description }: PortfolioProjectInfoProps) {
    return (
        <section className="card p-6 rounded-xl border border-outline-variant bg-surface">
            <span className="text-label-sm uppercase tracking-wide text-primary font-semibold">
                Case Study
            </span>
            <h1 className="text-headline-lg text-on-surface mt-1.5 font-bold">
                {title}
            </h1>
            <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed whitespace-pre-line">
                {description}
            </p>
        </section>
    );
}