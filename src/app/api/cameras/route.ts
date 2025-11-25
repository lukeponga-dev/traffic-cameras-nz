
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
      const errorText = await res.text();
      console.error(`External API returned an error: ${res.status} ${res.statusText}`, errorText);
      return new NextResponse(`External API returned an error: ${res.statusText}`, {
        status: res.status,
      });
    }

    const xmlText = await res.text();
    if (!xmlText) {
      console.error('API returned empty response');
      return new NextResponse('API returned empty response', { status: 500 });
    }

    let result;
    try {
      result = convert.xml2js(xmlText, { compact: true, spaces: 2 });
    } catch (parseError) {
      console.error('Failed to parse XML:', parseError);
      console.error('XML content that failed to parse:', xmlText);
      return new NextResponse('Failed to parse XML from external API', { status: 500 });
    }

    const cameraList = (result as any)?.response?.camera;

    if (!cameraList) {
      console.error('Unexpected data structure from API. Parsed result:', result);
      return new NextResponse('Unexpected data structure from API', { status: 500 });
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
            region: cam.region?.name?._text || 'N/A',
            latitude: lat,
            longitude: lon,
            imageUrl: getText(cam.imageUrl),
            viewUrl: `https://trafficnz.info${getText(cam.viewUrl)}`,
            description: getText(cam.description),
            direction: getText(cam.direction),
            status: getText(cam.offline) === 'true' ? 'Offline' : 'Active',
        }
    }).filter(Boolean);

    return NextResponse.json(cameraData);
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
