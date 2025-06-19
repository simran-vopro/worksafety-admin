import type { FC, ChangeEvent } from "react";

interface SelectProps {
    id?: string;
    name?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const Select: FC<SelectProps> = ({
    id,
    name,
    value,
    onChange,
    className = "",
    disabled = false,
    success = false,
    error = false,
    hint,
    options,
    placeholder,
}) => {
    let selectClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

    if (disabled) {
        selectClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        selectClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (success) {
        selectClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
        selectClasses += ` border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800`;
    }

    return (
        <div className="relative">
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={selectClasses}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {hint && (
                <p
                    className={`mt-1.5 text-xs ${error
                            ? "text-error-500"
                            : success
                                ? "text-success-500"
                                : "text-gray-500"
                        }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Select;
