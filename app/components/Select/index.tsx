/**
 * Select
 * @description Base UI select component
 */
"use client";
import { ChangeEventHandler } from "react";
import { Select } from "react-daisyui"

interface BaseSelectProps {
  className?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>
  options: OptionProps[];
  value: string;
};

interface OptionProps {
  label: string;
  value: string;
};

export default function BaseSelect ({
  className,
  onChange,
  options,
  value,
}: BaseSelectProps) {
  const { Option } = Select;

  return (
    <Select
      className={`select bg-secondary-content text-secondary ${className}`}
      onChange={onChange}
      size="md"
      value={value}
    >
      {options.map(({ label, value: optionValue }: OptionProps) => (
        <Option
          className="text-secondary"
          key={`${optionValue}-label-${label}`}
          value={optionValue}
        >
          {label}
        </Option>
      ))}
    </Select>
  )
}