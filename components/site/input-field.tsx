"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared field chrome for every UBverse authentication form.
 * (Figtree is inherited from the site — never set a font-family here.)
 */
export const AUTH_INPUT_CLASS = cn(
  "block w-full h-[clamp(2.75rem,6.4vh,3.8rem)] rounded-[clamp(12px,0.98vw,17px)]",
  "border border-[#dae4f6] bg-white px-[clamp(1rem,1.4vw,1.5rem)]",
  "text-[length:clamp(1rem,1.1vw,1.15rem)] font-medium text-[#0b1a33]",
  "placeholder:font-medium placeholder:text-[#8b94a8]",
  "outline-none transition-all",
  "focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
);

export const AUTH_LABEL_CLASS =
  "block text-[length:clamp(0.9rem,1.17vw,1.25rem)] font-semibold leading-snug text-[#0b1a33]";

export const AUTH_HELPER_CLASS =
  "text-[length:clamp(0.8rem,0.99vw,1.05rem)] font-medium leading-[1.5] text-[#4d586e]";

/** Vertical rhythm between field groups (28px on the 941px-tall reference). */
export const AUTH_STACK_GAP = "gap-[clamp(0.9rem,2.9vh,1.75rem)]";
/** Gap between a label and its control (15px on the reference). */
export const AUTH_LABEL_GAP = "gap-[clamp(0.4rem,1.45vh,0.9rem)]";

export function FieldLabel({
  htmlFor,
  children,
  srOnly = false,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  srOnly?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn(srOnly ? "sr-only" : AUTH_LABEL_CLASS, className)}>
      {children}
    </label>
  );
}

interface InputFieldProps {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
  hideLabel?: boolean;
  required?: boolean;
}

/** Labelled text/email input using the shared UBverse auth field styling. */
export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "email",
  autoComplete = "email",
  hideLabel = false,
  required = true,
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col", AUTH_LABEL_GAP)}>
      <FieldLabel htmlFor={id} srOnly={hideLabel}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={AUTH_INPUT_CLASS}
      />
    </div>
  );
}
