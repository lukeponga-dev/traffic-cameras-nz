
'use client';

// 1. Type Definitions

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

