"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordField({
  id,
  placeholder,
  value,
  onChange,
  autoComplete = "new-password",
  className,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
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
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-hairline bg-background px-4 py-3 pr-11 text-[0.9rem] outline-none focus:border-brand"
        style={{ fontWeight: 500 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 transition-colors hover:text-ink"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
