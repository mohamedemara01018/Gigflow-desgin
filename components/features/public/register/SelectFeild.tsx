import Select from "react-select";

type Option = {
    value: string;
    label: string;
};

interface SelectFieldProps {
    name?: string;
    id?: string;
    options: Option[];
}

export default function SelectField({
    name,
    id,
    options,
}: SelectFieldProps) {
    return (
        <Select
            unstyled
            options={options}
            isSearchable
            name={name}
            id={id}
            placeholder="Select..."
            classNames={{
                control: ({ isFocused }) =>
                    `min-h-18 rounded-xl border bg-surface-container-low px-4 py-4 transition-all ${isFocused
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
                    "mt-2 rounded-xl border border-outline-variant bg-white shadow-lg overflow-hidden",

                menuList: () => "py-2",

                option: ({ isFocused, isSelected }) =>
                    `cursor-pointer px-4 py-3 ${isSelected
                        ? "bg-primary text-white"
                        : isFocused
                            ? "bg-primary/10"
                            : "text-on-surface"
                    }`,
            }}
        />
    );
}