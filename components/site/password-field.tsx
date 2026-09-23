"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_INPUT_CLASS } from "./input-field";

export function PasswordField({
  id,
  placeholder,
  value,
  onChange,
  autoComplete = "new-password",
  className,
  ariaLabel,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(AUTH_INPUT_CLASS, "pr-[clamp(2.75rem,3.6vw,3.5rem)]")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-[clamp(0.9rem,1.5vw,1.5rem)] top-1/2 -translate-y-1/2 text-slate-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 rounded"
      >
        {visible ? (
          <EyeOff strokeWidth={2.2} className="size-[clamp(1.1rem,1.3vw,1.4rem)]" />
        ) : (
          <Eye strokeWidth={2.2} className="size-[clamp(1.1rem,1.3vw,1.4rem)]" />
        )}
      </button>
    </div>
  );
}
