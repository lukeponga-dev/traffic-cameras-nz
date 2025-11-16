
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all', 
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from NZTA API: ${res.statusText}`);
    }

    const xmlText = await res.text();
    
    return new Response(xmlText, {
      headers: { 'Content-Type': 'application/xml' },
    });

  } catch (error) {
    console.error('Error in /api/cameras route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
