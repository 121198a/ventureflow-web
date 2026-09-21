import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, success, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "input-fintech shadow-2xs",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100 text-rose-900",
          success && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-100",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "input-fintech min-h-[90px] shadow-2xs",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100 text-rose-900",
          success && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-100",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  required,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      className={cn("block text-[0.825rem] font-semibold text-slate-800 leading-none mb-2 select-none", className)}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export function FormError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn("text-[0.78rem] font-medium text-rose-600 mt-1.5 flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function FormHelper({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p
      className={cn("text-[0.78rem] text-slate-500 mt-1.5 leading-normal", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function FormSuccess({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p
      role="status"
      className={cn("text-[0.78rem] font-medium text-emerald-600 mt-1.5 flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}
