'use client'
import { useState } from "react";
import {
    Search,
    MessageSquare,
    Mail,
    Users,
    ChevronDown,
    ArrowRight,
    Send,
} from "lucide-react";

const FAQS = [
    "How do I get paid for a completed gig?",
    "Can I dispute a client review?",
    "What are the platform fees?",
    "How do I change my primary skill categories?",
];

const SUPPORT_CHANNELS = [
    {
        icon: MessageSquare,
        tone: "primary" as const,
        title: "Live Chat",
        description: "Talk to our support team right now.",
        meta: (
            <span className="flex items-center gap-1.5 text-body-sm text-(--color-on-surface-variant)">
                <span className="w-2 h-2 rounded-full bg-(--color-primary)" />
                Est. wait: &lt; 2 mins
            </span>
        ),
    },
    {
        icon: Mail,
        tone: "primary" as const,
        title: "Email Support",
        description: "Drop us a line and we'll get back to you.",
        meta: (
            <a
                href="mailto:support@gigflow.com"
                className="text-body-sm text-(--color-primary) font-medium hover:underline"
            >
                support@gigflow.com
            </a>
        ),
    },
    {
        icon: Users,
        tone: "tertiary" as const,
        title: "Community Forum",
        description: "Find answers from other GigFlow users.",
        meta: (
            <a
                href="#"
                className="text-body-sm text-(--color-tertiary) font-medium hover:underline"
            >
                Browse Topics
            </a>
        ),
    },
];

function ContactForm() {
    return (
        <section className="card">
            <h2 className="text-headline-lg text-(--color-on-surface)">
                Send us a message
            </h2>

            <form className="flex flex-col gap-4 mt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1 bg-(--color-surface-container-low) rounded-(--radius-md) px-4 py-2.5">
                        <span className="text-label-md text-(--color-on-surface-variant)">
                            Full Name
                        </span>
                        <input
                            type="text"
                            placeholder="Name"
                            className="bg-transparent text-body-md text-(--color-on-surface) placeholder:text-(--color-on-surface) outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-1 bg-(--color-surface-container-low) rounded-(--radius-md) px-4 py-2.5">
                        <span className="text-label-md text-(--color-on-surface-variant)">
                            Email Address
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent text-body-md text-(--color-on-surface) placeholder:text-(--color-on-surface) outline-none"
                        />
                    </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1 bg-(--color-surface-container-low) rounded-(--radius-md) px-4 py-2.5">
                        <span className="text-label-md text-(--color-on-surface-variant)">
                            Subject
                        </span>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="bg-transparent text-body-md text-(--color-on-surface) placeholder:text-(--color-on-surface) outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-1 bg-(--color-surface-container-low) rounded-(--radius-md) px-4 py-2.5 relative">
                        <span className="text-label-md text-(--color-on-surface-variant)">
                            Category
                        </span>
                        <select className="appearance-none bg-transparent text-body-md text-(--color-on-surface) outline-none pr-8">
                            <option>General Inquiry</option>
                            <option>Billing</option>
                            <option>Technical Issue</option>
                            <option>Report a User</option>
                        </select>
                        <ChevronDown
                            size={18}
                            className="absolute right-4 top-1/2 translate-y-[-30%] text-(--color-on-surface-variant) pointer-events-none"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1 bg-(--color-surface-container-low) rounded-(--radius-md) px-4 py-2.5">
                    <span className="text-label-md text-(--color-on-surface-variant)">
                        Your Message
                    </span>
                    <textarea
                        placeholder="Message"
                        rows={6}
                        className="bg-transparent text-body-md text-(--color-on-surface) placeholder:text-(--color-on-surface) outline-none resize-none"
                    />
                </label>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-(--color-primary) text-(--color-on-primary) text-label-md rounded-(--radius-md) px-6 py-3 hover:opacity-90 transition-opacity"
                    >
                        Send Message
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </section>
    );
}

function SupportChannels() {
    const toneClasses = {
        primary: "bg-(--color-primary)/10 text-(--color-primary)",
        tertiary: "bg-(--color-tertiary)/10 text-(--color-tertiary)",
    };

    return (
        <div className="flex flex-col gap-6">
            {SUPPORT_CHANNELS.map(({ icon: Icon, tone, title, description, meta }) => (
                <section key={title} className="card flex gap-4">
                    <span
                        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${toneClasses[tone]}`}
                    >
                        <Icon size={22} />
                    </span>
                    <div>
                        <h3 className="text-headline-md !text-[18px] !leading-6 text-(--color-on-surface)">
                            {title}
                        </h3>
                        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
                            {description}
                        </p>
                        <div className="mt-2">{meta}</div>
                    </div>
                </section>
            ))}
        </div>
    );
}

function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-(--color-surface-container-low) rounded-(--radius-lg) p-8 md:p-10">
            <h2 className="text-headline-lg text-(--color-on-surface)">
                Frequently Asked Questions
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {FAQS.map((question, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={question}
                            className="bg-(--color-surface-container-lowest) rounded-(--radius-md) overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                                <span className="text-body-md text-(--color-on-surface)">
                                    {question}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-(--color-on-surface-variant) transition-transform ${isOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {isOpen && (
                                <p className="px-5 pb-4 text-body-sm text-(--color-on-surface-variant) leading-relaxed">
                                    Our team is putting together a detailed answer for this — in
                                    the meantime, reach out via Live Chat or Email Support above
                                    and we&apos;ll get you sorted right away.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-8">
                <button className="flex items-center gap-2 text-(--color-primary) text-label-md hover:underline">
                    View all FAQs
                    <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
}

export default function ContactSupportPage() {
    return (
        <main className="bg-(--color-surface) min-h-screen px-6 md:px-10 py-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center max-w-[560px] mx-auto">
                    <h1 className="text-display-lg text-(--color-on-surface)">
                        How can we help?
                    </h1>
                    <p className="text-body-lg text-(--color-on-surface-variant) mt-4">
                        Search our knowledge base or get in touch with our team.
                    </p>

                    <div className="relative mt-8">
                        <Search
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-(--color-on-surface-variant)"
                        />
                        <input
                            type="text"
                            placeholder="Search Help Center..."
                            className="w-full bg-(--color-surface-container-low) rounded-(--radius-full) pl-14 pr-5 py-4 text-body-md text-(--color-on-surface) placeholder:text-(--color-on-surface-variant) outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-12">
                    <ContactForm />
                    <SupportChannels />
                </div>

                <div className="mt-12">
                    <FaqAccordion />
                </div>
            </div>
        </main>
    );
}