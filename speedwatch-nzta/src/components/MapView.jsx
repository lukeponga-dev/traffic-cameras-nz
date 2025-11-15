import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView({ cameras, events }) {
  return (
    <MapContainer center={[-41.2865, 174.7762]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map(camera => (
        <Marker key={`cam-${camera.id}`} position={[camera.lat, camera.lng]}>
          <Popup>
            {camera.name}
            <br />
            <button>Route to</button>
            <button>Add waypoint</button>
          </Popup>
        </Marker>
      ))}
      {events.map(event => (
        <Marker key={`evt-${event.id}`} position={[event.lat, event.lng]}>
          <Popup>
            {event.title}
             <br />
            <button>Route to event</button>
            <button>Add waypoint</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
