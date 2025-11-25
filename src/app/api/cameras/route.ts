
import { NextResponse } from 'next/server';
import convert from 'xml-js';

const getText = (node: any): string => (node && node._text ? node._text.toString() : '');

export async function GET() {
  try {
    let res;
    try {
      res = await fetch(
        'https://trafficnz.info/service/traffic/rest/4/cameras/all',
        {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        }
      );
    } catch (fetchError) {
      console.error('Failed to fetch from external API:', fetchError);
      return new NextResponse('Failed to fetch from external API', { status: 502 }); // Bad Gateway
    }

    if (!res.ok) {
      return new NextResponse(`External API returned an error: ${res.statusText}`, {
        status: res.status,
      });
    }

    const xmlText = await res.text();
    if (!xmlText) {
      return new NextResponse('API returned empty response', { status: 500 });
    }

    const result = convert.xml2js(xmlText, { compact: true, spaces: 2 });
    const cameraList = (result as any)?.response?.camera;

    if (!cameraList) {
      return new NextResponse('Unexpected data structure from API', { status: 500 });
    }

    const cameras: any[] = Array.isArray(cameraList) ? cameraList : [cameraList];

    const cameraData = cameras.map(cam => {
        const lat = parseFloat(getText(cam.latitude));
        const lon = parseFloat(getText(cam.longitude));

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {
            id: getText(cam.id),
            name: getText(cam.name),
            region: cam.region?.name?._text || 'N/A',
            latitude: lat,
            longitude: lon,
            imageUrl: getText(cam.imageUrl),
            viewUrl: `https://trafficnz.info${getText(cam.imageUrl)}`,
            description: getText(cam.description),
            direction: getText(cam.direction),
            status: 'Active',
        }
    }).filter(Boolean);

    return NextResponse.json(cameraData);
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
