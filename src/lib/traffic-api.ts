import { z } from 'zod';

const CameraSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string(),
  viewUrl: z.string(),
  description: z.string(),
  direction: z.string(),
  status: z.enum(['Active', 'Inactive']),
});

export type Camera = z.infer<typeof CameraSchema>;

export async function getCameras(): Promise<Camera[]> {
  try {
    const res = await fetch('/api/cameras');
    if (!res.ok) {
      throw new Error('Failed to fetch cameras');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return [];
  }
}
