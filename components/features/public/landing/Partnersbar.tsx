import { partners } from './Data';

export default function PartnersBar() {
    return (
        <section className="bg-surface-container-low border-y border-outline-variant py-8">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-outline mb-6">
                    Empowering talent at top-tier industry leaders
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
                    {partners.map((name) => (
                        <span
                            key={name}
                            className="text-lg font-bold text-outline-variant hover:text-outline transition-colors cursor-default tracking-tight"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}