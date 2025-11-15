import axios from "axios";

const BASE_URL = "https://trafficnz.info/service/traffic/rest/4";

export async function getRoadEvents(region) {
  try {
    const res = await axios.get(`${BASE_URL}/findRoadEventsAll`);
    // The API returns all events, so we filter by region
    if (region) {
        return res.data.filter(event => event.region === region);
    }
    return res.data;
  } catch (err) {
    console.error("NZTA API error:", err);
    return [];
  }
}

export async function getCameras(region) {
    try {
        const res = await axios.get(`${BASE_URL}/findCamerasAll`);
        // The API returns all cameras, so we filter by region
        if (region) {
            return res.data.filter(cam => cam.region === region);
        }
        return res.data;
    } catch (err) {
        console.error("NZTA API error:", err);
        return [];
    }
}
