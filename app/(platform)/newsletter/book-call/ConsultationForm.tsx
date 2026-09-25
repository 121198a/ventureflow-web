"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "09:30 AM EST",
  "11:00 AM EST",
  "01:30 PM EST",
  "03:00 PM EST",
  "04:30 PM EST",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type BookingStep = "datetime" | "details" | "review" | "confirmed";

interface ConfirmedBooking {
  referenceCode: string;
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  targetRaise: string;
  instrument: string;
  duration: string;
  timezone: string;
}

export function ConsultationForm() {
  const [step, setStep] = useState<BookingStep>("datetime");

  // Calendar State (defaults to current date / next business day)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Pick next business day by default
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const y = nextDay.getFullYear();
    const m = String(nextDay.getMonth() + 1).padStart(2, "0");
    const d = String(nextDay.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("11:00 AM EST");

  // Contact Form Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [targetRaise, setTargetRaise] = useState("$1M - $3M");
  const [instrument, setInstrument] = useState("SAFE (Post-Money)");
  const [notes, setNotes] = useState("");

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: Array<{ dayNumber: number; dateString: string; isPast: boolean; isWeekend: boolean } | null> = [];

    // Blank leading cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      dateObj.setHours(0, 0, 0, 0);
      const isPast = dateObj <= today;
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const y = currentYear;
      const m = String(currentMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateString = `${y}-${m}-${dStr}`;

      days.push({
        dayNumber: d,
        dateString,
        isPast,
        isWeekend,
      });
    }

    return days;
  }, [currentYear, currentMonth, today]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Form Validation
  const validateDetails = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid work email address.");
      return false;
    }
    if (!company.trim()) {
      setError("Please enter your company or venture name.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleGoToDetails = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setError("Please select both a date and an available time slot.");
      return;
    }
    setError(null);
    setStep("details");
  };

  const handleGoToReview = () => {
    if (!validateDetails()) return;
    setStep("review");
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim() || undefined,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          targetRaise,
          instrument,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to reserve your session. Please try a different slot.");
        return;
      }

      setConfirmedBooking(data.booking);
      setStep("confirmed");
    } catch {
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Human-readable formatted date
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  // ICS File generator for calendar invite
  const generateIcsFile = () => {
    if (!confirmedBooking) return;
    const [y, m, d] = confirmedBooking.date.split("-");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UBverse//Capital Markets Consultation//EN
BEGIN:VEVENT
SUMMARY:UBverse Capital Markets Working Session - ${confirmedBooking.company}
DESCRIPTION:20-Minute institutional working session with UBverse deal leads.\\nRef: ${confirmedBooking.referenceCode}\\nFounder: ${confirmedBooking.name}
DTSTART:${y}${m}${d}T150000Z
DTEND:${y}${m}${d}T152000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ubverse-session-${confirmedBooking.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // STEP 4: CONFIRMATION VIEW
  if (step === "confirmed" && confirmedBooking) {
    return (
      <div className="py-6 space-y-6 text-left">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 p-6 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
            <CheckCircle2 className="size-8" />
          </span>
          <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-wider text-emerald-700">
            Confirmed Working Session
          </p>
          <h3 className="font-editorial text-[1.6rem] leading-tight text-ink mt-1">
            Session Reserved
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Reference ID:{" "}
            <span className="font-mono font-bold text-ink">{confirmedBooking.referenceCode}</span>
          </p>
        </div>

        {/* Booking Card */}
        <div className="rounded-xl border border-hairline bg-surface p-5 space-y-3.5">
          <div className="flex items-center gap-3 text-sm text-ink font-semibold">
            <CalendarIcon className="size-4 text-brand shrink-0" />
            <span>{formattedSelectedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink font-semibold">
            <Clock className="size-4 text-brand shrink-0" />
            <span>{confirmedBooking.timeSlot} ({confirmedBooking.duration})</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/80 border-t border-hairline pt-3">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span>{confirmedBooking.name} &middot; {confirmedBooking.company}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/80">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <span>{confirmedBooking.email}</span>
          </div>
        </div>

        {/* What to expect next */}
        <div className="rounded-lg border border-hairline bg-surface-alt p-4 text-xs leading-relaxed text-ink/80 space-y-2">
          <p className="font-bold uppercase tracking-wider text-[0.7rem] text-brand">
            What Happens Next
          </p>
          <p>
            1. An institutional calendar invitation with a video room link has been sent to{" "}
            <strong>{confirmedBooking.email}</strong>.
          </p>
          <p>
            2. A 1-page preparatory ledger worksheet will arrive prior to the call so our analysts
            can pre-populate your five numbers.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={generateIcsFile}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-brand-strong transition-colors cursor-pointer"
          >
            <Download className="size-4" />
            Add to Calendar (.ics)
          </button>
          <Link
            href="/newsletter"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-brand transition-colors text-center"
          >
            Return to Newsletter
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Progress Step Header */}
      <div className="mb-6 flex items-center justify-between border-b border-hairline pb-3 text-xs">
        <span
          className={cn(
            "font-semibold flex items-center gap-1.5",
            step === "datetime" ? "text-brand" : "text-muted-foreground"
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-brand/10 text-[0.65rem] font-bold">1</span>
          Date & Time
        </span>
        <span className="text-muted-foreground">&rarr;</span>
        <span
          className={cn(
            "font-semibold flex items-center gap-1.5",
            step === "details" ? "text-brand" : "text-muted-foreground"
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-brand/10 text-[0.65rem] font-bold">2</span>
          Venture Details
        </span>
        <span className="text-muted-foreground">&rarr;</span>
        <span
          className={cn(
            "font-semibold flex items-center gap-1.5",
            step === "review" ? "text-brand" : "text-muted-foreground"
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-brand/10 text-[0.65rem] font-bold">3</span>
          Review
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: DATE & TIME */}
      {step === "datetime" && (
        <div className="space-y-6">
          {/* Calendar Box */}
          <div className="rounded-xl border border-hairline bg-surface p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-ink">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-alt hover:text-ink cursor-pointer transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-alt hover:text-ink cursor-pointer transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-9 w-full" />;
                }

                const isSelected = selectedDate === cell.dateString;
                const isDisabled = cell.isPast || cell.isWeekend;

                return (
                  <button
                    key={cell.dateString}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedDate(cell.dateString);
                      if (error) setError(null);
                    }}
                    className={cn(
                      "h-9 w-full rounded-md text-xs font-semibold transition-all flex items-center justify-center cursor-pointer",
                      isSelected && "bg-brand text-white shadow-xs font-bold",
                      !isSelected && !isDisabled && "text-ink hover:bg-surface-alt hover:border hover:border-brand/40",
                      isDisabled && "text-muted-foreground/30 cursor-not-allowed bg-transparent"
                    )}
                  >
                    {cell.dayNumber}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[0.7rem] text-muted-foreground text-center">
              Available Monday through Friday &middot; 20-minute working sessions
            </p>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/75 mb-2.5">
              <Clock className="size-3.5 text-brand" />
              Available Time Slots ({formattedSelectedDate || "Select a date"})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      if (error) setError(null);
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-center",
                      isSelected
                        ? "border-brand bg-brand/10 text-brand font-bold shadow-2xs"
                        : "border-hairline bg-surface text-ink/80 hover:border-brand/50 hover:bg-surface-alt"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoToDetails}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-xs font-bold text-primary-foreground hover:bg-brand-strong transition-colors cursor-pointer shadow-sm"
          >
            Continue to Venture Details
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* STEP 2: VENTURE DETAILS */}
      {step === "details" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-surface border border-hairline p-3 text-xs text-ink/80 flex items-center justify-between">
            <span className="font-semibold text-brand">
              {formattedSelectedDate} &middot; {selectedTimeSlot}
            </span>
            <button
              type="button"
              onClick={() => setStep("datetime")}
              className="text-[0.75rem] text-muted-foreground hover:text-brand underline cursor-pointer"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Lee"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Work Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="jordan@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Acme Therapeutics"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (error) setError(null);
                }}
                className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Target Raise
              </label>
              <select
                value={targetRaise}
                onChange={(e) => setTargetRaise(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option>&lt; $1M</option>
                <option>$1M - $3M</option>
                <option>$3M - $5M</option>
                <option>$5M+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Instrument
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option>SAFE (Post-Money)</option>
                <option>SAFE (Pre-Money)</option>
                <option>Convertible Note</option>
                <option>Priced Equity (Series A)</option>
                <option>Undecided</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Specific Objectives (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Pressure-testing our runway buffer and SAFE dilution before meeting lead investors."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-brand resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep("datetime")}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-brand transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleGoToReview}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-brand-strong transition-colors cursor-pointer shadow-sm"
            >
              Review Booking
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW BOOKING */}
      {step === "review" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-hairline bg-surface p-5 space-y-4">
            <h3 className="font-editorial text-[1.2rem] leading-tight text-ink border-b border-hairline pb-2.5">
              Review Session Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-[0.68rem] font-bold">
                  Date & Time
                </p>
                <p className="mt-1 font-semibold text-ink">{formattedSelectedDate}</p>
                <p className="text-brand font-medium">{selectedTimeSlot} (20 min)</p>
              </div>

              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-[0.68rem] font-bold">
                  Founder
                </p>
                <p className="mt-1 font-semibold text-ink">{name}</p>
                <p className="text-muted-foreground">{email}</p>
              </div>

              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-[0.68rem] font-bold">
                  Company
                </p>
                <p className="mt-1 font-semibold text-ink">{company}</p>
                {phone && <p className="text-muted-foreground">{phone}</p>}
              </div>

              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-[0.68rem] font-bold">
                  Round Structure
                </p>
                <p className="mt-1 font-semibold text-ink">{targetRaise}</p>
                <p className="text-muted-foreground">{instrument}</p>
              </div>
            </div>

            {notes && (
              <div className="border-t border-hairline pt-3 text-xs">
                <p className="text-muted-foreground uppercase tracking-wider text-[0.68rem] font-bold">
                  Notes
                </p>
                <p className="mt-1 text-ink/80 italic">&ldquo;{notes}&rdquo;</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep("details")}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-brand transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Edit
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-xs font-bold text-primary-foreground hover:bg-brand-strong transition-colors cursor-pointer shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Confirming Session...
                </>
              ) : (
                <>
                  Schedule Working Session
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
