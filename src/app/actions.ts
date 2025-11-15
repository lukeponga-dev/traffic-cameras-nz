"use server";

import { z } from "zod";
import { reportDataError } from "@/ai/flows/report-data-error";

// This schema must be compatible with the one in the GenAI flow
const reportSchema = z.object({
  cameraId: z.string().optional(),
  reportType: z.enum([
    "incorrect_speed_limit",
    "incorrect_location",
    "other",
  ]),
  description: z.string().min(10, "Please provide at least 10 characters."),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export type State = {
  status: "success" | "error" | "idle";
  message: string;
};

export async function submitReport(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const parsed = reportSchema.safeParse({
      cameraId: formData.get("cameraId"),
      reportType: formData.get("reportType"),
      description: formData.get("description"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.errors.map((e) => e.message).join(", "),
      };
    }
    
    const { latitude, longitude, ...reportData } = parsed.data;

    let userLocation;
    if (latitude && longitude) {
      userLocation = { latitude, longitude };
    }

    const aiResponse = await reportDataError({
      ...reportData,
      cameraId: reportData.cameraId || "N/A",
      userLocation,
    });

    console.log("AI suggestion received:", aiResponse);
    // You could now save the AI summary to the report in your DB,
    // or flag it for moderator review.

    return {
      status: "success",
      message: "Thank you! Your report has been submitted for review.",
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
