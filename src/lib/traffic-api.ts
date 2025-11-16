
'use client';

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

async function fetchTrafficData(resource: string, params: Record<string, string> = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}/api/traffic/${resource}${queryString ? `?${queryString}` : ''}`;
  
  const res = await fetch(url, {
    next: { revalidate: 60 } // Revalidate every minute
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${resource}: ${res.statusText}`);
  }
  return res.json();
}


export async function getCameras(): Promise<Camera[]> {
  try {
    const data = await fetchTrafficData('cameras/all');
    
    if (!data || !data.features) {
      console.error('Unexpected data structure from API. Full result:', JSON.stringify(data, null, 2));
      return [];
    }

    return data.features.map((feature: any) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;

      return {
        id: props.id,
        name: props.name,
        region: props['region/name'] || 'N/A',
        latitude: coords[1],
        longitude: coords[0],
        imageUrl: `https://www.trafficnz.info${props.imageUrl}`,
        viewUrl: `https://www.trafficnz.info${props.imageUrl}`,
        description: props.description,
        direction: props.direction,
        status: props.offline === 'false' ? 'Active' : 'Inactive',
      };
    }).filter((c: any): c is Camera => c !== null);
    
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return []; // Return empty array on error to prevent app crashes.
  }
}
