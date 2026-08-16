import { ChevronDown } from "lucide-react";

export default function SelectField({ label, defaultValue }: { label: string; defaultValue: string }) {
    return (
        <div>
            <label className="text-body-sm font-medium text-on-surface block mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    defaultValue={defaultValue}
                    className="w-full appearance-none bg-surface border border-outline-variant rounded-md px-3.5 py-2.5 pr-9 text-body-md text-on-surface outline-none focus:border-primary"
                >
                    <option>{defaultValue}</option>
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
            </div>
        </div>
    );
}
