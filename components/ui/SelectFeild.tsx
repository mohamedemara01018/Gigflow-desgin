import React from "react";
import Select, { MultiValue, SingleValue } from "react-select";

export type Option = {
    value: string;
    label: string;
};

interface SelectFieldProps {
    name: string;
    id?: string;
    label: string;
    options: Option[];
    value?: string | string[] | null;
    onChange: (name: string, value: string | string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    isMulti?: boolean;
}

export default function SelectField({
    name,
    id,
    label,
    options,
    value,
    onChange,
    placeholder = "Select...",
    disabled,
    isMulti = false,
}: SelectFieldProps) {
    // Determine selected option(s) based on value type
    const selectedOption = isMulti
        ? options.filter((opt) => Array.isArray(value) && value.includes(opt.value))
        : options.find((opt) => opt.value === value) || null;

    const handleSelectChange = (
        newValue: MultiValue<Option> | SingleValue<Option>
    ) => {
        if (isMulti) {
            const selectedValues = (newValue as MultiValue<Option>).map((opt) => opt.value);
            onChange(name, selectedValues);
        } else {
            const singleVal = newValue as SingleValue<Option>;
            onChange(name, singleVal ? singleVal.value : "");
        }
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
                isMulti={isMulti}
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                isSearchable
                placeholder={placeholder}
                isDisabled={disabled}
                classNames={{
                    control: ({ isFocused }) =>
                        `rounded-md border bg-surface-container-low px-4 py-2.5 transition-all ${isFocused
                            ? "border-primary ring-1 ring-primary"
                            : "border-outline-variant"
                        }`,
                    valueContainer: () => "p-0 gap-1 flex-wrap",
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
                    multiValue: () =>
                        "bg-primary-container/20 text-primary rounded px-2 py-0.5 text-xs flex items-center gap-1 me-1",
                    multiValueLabel: () => "text-primary font-medium",
                    multiValueRemove: () =>
                        "text-primary hover:text-error transition-colors cursor-pointer",
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