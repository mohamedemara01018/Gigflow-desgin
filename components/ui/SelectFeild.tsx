import React from "react";
import Select, { SingleValue } from "react-select";

export type Option = {
    value: string;
    label: string;
};

interface SelectFieldProps {
    name: string;
    id?: string;
    label: string;
    options: Option[];
    value?: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
}

export default function SelectField({
    name,
    id,
    label,
    options,
    value,
    onChange,
    placeholder = "Select...",
}: SelectFieldProps) {
    // Find matching option object from string value
    const selectedOption = options.find((opt) => opt.value === value) || null;

    const handleSelectChange = (newValue: SingleValue<Option>) => {
        onChange(name, newValue ? newValue.value : "");
    };

    return (
        <div>
            <label htmlFor={id} className="text-body-sm font-medium text-on-surface block mb-2">
                {label}
            </label>
            <Select
                unstyled
                id={id}
                name={name}
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                isSearchable
                placeholder={placeholder}
                classNames={{
                    control: ({ isFocused }) =>
                        `rounded-md border bg-surface-container-low px-4 py-2.5 transition-all ${isFocused
                            ? "border-primary ring-1 ring-primary"
                            : "border-outline-variant"
                        }`,
                    valueContainer: () => "p-0",
                    input: () => "m-0 p-0 text-on-surface",
                    placeholder: () => "text-on-surface-variant",
                    indicatorsContainer: () => "gap-2",
                    dropdownIndicator: () =>
                        "text-on-surface-variant hover:text-primary",
                    clearIndicator: () =>
                        "text-on-surface-variant hover:text-primary",
                    menu: () =>
                        "mt-2 rounded-xl border border-outline-variant bg-white text-black shadow-lg overflow-hidden z-50",
                    menuList: () => "py-2",
                    option: ({ isFocused, isSelected }) =>
                        `cursor-pointer px-4 py-3 ${isSelected
                            ? "bg-primary text-white"
                            : isFocused
                                ? "bg-primary/10"
                                : "text-black"
                        }`,
                }}
            />
        </div>
    );
}