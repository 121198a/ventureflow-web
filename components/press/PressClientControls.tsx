"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyBoilerplateButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-600" />
          <span className="text-emerald-700">Copied</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          <span>Copy boilerplate</span>
        </>
      )}
    </button>
  );
}

export function ColorSwatch({
  name,
  hex,
  usage,
  colorClass,
}: {
  name: string;
  hex: string;
  usage: string;
  colorClass: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className={`h-12 w-full rounded-lg border border-slate-100 ${colorClass}`} />
        <p className="mt-3 text-xs font-bold text-slate-900">{name}</p>
        <p className="mt-1 text-xs text-slate-500 leading-snug">{usage}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="font-mono text-xs font-medium text-slate-600">{hex}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${hex}`}
          className="text-slate-400 hover:text-slate-700 text-xs inline-flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}
