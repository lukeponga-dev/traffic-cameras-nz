import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView({ cameras }) {
  return (
    <MapContainer center={[-41.2865, 174.7762]} zoom={6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map(camera => (
        <Marker key={camera.id} position={[camera.lat, camera.lng]}>
          <Popup>
            {camera.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
