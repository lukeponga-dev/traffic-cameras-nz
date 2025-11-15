
import { NextResponse } from 'next/server';
import { getCameras } from '@/lib/traffic-api';

export async function GET() {
  const cameras = await getCameras();
  return NextResponse.json(cameras);
}
