"use client";

import { IToastification, removeToastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



const toastificationConfig = {
    success: {
        icon: CheckCircle2,
        title: "Success",
        container:
            "border-primary/30 bg-primary-container",
        iconColor: "text-primary",
        titleColor: "text-on-primary-container",
    },

    error: {
        icon: AlertCircle,
        title: "Error",
        container:
            "border-error/30 bg-error-container",
        iconColor: "text-on-error-container",
        titleColor: "text-on-error-container",
    },

    warning: {
        icon: TriangleAlert,
        title: "Warning",
        container:
            "border-tertiary/30 bg-tertiary-container",
        iconColor: "text-on-tertiary-container",
        titleColor: "text-on-tertiary-container",
    },

    info: {
        icon: Info,
        title: "Information",
        container:
            "border-primary/30 bg-primary-container",
        iconColor: "text-primary",
        titleColor: "text-on-primary-container",
    },
};

interface ITostificationItem {
    toastification: IToastification
    onRemove: (id: string) => void
}

export default function ToastificationItem({
    toastification,
    onRemove,
}: ITostificationItem) {
    const config = toastificationConfig[toastification.type];
    const Icon = config.icon;

    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (!toastification.duration || toastification.duration <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            dispatch(
                removeToastify({
                    id: toastification.id!,
                })
            );
        }, toastification.duration);

        return () => clearTimeout(timer);
    }, [dispatch, toastification.duration, toastification.id]);

    return (
        <div
            role={
                toastification.type === "error"
                    ? "alert"
                    : "status"
            }
            className={`
                pointer-events-auto
                relative
                flex
                items-start
                gap-3
                rounded-xl
                border
                p-4
                shadow-lg
                backdrop-blur-sm
                animate-in
                slide-in-from-right-5
                fade-in
                duration-300
                ${config.container}
            `}
        >
            {/* Icon */}

            <div
                className={`
                    mt-0.5
                    shrink-0
                    ${config.iconColor}
                `}
            >
                <Icon size={21} />
            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">
                <p
                    className={`
                        text-sm
                        font-semibold
                        ${config.titleColor}
                    `}
                >
                    {toastification.title ?? config.title}
                </p>

                <p className="mt-1 text-sm text-on-surface">
                    {toastification.message}
                </p>
            </div>

            {/* Close */}

            <button
                type="button"
                onClick={() =>
                    onRemove(toastification.id!)
                }
                aria-label="Close notification"
                className="
                    shrink-0
                    rounded-md
                    p-1
                    text-on-surface-variant
                    transition
                    hover:bg-black/5
                    hover:text-on-surface
                "
            >
                <X size={17} />
            </button>
        </div>
    );
}