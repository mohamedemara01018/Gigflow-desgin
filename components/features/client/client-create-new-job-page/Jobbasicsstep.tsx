'use client';

import { useEffect, useState } from "react";
import {
    Smartphone,
    Palette,
    BrainCircuit,
    TrendingUp,
    PenLine,
    Settings2,
    LucideIcon,
} from "lucide-react";
import { Editor } from "@tiptap/core";
import { Field } from "@/components/modals/CountryModal";
import SelectField, { Option } from "@/components/ui/SelectFeild";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { categoryService, ICategory } from "@/services/category.service";
import { skillService, ISkill } from "@/services/skill.service";
import { ICreateJobDto } from "@/services/jobs.service";

const TITLE_MAX = 150;
const DESCRIPTION_MAX = 10000;

type ToneType = "primary" | "secondary" | "tertiary";

interface CategoryDisplayItem {
    id: string;
    label: string;
    sub: string;
    icon: LucideIcon;
    tone: ToneType;
}

const ICON_TONE_MAP: { icon: LucideIcon; tone: ToneType }[] = [
    { icon: Smartphone, tone: "primary" },
    { icon: Palette, tone: "tertiary" },
    { icon: BrainCircuit, tone: "secondary" },
    { icon: TrendingUp, tone: "primary" },
    { icon: PenLine, tone: "tertiary" },
    { icon: Settings2, tone: "secondary" },
];

const toneClasses: Record<ToneType, string> = {
    primary: "bg-primary-container/15 text-primary",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-container/20 text-tertiary",
};

interface StepProps {
    formData: ICreateJobDto;
    updateForm: (patch: Partial<ICreateJobDto>) => void;
    selectedSkillIds: string[];
    setSelectedSkillIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function JobBasicsStep({
    formData,
    updateForm,
    selectedSkillIds,
    setSelectedSkillIds,
}: StepProps) {
    const [categories, setCategories] = useState<CategoryDisplayItem[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    // Skill state management
    const [skillOptions, setSkillOptions] = useState<Option[]>([]);
    const [isSkillsLoading, setIsSkillsLoading] = useState<boolean>(false);
    const [skillError, setSkillError] = useState<string | null>(null);

    // Track TipTap Editor instance
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

    // Fetch Categories
    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                setIsCategoriesLoading(true);
                setCategoryError(null);
                const response = await categoryService.getAllCategories();

                if (isMounted && response.data?.categories) {
                    const formattedCategories: CategoryDisplayItem[] = response.data.categories.map(
                        (cat: ICategory, index: number) => {
                            const mapItem = ICON_TONE_MAP[index % ICON_TONE_MAP.length];
                            return {
                                id: cat._id,
                                label: cat.name,
                                sub: cat.description || "",
                                icon: mapItem.icon,
                                tone: mapItem.tone,
                            };
                        }
                    );
                    setCategories(formattedCategories);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const message = err instanceof Error ? err.message : "Failed to load categories";
                    setCategoryError(message);
                }
            } finally {
                if (isMounted) {
                    setIsCategoriesLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch Skills whenever selected category changes
    useEffect(() => {
        let isMounted = true;

        const fetchSkills = async () => {
            try {
                setIsSkillsLoading(true);
                setSkillError(null);

                const response = await skillService.getAllSkills({
                    categoryId: formData.category || undefined,
                });

                if (isMounted && response.data?.skills) {
                    const options: Option[] = response.data.skills.map((skill: ISkill) => ({
                        value: skill._id,
                        label: skill.name,
                    }));
                    setSkillOptions(options);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const message = err instanceof Error ? err.message : "Failed to load skills";
                    setSkillError(message);
                }
            } finally {
                if (isMounted) {
                    setIsSkillsLoading(false);
                }
            }
        };

        fetchSkills();

        return () => {
            isMounted = false;
        };
    }, [formData.category]);

    // Handle changing categories (resets skills list and clears selected skills)
    const handleCategorySelect = (categoryId: string) => {
        if (formData.category !== categoryId) {
            updateForm({ category: categoryId });
            setSelectedSkillIds([]); // Reset selected skills when switching categories
        }
    };

    // Synchronize editor content if formData.description changes externally
    useEffect(() => {
        if (editorInstance && formData.description !== undefined) {
            const currentHtml = editorInstance.getHTML();
            if (currentHtml !== formData.description) {
                editorInstance.commands.setContent(formData.description || "");
            }
        }
    }, [formData.description, editorInstance]);

    const handleEditorReady = (editor: Editor) => {
        setEditorInstance(editor);

        updateForm({ description: editor.getHTML() });

        editor.on("update", () => {
            updateForm({ description: editor.getHTML() });
        });
    };

    const handleSkillsChange = (_name: string, value: string | string[]) => {
        const skillsArray = Array.isArray(value) ? value : value ? [value] : [];
        setSelectedSkillIds(skillsArray);
    };

    const rawText = editorInstance?.getText() ?? (formData.description || "").replace(/<[^>]*>/g, "");
    const descriptionLength = rawText.length;

    return (
        <section className="card">
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-headline-md text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded-full bg-primary" />
                    1. Job Basics
                </h2>
                <span className="text-body-sm text-on-surface-variant shrink-0">
                    Fields marked with * are required
                </span>
            </div>

            {/* Title Input */}
            <div className="mt-6">
                <Field
                    label="Job Posting Title *"
                    id="title"
                    type="text"
                    value={formData.title || ""}
                    maxLength={TITLE_MAX}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    placeholder="Principal React Native Engineer for Cross-Platform Health & Telehealth"
                />
                <p className="text-body-sm text-on-surface-variant mt-2">
                    Write a clear, descriptive title. Strong titles mention primary tech stacks and target deliverables.
                </p>
            </div>

            {/* Categories Section */}
            <div className="mt-6">
                <label className="text-label-md text-on-surface block">Specialized Industry & Category *</label>

                {isCategoriesLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-28 rounded-md bg-surface-container-low animate-pulse border border-outline-variant/30"
                            />
                        ))}
                    </div>
                )}

                {categoryError && !isCategoriesLoading && (
                    <p className="text-body-sm text-error mt-2">
                        Failed to load categories: {categoryError}
                    </p>
                )}

                {!isCategoriesLoading && !categoryError && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        {categories.map(({ id, label, sub, icon: Icon, tone }) => {
                            const active = formData.category === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleCategorySelect(id)}
                                    className={`text-left rounded-md border p-3 transition-all cursor-pointer ${active
                                            ? "border-primary bg-primary-container/10 ring-1 ring-primary"
                                            : "border-outline-variant bg-surface-container hover:border-outline"
                                        }`}
                                >
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${toneClasses[tone]}`}>
                                        <Icon size={16} />
                                    </span>
                                    <p className="text-label-md text-on-surface mt-2 font-medium">{label}</p>
                                    {sub && (
                                        <p className="text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                                            {sub}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Multi-Select Skills Field */}
            <div className="mt-6">
                <SelectField
                    id="skills"
                    name="skills"
                    label="Required Skills *"
                    isMulti={true}
                    options={skillOptions}
                    value={selectedSkillIds}
                    onChange={handleSkillsChange}
                    placeholder={
                        isSkillsLoading
                            ? "Loading skills..."
                            : !formData.category
                                ? "Select a category first to view skills"
                                : skillOptions.length === 0
                                    ? "No skills available for this category"
                                    : "Select required skills..."
                    }
                    disabled={isSkillsLoading || !formData.category || skillOptions.length === 0}
                />
                {skillError && (
                    <p className="text-body-sm text-error mt-1">
                        Failed to load skills: {skillError}
                    </p>
                )}
            </div>

            {/* Scope & Description */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label htmlFor="description" className="text-label-md text-on-surface">
                        Detailed Project Scope & Responsibilities *
                    </label>
                    <span
                        className={`text-body-sm ${descriptionLength > DESCRIPTION_MAX ? "text-error font-semibold" : "text-on-surface-variant"
                            }`}
                    >
                        {descriptionLength} / {DESCRIPTION_MAX}
                    </span>
                </div>

                <div className="mt-2">
                    <SimpleEditor
                        maxWidth="100%"
                        tabletWidth="100%"
                        isEdit={true}
                        content={formData.description || ""}
                        onEditReady={handleEditorReady}
                    />
                </div>
            </div>
        </section>
    );
}