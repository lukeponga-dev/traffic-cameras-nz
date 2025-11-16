
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.trafficnz.info/v2/camera/all', 
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from NZTA API: ${res.statusText}`);
    }

    const data = await res.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/cameras route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
