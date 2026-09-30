'use client';

import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
    label?: string;
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (value: string) => void;
    icon?: typeof ChevronDown;
}

export default function FilterSelect({
    label,
    options,
    value,
    onChange,
    onSelect,
    icon: Icon = ChevronDown,
}: FilterSelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (onChange) onChange(val);
        if (onSelect) onSelect(val);
    };

    return (
        <div className="relative inline-block">
            <select
                value={value ?? label ?? options[0]}
                onChange={handleChange}
                className="appearance-none bg-surface-container-highest border border-outline-variant rounded-md pl-4 pr-9 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <Icon
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
        </div>
    );
}