
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const NZTA_BASE_URL = 'https://api.trafficnz.info/v2';
const CACHE_TTL_SECONDS = 60; // Cache for 60 seconds

// Whitelist of allowed resources to prevent arbitrary proxying
const ALLOWED_RESOURCES = new Set([
    'camera/all',
    'camera/region',
    // Future resources can be added here
    // 'road/events/all',
    // 'journeys'
]);

// Function to check if a path segment is allowed
function isResourceAllowed(path: string): boolean {
    // Simple check for now, can be expanded for more complex patterns
    return ALLOWED_RESOURCES.has(path);
}

// Cached fetch function
const getCachedData = unstable_cache(
    async (resourcePath: string, searchParams: string) => {
        const targetUrl = `${NZTA_BASE_URL}/${resourcePath}${searchParams ? `?${searchParams}` : ''}`;
        console.log(`Fetching from upstream: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Upstream API error for ${targetUrl}: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Upstream API error: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return response.json();
        } else {
            // If the response isn't JSON, return it as raw text
            return { raw: await response.text() };
        }
    },
    ['nzta-traffic-data'], // Cache key prefix
    { revalidate: CACHE_TTL_SECONDS } // Cache duration
);


export async function GET(
  req: Request,
  { params }: { params: { resource: string[] } }
) {
  const resourcePath = params.resource.join('/');
  
  if (!isResourceAllowed(resourcePath)) {
      return NextResponse.json({ error: 'Unsupported resource' }, { status: 400 });
  }
  
  const { searchParams } = new URL(req.url);
  const searchParamsString = searchParams.toString();

  try {
    const data = await getCachedData(resourcePath, searchParamsString);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy error for /api/traffic/${resourcePath}:`, error);
    
    return NextResponse.json(
        { error: 'Upstream API error', detail: error.message },
        { status: 502 } // Bad Gateway
    );
  }
}
