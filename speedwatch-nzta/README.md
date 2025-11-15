cd speedwatch-nzta
npm install
npm start
# SpeedWatch NZTA 🚦

A modern web app that integrates NZTA Waka Kotahi traffic APIs with a real-time map overlay.  
Built with React + Leaflet + Firebase for resilient ingestion, graceful error handling, and recruiter-friendly polish.

✨ Features
- Live traffic cameras (NZTA REST API)
- Road events & incidents (closures, crashes, weather alerts)
- Region filters (Waikato, Auckland, Wellington, etc.)
- Firebase backend ingestion for push notifications
- Leaflet map overlays with camera/event markers

🛠️ Tech Stack
- Frontend: React, TailwindCSS, Leaflet
- Backend: Node.js, Firebase Functions
- Data: NZTA REST API (https://trafficnz.info/service/traffic/rest/4)

🚀 Getting Started
```bash
git clone https://github.com/your-username/speedwatch-nzta.git
cd speedwatch-nzta
npm install
npm start
```

🔌 Example API Usage
```js
import axios from "axios";

const BASE_URL = "https://trafficnz.info/service/traffic/rest/4";

export async function getCameras(region = "Waikato") {
  const res = await axios.get(`${BASE_URL}/findCamerasAll`);
  return res.data.filter(cam => cam.region === region);
}
```

📍 Roadmap
- [ ] Push notification triggers for incidents
- [ ] Historical data visualization
- [ ] Mobile-first UI polish
- [ ] Recruiter-friendly portfolio grid integration
