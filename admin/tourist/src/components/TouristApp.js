"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, HelpCircle, IdCard, LogOut, AlertTriangle, Shield, Phone, MapPin } from "lucide-react";

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
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

const mapStyles = {
  height: "500px",
  width: "100%",
};

const TouristApp = () => {
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

  // Heatmap zones with risk levels around user location
  const [heatmapZones, setHeatmapZones] = useState([]);
  
  // Generate random heatmap zones around user's location
  const generateHeatmapZones = (userLat, userLng) => {
    const zones = [];
    const zoneTypes = [
      { name: "Construction Site", risk: "high", color: "#ef4444", radius: 800 },
      { name: "Dense Traffic Area", risk: "medium", color: "#f59e0b", radius: 1200 },
      { name: "Crowded Market", risk: "medium", color: "#f59e0b", radius: 600 },
      { name: "Industrial Zone", risk: "high", color: "#ef4444", radius: 1500 },
      { name: "Railway Crossing", risk: "high", color: "#ef4444", radius: 400 },
      { name: "Bus Terminal", risk: "medium", color: "#f59e0b", radius: 800 },
      { name: "Dark Alley", risk: "high", color: "#ef4444", radius: 300 },
      { name: "Tourist Hotspot", risk: "low", color: "#10b981", radius: 1000 },
      { name: "Police Station Area", risk: "low", color: "#10b981", radius: 500 },
      { name: "Hospital Zone", risk: "low", color: "#10b981", radius: 700 }
    ];

    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180); // Distribute around circle
      const distance = 0.01 + Math.random() * 0.02; // Random distance up to ~2km
      const zoneType = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
      
      zones.push({
        id: i + 1,
        name: zoneType.name,
        lat: userLat + distance * Math.cos(angle),
        lng: userLng + distance * Math.sin(angle),
        radius: zoneType.radius + Math.random() * 200,
        risk: zoneType.risk,
        color: zoneType.color,
        intensity: 0.3 + Math.random() * 0.4
      });
    }
    
    return zones;
  };

  const router = useRouter();
  const { user, logout } = useAuth();

  // Initialize Leaflet icon on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      
      // Fix for default markers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      
      const icon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });
      setLeafletIcon(icon);
    }
  }, []);

  // Calculate safety score and check for zone warnings
  const calculateSafetyScore = (lat, lng) => {
    let score = 100;
    let inRiskZone = false;
    let currentZones = [];
    
    heatmapZones.forEach(zone => {
      const distance = getDistance(lat, lng, zone.lat, zone.lng);
      if (distance < zone.radius) {
        inRiskZone = true;
        currentZones.push(zone);
        
        if (zone.risk === 'high') {
          score -= 30;
          // Show warning for high risk zones
          if (typeof window !== 'undefined' && document && !document.querySelector('.risk-warning-active')) {
            showLocationWarning(zone);
          }
        } else if (zone.risk === 'medium') {
          score -= 15;
        }
      }
    });
    
    setIsInRiskZone(inRiskZone);
    return Math.max(score, 0);
  };

  // Show location-based warning
  const showLocationWarning = (zone) => {
    if (typeof window !== 'undefined' && document) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'risk-warning-active fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      warningDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-lg">⚠️</span>
          <span class="font-bold">WARNING: You've entered ${zone.name}</span>
        </div>
        <div class="text-sm mt-1">Stay alert and follow safety protocols</div>
      `;
      
      document.body.appendChild(warningDiv);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (warningDiv && warningDiv.parentNode) {
          warningDiv.remove();
        }
      }, 5000);
    }
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
          
          // Generate heatmap zones around user location (only once)
          if (heatmapZones.length === 0) {
            const zones = generateHeatmapZones(latitude, longitude);
            setHeatmapZones(zones);
          }
          
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
      setUserLocations(prev => ({
        ...prev,
        [id]: { latitude, longitude, id },
      }));
    });

    socket.on("user-disconnected", (id) => {
      setUserLocations(prev => {
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

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

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
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-cyan-600">Travling!</h1>
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
            )}
          </div>
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
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
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

      {/* Dashboard Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Safety Score</p>
                <p className="text-2xl font-bold text-gray-900">{safetyScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Zones</p>
                <p className="text-2xl font-bold text-gray-900">{heatmapZones.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Risk Areas</p>
                <p className="text-2xl font-bold text-gray-900">{heatmapZones.filter(z => z.risk === 'high').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold text-gray-900">{isInRiskZone ? 'Alert' : 'Safe'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map with Heatmaps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Live Location & Risk Heatmap</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Safe Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Caution Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Risk Zone</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden" style={{ height: "500px" }}>
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={position}
              zoom={14}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Your current location */}
              <Marker position={position} icon={leafletIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>📍 Your Location</strong>
                    <br />
                    Safety Score: <span className={`font-bold ${safetyScore >= 70 ? 'text-green-600' : safetyScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{safetyScore}%</span>
                    <br />
                    Lat: {position[0].toFixed(6)}
                    <br />
                    Lng: {position[1].toFixed(6)}
                  </div>
                </Popup>
              </Marker>

              {/* Heatmap zones */}
              {heatmapZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  color={zone.color}
                  fillColor={zone.color}
                  fillOpacity={zone.intensity}
                  weight={2}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{zone.name}</strong>
                      <br />
                      Risk Level: <span className={`font-bold ${zone.risk === 'high' ? 'text-red-600' : zone.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {zone.risk.toUpperCase()}
                      </span>
                      <br />
                      Radius: {Math.round(zone.radius)}m
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Other users */}
              {Object.values(userLocations).map((user) => (
                <Marker
                  key={user.id}
                  position={[user.latitude, user.longitude]}
                  icon={leafletIcon}
                >
                  <Popup>
                    <div>
                      <strong>👤 Other Tourist</strong>
                      <br />
                      ID: {user.id.substring(0, 8)}...
                      <br />
                      Lat: {user.latitude.toFixed(6)}
                      <br />
                      Lng: {user.longitude.toFixed(6)}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Risk Zone Details */}
        {heatmapZones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🗺️ Nearby Risk Zones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heatmapZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    zone.risk === 'high' ? 'border-red-500 bg-red-50' :
                    zone.risk === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      zone.risk === 'high' ? 'bg-red-100 text-red-800' :
                      zone.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.risk.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Distance: ~{Math.round(getDistance(position[0], position[1], zone.lat, zone.lng))}m
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coverage: {Math.round(zone.radius)}m radius
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default TouristApp;