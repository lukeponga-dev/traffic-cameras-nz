import { fetchAndProcessCameras } from '@/lib/traffic-api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cameraData = await fetchAndProcessCameras();
    return NextResponse.json(cameraData);
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
