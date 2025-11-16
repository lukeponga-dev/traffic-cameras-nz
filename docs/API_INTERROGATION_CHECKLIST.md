# NZTA REST API v4 Interrogation Checklist

This document provides a reusable template for querying and processing data from the NZTA (Waka Kotahi) REST API v4. Use this checklist to ensure a consistent and reliable workflow when fetching traffic cameras, road events, and travel times.

---

## 🚦 Step-by-Step Interrogation Workflow

### 1. Define the Core Question
First, clearly state what information you need. This will guide your entire query and data processing logic.

**Examples:**
- "What are all the active traffic cameras in the Wellington region?"
- "Are there any active road closures or major crashes on SH1 between Auckland and Hamilton?"
- "What is the current estimated travel time for the main routes through Christchurch?"

### 2. Identify the Correct API Endpoint
Based on your question, choose the appropriate endpoint from the [NZTA Traffic API v4](https://trafficnz.info/service/traffic/rest/4).

- **Traffic Cameras**:
  - `findCamerasAll`
  - `findCamerasByRegion/{region}`
  - `findCamerasWithinBounds/{minLat}/{minLon}/{maxLat}/{maxLon}`
- **Road Events**:
  - `findRoadEventsAll`
  - `findRoadEventsByRegion/{region}`
  - `findRoadEventsByEventId/{eventId}`
- **Travel Times / Journeys**:
  - `findJourneysAll`
  - `findJourneysByRegion/{region}`
- **Variable Message Signs (VMS)**:
  - `findVmsSignsByRegion/{region}`

### 3. Query the API (Interrogation)
Make a `GET` request to the selected endpoint. In the SpeedWatch project, this is handled via a Next.js API route (`/api/cameras`, etc.) to act as a proxy, avoiding CORS issues and allowing for server-side caching.

**Example Request (Conceptual):**
```javascript
// Fetch all cameras via the application's proxy
const response = await fetch('/api/cameras');
const xmlText = await response.text();
```

### 4. Parse, Filter, and Aggregate the Results
The NZTA API returns data in XML format. You must parse this into a usable structure (like JSON) and then process it.

- **Parse**: Convert the raw XML response into a JavaScript object.
- **Filter**: Narrow down the results to match your specific criteria.
  - *Example*: Keep only cameras where `region` is "Waikato".
  - *Example*: Keep only events where `category` is "Crash" or "Road Closed".
- **Aggregate**: If necessary, summarize the data.
  - *Example*: Count the number of active incidents per region.
  - *Example*: Calculate the average speed limit across a set of cameras.

**Example Code Snippet (`traffic-api.ts`):**
```typescript
// 1. Parse XML to JS object
const result = convert.xml2js(xmlText, { compact: true });
const cameraList = result?.response?.cameras?.camera;

// 2. Map and Filter
const cameras = cameraList.map(cam => {
    // ...transform to Camera object
}).filter(camera => camera.status === 'Active' && camera.region === 'Waikato');
```

### 5. Validate the Data
Before using the data, perform quick sanity checks to ensure its quality and relevance.

- **Check Timestamps**: Does the data have a `lastUpdated` field? Is it recent? Stale data can be misleading.
- **Check for Null or Incomplete Data**: Are essential fields like `latitude`, `longitude`, or `id` missing? Handle these cases gracefully by filtering out invalid entries.
- **Check Status Fields**: Does the item (camera, event) have a status like "Active" or "Inactive"? Filter based on the desired status.

### 6. Visualize or Consume the Data
With clean, validated data, you can now use it in the application.

- **Map Visualization**: Render the data points (cameras, events) as markers on the map. Use different icons or colors to represent different states (e.g., green for active, red for offline).
- **Dashboard Widgets**: Display aggregated data (counts, averages) in charts or summary cards.
- **Lists and Detail Views**: Show the filtered data in a scrollable list, allowing users to select an item for more details.

---

By following this checklist, you can systematically interrogate the NZTA API to reliably power the features in SpeedWatch.