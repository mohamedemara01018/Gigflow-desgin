'use client';

import { useState } from "react";
import {
    Mail,
    ChevronDown,
    ArrowRight,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Field } from "@/components/ui/Field";
import { contactSupportService } from "@/services/contactSupport.service";
import { ContactSupportCategory } from "@/utils/enums.utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

const FAQS = [
    "How do I get paid for a completed gig?",
    "Can I dispute a client review?",
    "What are the platform fees?",
    "How do I change my primary skill categories?",
];

const SUPPORT_CHANNELS = [
    {
        icon: Mail,
        tone: "primary" as const,
        title: "Email Support",
        description: "Drop us a line and we'll get back to you.",
        meta: (
            <a
                href="mailto:mohamed.fullstack.eng@gmail.com"
                className="text-body-sm text-primary font-medium hover:underline"
            >
                mohamed.fullstack.eng@gmail.com
            </a>
        ),
    }
];

const CATEGORY_OPTIONS = [
    { label: "General Inquiry", value: ContactSupportCategory.GENERAL_INQUIRY },
    { label: "Account Issue", value: ContactSupportCategory.ACCOUNT },
    { label: "Payment & Billing", value: ContactSupportCategory.PAYMENT },
    { label: "Job & Projects", value: ContactSupportCategory.JOB },
    { label: "Proposals", value: ContactSupportCategory.PROPOSAL },
    { label: "Contracts", value: ContactSupportCategory.CONTRACT },
    { label: "Technical Issue", value: ContactSupportCategory.TECHNICAL },
    { label: "Security & Privacy", value: ContactSupportCategory.SECURITY },
    { label: "Other", value: ContactSupportCategory.OTHER },
];

function ContactForm() {
    const dispatch: AppDispatch = useDispatch();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        category: ContactSupportCategory.GENERAL_INQUIRY,
        message: "",
    });
    const { me } = useSelector(selectMeSlice)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);


    const handleToastify = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }))
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSuccess(false);

        if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            setError("Please fill out all required fields.");
            return;
        }

        try {
            setIsSubmitting(true);
            await contactSupportService.createTicket({
                user: me?._id || null,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                category: formData.category,
                message: formData.message.trim(),
            });

            setIsSuccess(true);
            setFormData({
                fullName: "",
                email: "",
                subject: "",
                category: ContactSupportCategory.GENERAL_INQUIRY,
                message: "",
            });
            handleToastify(
                'Your message has been sent successfully! Our team will get back to you shortly.',
                'success', DURATION)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Failed to submit support ticket. Please try again.");
            handleToastify(err.message, 'error', DURATION)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="card bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8">
            <h2 className="text-headline-lg text-on-surface font-semibold">
                Send us a message
            </h2>

            {isSuccess && (
                <div className="mt-4 p-4 rounded-md bg-primary/10 border border-primary/20 text-primary flex items-center gap-3">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <p className="text-body-md font-medium">
                        Your message has been sent successfully! Our team will get back to you shortly.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 rounded-md bg-error/10 border border-error/20 text-error flex items-center gap-3">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-body-md font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                        label="Full Name"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />

                    <Field
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                        label="Subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                    />

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-body-sm font-medium text-on-surface">Category</label>
                        </div>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary appearance-none pr-10"
                            >
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={18}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-body-sm font-medium text-on-surface">Your Message</label>
                    </div>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your issue or inquiry in detail..."
                        rows={6}
                        required
                        className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none placeholder:text-on-surface-variant/60"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md font-medium rounded-md px-6 py-3 hover:opacity-90 disabled:opacity-60 transition-opacity"
                    >
                        {isSubmitting ? (
                            <>
                                Submitting...
                                <Loader2 size={16} className="animate-spin" />
                            </>
                        ) : (
                            <>
                                Send Message
                                <Send size={16} />
                            </>
                        )}
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
                <section key={title} className="card bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex gap-4">
                    <span
                        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${toneClasses[tone]}`}
                    >
                        <Icon size={22} />
                    </span>
                    <div>
                        <h3 className="text-headline-md text-[18px]! leading-6! text-on-surface font-semibold">
                            {title}
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">
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
            <h2 className="text-headline-lg text-(--color-on-surface) font-semibold">
                Frequently Asked Questions
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {FAQS.map((question, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={question}
                            className="bg-(--color-surface-container-lowest) rounded-(--radius-md) border border-outline-variant/60 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                                <span className="text-body-md text-(--color-on-surface) font-medium">
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
                <button className="flex items-center gap-2 text-(--color-primary) text-label-md font-medium hover:underline">
                    View all FAQs
                    <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
}

export default function ContactSupportPage() {
    return (
        <main className="bg-surface min-h-screen px-6 md:px-10 py-12">
            <div className="max-w-300 mx-auto">
                <div className="text-center max-w-140 mx-auto">
                    <h1 className="text-display-lg text-on-surface font-bold">
                        How can we help?
                    </h1>
                    <p className="text-body-lg text-on-surface-variant mt-4">
                        Search our knowledge base or get in touch with our team.
                    </p>

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