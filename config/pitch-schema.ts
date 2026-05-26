// config/pitch-schema.ts
import { z } from "zod";

export const pitchFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(80, { message: "Name must be under 80 characters." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes.",
    }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(254, { message: "Email address is too long." }),

  ideaName: z
    .string()
    .min(3, { message: "Idea name must be at least 3 characters." })
    .max(120, { message: "Idea name must be under 120 characters." }),

  stage: z.enum(["idea", "prototype", "mvp", "revenue"] as const, {
    error: "Please select your current stage.",
  }),

  problem: z
    .string()
    .min(50, {
      message: "Please describe the problem in at least 50 characters.",
    })
    .max(2000, {
      message: "Problem description must be under 2000 characters.",
    }),
});

export type PitchFormValues = z.infer<typeof pitchFormSchema>;