"use client"
import dynamic from 'next/dynamic'
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

const icon = L.icon({
  iconUrl: "/pin.png",
  iconSize: [22, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const socket = io("http://localhost:3000", {
  transports: ["websocket"], 
});

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const mapStyles = {
  height: "500px",
  width: "100%",
};

const Home = () => {
  const [position, setPosition] = useState(null); // start as null
  const [userLocations, setUserLocations] = useState({});

  // Track my location
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]); // first set gives initial map center
          socket.emit("send-location", { latitude, longitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  // Socket listeners
  useEffect(() => {
    socket.on("receive-location", (data) => {
      const { id, latitude, longitude } = data;
      setUserLocations((prev) => ({
        ...prev,
        [id]: { latitude, longitude, id }
      }));
    });

    socket.on("user-disconnected", (id) => {
      setUserLocations((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      socket.off("receive-location");
      socket.off("user-disconnected");
    };
  }, []);

  // If no position yet, show loading
  if (!position) {
    return (
      <div className="m-10 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='m-10'> 
      <MapContainer
        style={mapStyles}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show all user markers */}
        {Object.values(userLocations).map((user) => (
          <Marker 
            key={user.id} 
            position={[user.latitude, user.longitude]}
            icon={icon}
          >
            <Popup>
              User ID: {user.id}<br />
              Lat: {user.latitude.toFixed(6)}<br />
              Lng: {user.longitude.toFixed(6)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
};

export default Home;
