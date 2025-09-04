"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Bot, HelpCircle, IdCard, LogIn, AlertTriangle, Shield, Phone } from "lucide-react";

// Import Leaflet CSS dynamically
import("leaflet/dist/leaflet.css");

// Socket.io connection
const socketUrl = process.env.NODE_ENV === 'production' 
  ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co:3001`
  : "http://localhost:3001";
  
export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
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
  const [leafletIcon, setLeafletIcon] = useState(null);
  const [safetyScore, setSafetyScore] = useState(100);
  const [isInRiskZone, setIsInRiskZone] = useState(false);
  const [emergencyContacts] = useState([
    { name: "Police", number: "100" },
    { name: "Emergency Services", number: "108" },
    { name: "Tourist Helpline", number: "1363" }
  ]);

  // Risk zones data
  const riskZones = [
    { id: 1, name: "Forest Area", lat: 26.1445, lng: 91.7362, radius: 2000, risk: "high" },
    { id: 2, name: "Remote Hills", lat: 26.1545, lng: 91.7462, radius: 1500, risk: "medium" },
    { id: 3, name: "Border Area", lat: 26.1345, lng: 91.7262, radius: 3000, risk: "high" }
  ];

  const router = useRouter();

  // Initialize Leaflet icon on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      const icon = L.icon({
        iconUrl: "/pin.png",
        iconSize: [22, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setLeafletIcon(icon);
    }
  }, []);

  // Calculate safety score based on location
  const calculateSafetyScore = (lat, lng) => {
    let score = 100;
    let inRiskZone = false;
    
    riskZones.forEach(zone => {
      const distance = getDistance(lat, lng, zone.lat, zone.lng);
      if (distance < zone.radius) {
        inRiskZone = true;
        score -= zone.risk === 'high' ? 40 : 20;
      }
    });
    
    setIsInRiskZone(inRiskZone);
    return Math.max(score, 0);
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Track my location
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          
          // Calculate safety score
          const score = calculateSafetyScore(latitude, longitude);
          setSafetyScore(score);
          
          socket.emit("send-location", { latitude, longitude, safetyScore: score });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  // Panic button handler
  const handlePanicButton = () => {
    if (position && confirm("Are you sure you want to send a panic alert? Emergency services will be notified immediately.")) {
      const alertData = {
        type: 'panic',
        touristId: socket.id,
        location: { lat: position[0], lng: position[1] },
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      
      // Send to backend
      socket.emit("panic-alert", alertData);
      
      // Show confirmation
      alert("Emergency alert sent! Help is on the way. Stay calm and stay where you are if safe.");
    }
  };

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

  if (!position || !leafletIcon) {
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
      <nav className="w-full bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-cyan-600">Travling!</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              <Shield className="w-5 h-5" />
              Dashboard
            </button>
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
        </div>
        
        {/* Safety Status Bar */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${safetyScore >= 70 ? 'text-green-600' : safetyScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`} />
              <span className="text-sm font-medium text-gray-700">Safety Score:</span>
              <span className={`text-sm font-bold ${safetyScore >= 70 ? 'text-green-600' : safetyScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {safetyScore}%
              </span>
            </div>
            
            {isInRiskZone && (
              <div className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Risk Zone Alert</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handlePanicButton}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition transform hover:scale-105 shadow-lg"
          >
            <AlertTriangle className="w-5 h-5" />
            PANIC BUTTON
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
                icon={leafletIcon}
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

      {/* Emergency Contacts Floating Panel */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <Phone className="w-4 h-4 mr-2 text-red-600" />
          Emergency Contacts
        </h3>
        <div className="space-y-2">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{contact.name}</span>
              <a 
                href={`tel:${contact.number}`}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
        © 2025 Travling - Smart Tourist Safety System |{" "}
        <a href="#" className="text-cyan-600 hover:underline">
          Terms & Conditions
        </a>
        {" | "}
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Tourism Department Dashboard
        </a>
      </footer>
    </div>
  );
};

export default Home;
