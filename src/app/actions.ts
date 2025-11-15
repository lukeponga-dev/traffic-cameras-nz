'use server';

import { z } from 'zod';

export type State = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

const reportFormSchema = z.object({
  cameraId: z.string().optional(),
  reportType: z.enum(
    ["incorrect_speed_limit", "incorrect_location", "other"],
  ),
  description: z.string(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function submitReport(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const validatedFields = reportFormSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        return {
            status: 'error',
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    console.log('New report submitted:');
    console.log('Camera ID:', validatedFields.data.cameraId);
    console.log('Report Type:', validatedFields.data.reportType);
    console.log('Description:', validatedFields.data.description);
    console.log('Location:', validatedFields.data.latitude, validatedFields.data.longitude);
    
    return {
      status: 'success',
      message: 'Your report has been successfully submitted. Thank you for your feedback!',
    };
  } catch (e) {
    console.error('An unexpected error occurred:', e);
    return {
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
