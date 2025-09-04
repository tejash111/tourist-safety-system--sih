"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Bot, HelpCircle, IdCard, LogIn } from "lucide-react";

// Leaflet custom icon
const icon = L.icon({
  iconUrl: "/pin.png",
  iconSize: [22, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Socket.io connection
export const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

// Dynamic imports for Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const mapStyles = {
  height: "500px",
  width: "100%",
};

const Home = () => {
  const [position, setPosition] = useState(null);
  const [userLocations, setUserLocations] = useState({});
  const [chatOpen, setChatOpen] = useState(false);

  const router = useRouter();

  // Track my location
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
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
        [id]: { latitude, longitude, id },
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-cyan-600">Travling!</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition">
            <IdCard className="w-5 h-5" />
            Aadhaar Verification
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition"
          >
            <Bot className="w-5 h-5" />
            Chatbot
          </button>
          <button
            onClick={() => router.push("/auth")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            <LogIn className="w-5 h-5" />
            Login / Register
          </button>
        </div>
      </nav>

      {/* Map */}
      <main className="flex-1 p-6">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <MapContainer
            style={mapStyles}
            center={position}
            zoom={13}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                  User ID: {user.id}
                  <br />
                  Lat: {user.latitude.toFixed(6)}
                  <br />
                  Lng: {user.longitude.toFixed(6)}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>

      {/* Chatbot Section */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-2xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-cyan-600 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> Help Chatbot
            </h2>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
          <div className="h-40 overflow-y-auto text-sm text-gray-700 mb-3 border p-2 rounded-lg">
            <p className="text-gray-500">Hello! How can I help you today?</p>
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
        © 2025 Travling |{" "}
        <a href="#" className="text-cyan-600 hover:underline">
          Terms & Conditions
        </a>
      </footer>
    </div>
  );
};

export default Home;
