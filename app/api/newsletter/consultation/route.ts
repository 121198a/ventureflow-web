import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const consultationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().min(5).max(254).email("Invalid work email address"),
  company: z.string().trim().min(1, "Company name is required").max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  timeSlot: z.string().min(3, "Time slot is required"),
  targetRaise: z.string().optional(),
  instrument: z.string().optional(),
  phone: z.string().max(30).optional(),
  notes: z.string().max(1000).optional(),
});

// In-memory booked sessions set for the server lifetime (preventing double booking of same slot)
const bookedSlots = new Set<string>();

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limit: Max 5 booking requests per 15 minutes per IP
    const rateLimit = checkRateLimit(`consultation_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many scheduling attempts. Please wait a few minutes before trying again.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter || 900) },
        }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    if (typeof rawBody === "object" && rawBody !== null) {
      const b = rawBody as Record<string, unknown>;
      if (typeof b.name === "string") b.name = sanitizeHtml(b.name.trim());
      if (typeof b.email === "string") b.email = sanitizeHtml(b.email.trim());
      if (typeof b.company === "string") b.company = sanitizeHtml(b.company.trim());
      if (typeof b.notes === "string") b.notes = sanitizeHtml(b.notes.trim());
      if (typeof b.phone === "string") b.phone = sanitizeHtml(b.phone.trim());
    }

    const parsed = consultationSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid consultation details.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${data.date}T00:00:00`);
    if (selectedDate < today) {
      return NextResponse.json(
        { success: false, error: "Selected date is in the past. Please select an upcoming business day." },
        { status: 400 }
      );
    }

    // Check weekends
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        { success: false, error: "Consultations are held on business days (Monday–Friday) only." },
        { status: 400 }
      );
    }

    // Prevent double booking of identical slot
    const slotKey = `${data.date}_${data.timeSlot}`;
    if (bookedSlots.has(slotKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot has just been reserved by another founder. Please select another time.",
        },
        { status: 409 }
      );
    }

    bookedSlots.add(slotKey);

    // Generate reference code
    const refCode = `UBV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      booking: {
        referenceCode: refCode,
        name: data.name,
        email: data.email,
        company: data.company,
        date: data.date,
        timeSlot: data.timeSlot,
        targetRaise: data.targetRaise || "$1M - $3M",
        instrument: data.instrument || "SAFE",
        duration: "20 minutes",
        timezone: "Eastern Time (US & Canada)",
      },
      message: "Consultation successfully scheduled.",
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Consultation Booking Error]:", err);
    }
    return NextResponse.json(
      { success: false, error: "Failed to process consultation booking. Please try again." },
      { status: 500 }
    );
  }
}
