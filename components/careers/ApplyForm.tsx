"use client";

import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

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

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

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
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${roleSlug}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("applications").insert({
        role_slug: roleSlug,
        role_title: roleTitle,
        name: parsed.data.name,
        email: parsed.data.email,
        cover_letter: parsed.data.coverLetter,
        resume_path: path,
      });
      if (insertError) throw insertError;

      setStatus("success");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while submitting. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface p-5 sm:p-8 text-center">
        <p className="eyebrow justify-center">Application received</p>
        <p className="display mt-4 text-2xl">Thank you, {name.split(" ")[0]}.</p>
        <p className="mt-3 text-sm text-text-secondary">
          We have your application for {roleTitle}. We reply within five
          working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface space-y-5 p-5 sm:p-8" noValidate>
      <div>
        <label htmlFor="apply-name" className="eyebrow">
          Full name
        </label>
        <input
          id="apply-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          maxLength={100}
          required
          className={`mt-2 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="apply-email" className="eyebrow">
          Email
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
          className={`mt-2 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="apply-resume" className="eyebrow">
          Resume (PDF or Word, max 10 MB)
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
          className="mt-2 flex w-full items-center justify-between rounded-xl border border-dashed border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-brand"
        >
          <span className="truncate">{file ? file.name : "Choose a file…"}</span>
          <span className="text-brand">↑</span>
        </button>
      </div>
      <div>
        <label htmlFor="apply-cover" className="eyebrow">
          Cover letter
        </label>
        <textarea
          id="apply-cover"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Why this role, why you."
          rows={6}
          maxLength={5000}
          required
          className={`mt-2 resize-y ${inputClass}`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="block w-full rounded-full bg-brand px-6 py-4 text-center text-sm font-semibold text-brand-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? "Submitting…" : `Apply — ${roleTitle}`}
      </button>
    </form>
  );
}
