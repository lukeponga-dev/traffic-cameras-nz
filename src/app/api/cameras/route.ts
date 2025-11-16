
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This route acts as a proxy to the external NZTA API.
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all',
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      // If the external API call fails, forward the error status.
      return new NextResponse(`Failed to fetch from external API: ${res.statusText}`, {
        status: res.status,
      });
    }

    const xmlText = await res.text();
    // Return the fetched XML data with the correct content type.
    return new NextResponse(xmlText, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
