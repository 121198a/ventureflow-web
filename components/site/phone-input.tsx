"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type Country = { name: string; code: string; dial: string };

export const COUNTRIES: Country[] = [
  { name: "United States", code: "US", dial: "+1" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Brazil", code: "BR", dial: "+55" },
];

export function toE164(dial: string, phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const dialDigits = dial.replace(/[^\d]/g, "");
  if (digits.startsWith(dialDigits)) {
    return `+${digits}`;
  }
  return `${dial}${digits}`;
}

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (phone: string, fullE164: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  defaultCountryCode?: string;
}

export function PhoneInput({
  id = "phone-input",
  value,
  onChange,
  disabled = false,
  placeholder = "(555) 000-0000",
  className = "",
  defaultCountryCode = "US",
}: PhoneInputProps) {
  const initialCountry =
    COUNTRIES.find((c) => c.code === defaultCountryCode) || COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q)
    );
  }, [search]);

  const handlePhoneChange = (val: string) => {
    const e164 = toE164(selectedCountry.dial, val);
    onChange(val, e164);
  };

  const handleSelectCountry = (c: Country) => {
    setSelectedCountry(c);
    setDropdownOpen(false);
    setSearch("");
    const e164 = toE164(c.dial, value);
    onChange(value, e164);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "relative flex items-center w-full h-[clamp(2.75rem,6.4vh,3.8rem)] rounded-[clamp(12px,0.98vw,17px)]",
        "border border-slate-200 bg-white transition-all",
        "focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10",
        className
      )}
    >
      {/* Country dropdown trigger (seamlessly embedded inside input container) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="h-full px-3.5 flex items-center gap-1.5 text-[length:clamp(0.9rem,1.05vw,1.05rem)] font-medium text-slate-700 hover:bg-slate-50 border-r border-slate-200/80 rounded-l-[clamp(12px,0.98vw,17px)] shrink-0 transition-colors cursor-pointer disabled:opacity-60 select-none"
        aria-label="Select country calling code"
      >
        <span className="font-semibold text-slate-900">{selectedCountry.code}</span>
        <span className="text-slate-400 font-normal text-xs">{selectedCountry.dial}</span>
        <ChevronsUpDown className="size-3.5 text-slate-400" />
      </button>

      {/* Country search dropdown popover */}
      {dropdownOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-slate-900/10">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code"
              autoFocus
              className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 text-xs">
            {filteredCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelectCountry(c)}
                className={cn(
                  "w-full px-3 py-2 text-left flex items-center justify-between hover:bg-blue-50/80 rounded-lg transition-colors cursor-pointer",
                  selectedCountry.code === c.code
                    ? "bg-blue-50 font-bold text-blue-700"
                    : "text-slate-700 font-medium"
                )}
              >
                <span>{c.name}</span>
                <span className="text-slate-400 font-mono">({c.dial})</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="py-4 text-center text-xs text-slate-400">No country found</div>
            )}
          </div>
        </div>
      )}

      {/* Integrated phone number input */}
      <input
        id={id}
        type="tel"
        autoComplete="tel"
        value={value}
        disabled={disabled}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent px-[clamp(0.85rem,1.2vw,1.25rem)] text-[length:clamp(1rem,1.1vw,1.15rem)] font-medium text-slate-900 placeholder:font-medium placeholder:text-slate-400 outline-none rounded-r-[clamp(12px,0.98vw,17px)] disabled:opacity-60"
      />
    </div>
  );
}
