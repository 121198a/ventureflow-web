"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared field chrome for every VentureFlow authentication form.
 * (Figtree is inherited from the site — never set a font-family here.)
 */
export const AUTH_INPUT_CLASS = cn(
  "block w-full h-[clamp(2.4rem,4.4vh,3.1rem)] rounded-[clamp(10px,0.85vw,14px)]",
  "border border-slate-200 bg-white px-[clamp(0.85rem,1.2vw,1.25rem)]",
  "text-[length:clamp(0.88rem,1vw,1.05rem)] font-medium text-slate-900",
  "placeholder:font-medium placeholder:text-slate-400",
  "outline-none transition-all",
  "focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
);

export const AUTH_LABEL_CLASS =
  "block text-[length:clamp(0.82rem,0.95vw,1.05rem)] font-semibold leading-snug text-slate-900";

export const AUTH_HELPER_CLASS =
  "text-[length:clamp(0.75rem,0.85vw,0.9rem)] font-medium leading-[1.4] text-slate-600";

/** Vertical rhythm between field groups (28px on the 941px-tall reference). */
export const AUTH_STACK_GAP = "gap-[clamp(0.55rem,1.6vh,1.15rem)]";
/** Gap between a label and its control (15px on the reference). */
export const AUTH_LABEL_GAP = "gap-[clamp(0.2rem,0.7vh,0.5rem)]";

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

/** Labelled text/email input using the shared VentureFlow auth field styling. */
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
