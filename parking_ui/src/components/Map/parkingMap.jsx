import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// eslint-disable-next-line react/prop-types
const ParkingMap = ({ coordinates }) => {
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const showRouting = (map) => {
    if (userLocation && coordinates) {
      L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(parseFloat(coordinates[0]), parseFloat(coordinates[1])),
        ],
        routeWhileDragging: true,
        show: true,
        createMarker: function () {
          return null;
        },
      }).addTo(map);
    }
  };

  const RenderRouting = () => {
    const map = useMap();
    showRouting(map);
    return null;
  };

  return (
    <div className="h-96 w-full overflow-hidden object-contain z-10">
      <MapContainer
        center={userLocation}
        zoom={15}
        className="w-full h-96"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">PPV</a> contributors'
        />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {coordinates && (
          <Marker
            position={[parseFloat(coordinates[0]), parseFloat(coordinates[1])]}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}

        <RenderRouting />
      </MapContainer>
    </div>
  );
};

export default ParkingMap;
