"use server";
// actions/pitch.ts
// ─────────────────────────────────────────────────────────────────────────────

import { pitchFormSchema, type PitchFormValues } from "@/config/pitch-schema";

// ── Action Return Type ────────────────────────────────────────────────────────
export type PitchActionResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof PitchFormValues, string[]>> };

// ── Server Action ─────────────────────────────────────────────────────────────
export async function submitPitch(
  rawData: PitchFormValues
): Promise<PitchActionResult> {
  // 1. Server-side validation (never trust the client)
  const parsed = pitchFormSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Partial<
      Record<keyof PitchFormValues, string[]>
    >;
    return {
      success: false,
      error: "Validation failed. Please check your inputs.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // 2. Check webhook URL is configured
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[E-Cell] WEBHOOK_URL environment variable is not set.");
    return {
      success: false,
      error: "Submission service is temporarily unavailable. Please try again later or email us directly.",
    };
  }

  // 3. Post to Google Apps Script / Zapier / Make webhook
  try {
    const payload = {
      name: data.name,
      email: data.email,
      ideaName: data.ideaName,
      stage: data.stage,
      problem: data.problem,
      submittedAt: new Date().toISOString(),
      source: "E-Cell Website Pitch Portal",
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        `[E-Cell] Webhook responded with status ${response.status}:`,
        await response.text().catch(() => "(no body)")
      );
      return {
        success: false,
        error: "We couldn't save your submission right now. Please try again in a moment.",
      };
    }

    // 4. Success!
    console.log(`[E-Cell] Pitch submitted successfully by ${data.email} for "${data.ideaName}"`);

    return {
      success: true,
      message:
        "Your pitch has been received! We'll review it and reach out within 5 business days. The future is being built — and you're part of it.",
    };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[E-Cell] Webhook request timed out.");
      return {
        success: false,
        error: "The request timed out. Please check your connection and try again.",
      };
    }

    console.error("[E-Cell] Unexpected error during pitch submission:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again or email us directly.",
    };
  }
}