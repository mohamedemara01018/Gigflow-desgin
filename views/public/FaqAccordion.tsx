import { ChevronDown, Lightbulb } from "lucide-react";
import { useState } from "react";


const FAQS = [
    {
        question: "Why is it taking longer than 24 hours?",
        answer:
            "In rare cases, manual review is required if the document image was blurry or details couldn't be automatically extracted. We will email you if we need clearer photos.",
    },
    {
        question: "Can I browse jobs while waiting?",
        answer:
            "Yes — you can browse and save jobs while your verification is pending. You'll need to complete verification before submitting a proposal.",
    },
    {
        question: "How is my data protected?",
        answer:
            "Your documents are encrypted in transit and at rest, and are only accessed by our compliance team for verification purposes.",
    },
];


function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="card">
            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                <Lightbulb size={20} className="text-primary" />
                What to Expect
            </span>

            <div className="flex flex-col mt-4">
                {FAQS.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={faq.question}
                            className={i > 0 ? "border-t border-outline-variant" : ""}
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="w-full flex items-center justify-between gap-4 py-4 text-left"
                            >
                                <span className="text-body-md font-medium text-on-surface">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-on-surface-variant transition-transform ${isOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {isOpen && (
                                <p className="text-body-sm text-on-surface-variant leading-relaxed pb-4">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default FaqAccordion