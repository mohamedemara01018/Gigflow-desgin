/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
    Code2,
    Palette,
    Megaphone,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    LucideIcon,
} from "lucide-react";
import EmptyState from "@/components/ui/Emptystate";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDateTime } from "@/utils/functions.utils";
import { ISkill } from "@/services/skill.service";
import SmallLoading from "@/components/ui/SmallLoading";

export interface ICategory {
    _id: string;
    name: string;
    description?: string;
}



interface AdminSkillTableProps {
    skills: ISkill[];
    loading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onEdit: (skill: ISkill) => void;
    onDelete: (id: string) => Promise<void> | void;
}

const CATEGORY_CONFIG: Record<string, { icon: LucideIcon; iconClass: string; badgeClass: string }> = {
    Development: {
        icon: Code2,
        iconClass: "bg-secondary/15 text-secondary",
        badgeClass: "bg-secondary/15 text-secondary",
    },
    Design: {
        icon: Palette,
        iconClass: "bg-tertiary text-on-tertiary",
        badgeClass: "bg-tertiary/15 text-tertiary",
    },
    Marketing: {
        icon: Megaphone,
        iconClass: "bg-surface-container-high text-on-surface-variant",
        badgeClass: "bg-surface-container-high text-on-surface-variant",
    },
};

const DEFAULT_CATEGORY_CONFIG = {
    icon: Code2,
    iconClass: "bg-surface-container-high text-on-surface-variant",
    badgeClass: "bg-surface-container-high text-on-surface-variant",
};



function getCategoryName(category?: string | ICategory | null): string {
    if (!category) return "Uncategorized";
    if (typeof category === "string") return category;
    return category.name || "Uncategorized";
}

export default function AdminSkillTable({
    skills,
    loading,
    page,
    totalPages,
    totalItems,
    onPageChange,
    onEdit,
    onDelete,
}: AdminSkillTableProps) {
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        setDeleteLoading(true);
        await onDelete(pendingDeleteId);
        setDeleteLoading(false);
        setPendingDeleteId(null);
    };

    return (
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-surface-container-high">
                        <tr className="border-b border-outline-variant">
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Name &amp; Slug
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Category
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Description
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Added
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-body-md text-on-surface-variant">
                                    <SmallLoading />
                                </td>
                            </tr>
                        ) : skills.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <EmptyState
                                        size="compact"
                                        title="No skills match your current filters."
                                    />
                                </td>
                            </tr>
                        ) : (
                            skills.map((skill) => {
                                const categoryName = getCategoryName(skill.category);
                                const config = CATEGORY_CONFIG[categoryName] || DEFAULT_CATEGORY_CONFIG;
                                const Icon = config.icon;

                                return (
                                    <tr key={skill._id} className="group hover:bg-surface-container-high transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${config.iconClass}`}>
                                                    {skill.icon! ? <img src={skill.icon!} alt="" />
                                                        : <Icon size={18} />}
                                                </span>
                                                <div>
                                                    <p className="text-body-md font-medium text-on-surface">
                                                        {skill.name}
                                                    </p>
                                                    <p className="text-label-sm text-on-surface-variant font-mono">
                                                        {skill.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex text-label-sm px-2.5 py-1 rounded-full ${config.badgeClass}`}>
                                                {categoryName}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-body-sm text-on-surface-variant max-w-90 truncate">
                                            {skill.description || "—"}
                                        </td>
                                        <td className="px-5 py-4 text-body-sm text-on-surface-variant whitespace-nowrap">
                                            {formatDateTime(String(skill.createdAt)).date}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onEdit(skill)}
                                                    aria-label={`Edit ${skill.name}`}
                                                    className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setPendingDeleteId(skill._id)}
                                                    aria-label={`Delete ${skill.name}`}
                                                    className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-error transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* {!loading && skills.length > 0 && (
                <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-t border-outline-variant">
                    <p className="text-body-sm text-on-surface-variant">
                        Showing {Math.min((page - 1) * 4 + 1, totalItems)}-{Math.min(page * 4, totalItems)} of{" "}
                        {totalItems} skills
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                            aria-label="Previous page"
                            className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-full text-body-sm font-medium transition-colors ${p === page
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface-variant hover:bg-surface-container-highest"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            aria-label="Next page"
                            className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )} */}

            <ConfirmDialog
                open={pendingDeleteId !== null}
                title="Delete this skill?"
                description="Removing this skill will unlink it from any freelancer profiles and job postings that reference it. This action cannot be undone."
                confirmLabel="Delete Skill"
                tone="danger"
                isLoading={deleteLoading}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}