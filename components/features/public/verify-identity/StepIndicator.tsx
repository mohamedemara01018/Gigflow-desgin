import { Check, View } from "lucide-react";

const STEPS = [
    { id: 1, label: "Document Type" },
    { id: 2, label: "Upload Document" },
    { id: 3, label: "Review" },
];


function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center flex-wrap gap-3 mt-10">
            {STEPS.map((step, i) => {
                const isDone = step.id < current;
                const isActive = step.id === current;
                const isFilled = isDone || isActive;
                const isView = current === 3
                return (
                    <div key={step.id} className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-label-md font-semibold ${isFilled
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container-high text-on-surface-variant"
                                    }`}
                            >
                                {isDone ? <Check size={18} /> : isView ? <View size={18} /> : step.id}
                            </span>
                            <span
                                className={`text-body-md font-medium ${isFilled
                                    ? "text-on-surface"
                                    : "text-on-surface-variant"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <span
                                className={`w-16 h-0.5 ${isDone ? "bg-primary" : "bg-outline-variant"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default StepIndicator