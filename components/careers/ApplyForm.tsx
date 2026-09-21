"use client";

import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches bucket limit
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  coverLetter: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters).")
    .max(5000),
});

type Status = "idle" | "submitting" | "success" | "error";

export function ApplyForm({
  roleSlug,
  roleTitle,
}: {
  roleSlug: string;
  roleTitle: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = schema.safeParse({ name, email, coverLetter });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Please check the form.");
      setStatus("error");
      return;
    }
    if (!file) {
      setMessage("Please attach your resume.");
      setStatus("error");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage("Resume must be a PDF or Word document.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("Resume must be smaller than 10 MB.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", parsed.data.name);
      formData.append("email", parsed.data.email);
      formData.append("coverLetter", parsed.data.coverLetter);
      formData.append("roleSlug", roleSlug);
      formData.append("roleTitle", roleTitle);
      formData.append("resume", file);

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.error || "Something went wrong while submitting. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while submitting. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Application received</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">Thank you, {name.split(" ")[0]}.</p>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          We have received your application for <b className="text-slate-900">{roleTitle}</b>. Our talent team reviews every submission and responds within five business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-5" noValidate>
      <div>
        <label htmlFor="apply-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Full name <span className="text-rose-500">*</span>
        </label>
        <input
          id="apply-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          maxLength={100}
          required
          className="input-fintech"
        />
      </div>
      <div>
        <label htmlFor="apply-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Work Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="apply-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={255}
          required
          className="input-fintech"
        />
      </div>
      <div>
        <label htmlFor="apply-resume" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Resume (PDF or Word, max 10 MB) <span className="text-rose-500">*</span>
        </label>
        <input
          id="apply-resume"
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm text-slate-600 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer"
        >
          <span className="truncate">{file ? file.name : "Choose a file…"}</span>
          <Upload size={15} className="text-blue-600 shrink-0" />
        </button>
      </div>
      <div>
        <label htmlFor="apply-cover" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Cover letter &amp; portfolio notes <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="apply-cover"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Why this role, why you, and links to your best work."
          rows={5}
          maxLength={5000}
          required
          className="input-fintech resize-y"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-pill-primary w-full cursor-pointer disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Submitting Application…</span>
          </>
        ) : (
          `Apply — ${roleTitle}`
        )}
      </button>
    </form>
  );
}
