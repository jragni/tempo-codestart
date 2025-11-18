/**
 * Select
 * @description Enhanced UI select component with better styling and UX
 */
"use client";
import { ChangeEventHandler } from "react";
import { Select } from "react-daisyui"
import { FaChevronDown } from "react-icons/fa";

interface BaseSelectProps {
  className?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>
  options: OptionProps[];
  style?: React.CSSProperties;
  value: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
};

interface OptionProps {
  label: string;
  value: string;
};

export default function BaseSelect ({
  className = "",
  onChange,
  options,
  style,
  value,
  label,
  disabled = false,
  error,
  placeholder,
}: BaseSelectProps) {
  const { Option } = Select;

  const selectElement = (
    <>
      <div className="relative inline-block">
        <Select
          className={`
            select
            bg-base-100
            text-base-content
            border-base-300
            focus:border-primary
            focus:outline-primary
            hover:border-primary/50
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
            ${error ? 'border-error focus:border-error focus:outline-error' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          onChange={onChange}
          size="md"
          style={style}
          value={value}
          disabled={disabled}
        >
          <>
            {placeholder && (
              <Option key="placeholder" value="" disabled>
                {placeholder}
              </Option>
            )}
            {options.map(({ label, value: optionValue }: OptionProps) => (
              <Option
                className="text-base-content hover:bg-primary/10"
                key={`${optionValue}-label-${label}`}
                value={optionValue}
              >
                {label}
              </Option>
            ))}
          </>
        </Select>
        {/* Chevron icon - positioned absolutely */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <FaChevronDown className="w-3 h-3 text-base-content/50" />
        </div>
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </>
  );

  // If label or error, wrap in form-control for proper spacing
  if (label || error) {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-semibold text-base-content/90">{label}</span>
          </label>
        )}
        {selectElement}
      </div>
    );
  }

  // Otherwise return just the select element
  return selectElement;
}