import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-input border bg-background px-4 py-2.5 text-[0.9rem] text-ink placeholder:text-muted-foreground/70 transition-colors",
          "border-hairline focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
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
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[90px] w-full rounded-input border bg-background px-4 py-2.5 text-[0.9rem] text-ink placeholder:text-muted-foreground/70 transition-colors",
          "border-hairline focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
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
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-[0.875rem] font-semibold text-ink leading-none mb-2 select-none", className)}
      {...props}
    >
      {children}
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
      className={cn("text-[0.8rem] font-medium text-destructive mt-1.5", className)}
      {...props}
    >
      {children}
    </p>
  );
}
