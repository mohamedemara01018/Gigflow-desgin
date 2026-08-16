'use client';

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isPassword?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ isPassword, id, placeholder, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const type = isPassword ? (showPassword ? 'text' : 'password') : props.type;

    return (
        <div className={`relative transition-transform w-full ${isFocused ? 'scale-[1.01]' : ''}`}>
            <input
                {...props}
                type={type}
                id={id}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                placeholder={placeholder}
                className="block w-full px-4 py-4 text-on-surface bg-surface-container-low border border-outline-variant rounded-xl focus:ring-0 focus:border-primary peer transition-all outline-none"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary focus:outline-none"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    );
};