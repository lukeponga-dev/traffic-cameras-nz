
<<<<<<< HEAD
'use client';
=======
const getText = (node: any): string => (node && node._text ? node._text.toString() : '');

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
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f

// 1. Type Definitions

<<<<<<< HEAD
export interface Bounds {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export interface Camera {
  id: string;
  name: string;
  lat: number;
  lon: number;
  imageUrl: string | null;
  region?: string;
  road?: string;
  updatedAt?: string;
  status: 'Active' | 'Inactive';
  direction: string;
  description: string;
}

export interface RoadEvent {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  lat?: number;
  lon?: number;
  road?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

// 2. Normalizers

function normalizeCamera(cam: any): Camera {
    const props = cam.properties;
    const coords = cam.geometry.coordinates;
    return {
        id: props.id,
        name: props.name || props.description,
        lat: coords[1],
        lon: coords[0],
        imageUrl: props.imageUrl ? `https://www.trafficnz.info${props.imageUrl}` : null,
        region: props['region/name'] || 'N/A',
        road: props.highway || null,
        updatedAt: cam.lastModified || null,
        status: props.status === 'Active' ? 'Active' : 'Inactive',
        direction: props.direction,
        description: props.description,
    };
}

function normalizeEvent(evt: any): RoadEvent {
    const props = evt.properties;
    const coords = evt.geometry.coordinates;
    return {
        id: props.id || evt.eventId,
        type: props.type || props.category,
        severity: props.severity || 'unknown',
        title: props.title || props.summary,
        description: props.description || '',
        lat: coords ? coords[1] : undefined,
        lon: coords ? coords[0] : undefined,
        road: props.road || props.route || null,
        startTime: props.startTime || null,
        endTime: props.endTime || null,
        status: props.status || 'active'
    };
}


// 3. Client Fetcher

async function fetchWithFallback<T>(resource: string, params: Record<string, string> = {}): Promise<T[]> {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/traffic/${resource}${queryString ? `?${queryString}` : ''}`;

  try {
    const resp = await fetch(url, {
        next: { revalidate: 60 } // Revalidate every minute
    });
    if (!resp.ok) {
        throw new Error(`Upstream ${resp.status}`);
    }
    const raw = await resp.json();
    
    if (raw && raw.features && Array.isArray(raw.features)) {
        return raw.features;
    }

    return Array.isArray(raw) ? raw : [];
  } catch (err) {
    console.warn(`Fallback triggered for ${resource}:`, err);
    return []; // Return empty array on error
=======
// To be used by client components, fetches from the API route
export async function getCameras(): Promise<Camera[]> {
  try {
    // If running on the server (during pre-rendering), use an absolute URL.
    // If running on the client, use a relative URL.
    const baseUrl = typeof window === 'undefined' ? 'http://127.0.0.1:3000' : '';
    const res = await fetch(`${baseUrl}/api/cameras`);
    if (!res.ok) {
      throw new Error('Failed to fetch cameras');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return [];
  }
}

// To be used by server components, fetches directly from the source
export async function fetchAndProcessCameras(): Promise<Camera[]> {
  try {
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all',
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch cameras from external API');
    }

    const xmlText = await res.text();
    if (!xmlText) {
      throw new Error('External API returned empty response');
    }

    const result = convert.xml2js(xmlText, { compact: true, spaces: 2 });
    const cameraList = (result as any)?.response?.camera;

    if (!cameraList) {
      throw new Error('Unexpected data structure from API');
    }

    const cameras: any[] = Array.isArray(cameraList) ? cameraList : [cameraList];

    const cameraData = cameras.map(cam => {
        if (!cam || !cam.latitude || !cam.longitude) {
            return null;
        }

        const lat = parseFloat(getText(cam.latitude));
        const lon = parseFloat(getText(cam.longitude));

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {
            id: getText(cam.id),
            name: getText(cam.name),
            region: getText(cam.region?.name) || 'N/A',
            latitude: lat,
            longitude: lon,
            imageUrl: getText(cam.imageUrl),
            viewUrl: `https://trafficnz.info${getText(cam.viewUrl)}`,
            description: getText(cam.description),
            direction: getText(cam.direction),
            status: getText(cam.offline) === 'true' ? 'Inactive' : 'Active',
        }
    }).filter(Boolean) as Camera[];

    return cameraData;
  } catch (error) {
    console.error('Error fetching and processing cameras:', error);
    return [];
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
  }
}

export async function getCameras(): Promise<Camera[]> {
    const raw = await fetchWithFallback<any[]>('camera/all');
    return raw.map(normalizeCamera);
}

export async function getCamerasWithinBounds(bounds: Bounds): Promise<Camera[]> {
    const qs = new URLSearchParams(bounds as any).toString();
    const raw = await fetchWithFallback<any[]>(`findCamerasWithinBounds?${qs}`);
    return raw.map(normalizeCamera);
}

export async function getRoadEventsByRegion(region: string): Promise<RoadEvent[]> {
    const raw = await fetchWithFallback<any[]>(`findRoadEventsByRegion?region=${region}`);
    return raw.map(normalizeEvent);
}

