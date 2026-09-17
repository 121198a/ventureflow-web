import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const applySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  coverLetter: z.string().trim().min(20, "Cover letter must be at least 20 characters.").max(5000),
  roleSlug: z.string().trim().min(1, "Role slug is required."),
  roleTitle: z.string().trim().min(1, "Role title is required."),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    const rateLimit = checkRateLimit(`apply_${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many applications submitted from this network. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter || 3600) },
        }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid form data submission." },
        { status: 400 }
      );
    }

    const name = sanitizeHtml(String(formData.get("name") || "").trim());
    const email = sanitizeHtml(String(formData.get("email") || "").trim());
    const coverLetter = sanitizeHtml(String(formData.get("coverLetter") || "").trim());
    const roleSlug = sanitizeHtml(String(formData.get("roleSlug") || "").trim());
    const roleTitle = sanitizeHtml(String(formData.get("roleTitle") || "").trim());

    const parsed = applySchema.safeParse({
      name,
      email,
      coverLetter,
      roleSlug,
      roleTitle,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed." },
        { status: 400 }
      );
    }

    const file = formData.get("resume") as File | null;
    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Please attach a valid resume file." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Resume must be a PDF or Word document (.pdf, .doc, .docx)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Resume file size exceeds the 10 MB limit." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Application service is not configured. Please email careers@unboundxinc.com directly.",
        },
        { status: 503 }
      );
    }

    try {
      const { supabase } = await import("@/lib/supabase/client");
      const ext = file.name.split(".").pop() || "pdf";
      const path = `${parsed.data.roleSlug}/${crypto.randomUUID()}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error("[Careers Apply] Resume upload error:", uploadError);
        return NextResponse.json(
          { success: false, error: "Failed to upload resume. Please try again." },
          { status: 500 }
        );
      }

      const { error: insertError } = await supabase.from("applications").insert({
        role_slug: parsed.data.roleSlug,
        role_title: parsed.data.roleTitle,
        name: parsed.data.name,
        email: parsed.data.email,
        cover_letter: parsed.data.coverLetter,
        resume_path: path,
      });

      if (insertError) {
        console.error("[Careers Apply] Application DB insert error:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to save application. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully.",
      });
    } catch (err) {
      console.error("[Careers Apply] Unexpected service error:", err);
      return NextResponse.json(
        { success: false, error: "Failed to process application. Please try again later." },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
