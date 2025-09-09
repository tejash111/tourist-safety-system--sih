"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, HelpCircle, IdCard, LogOut, AlertTriangle, Shield, Phone, MapPin, Navigation, Users, Activity, Send } from "lucide-react";
import { Prompt } from "./prompt";
import Link from "next/link";
import Header from "./Header";

// Import Leaflet CSS dynamically
import("leaflet/dist/leaflet.css");

// Socket.io connection
const socketUrl = "http://localhost:3000";

export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
});

// Dynamic imports for Leaflet with better error handling
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-full rounded-lg"></div> }
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

const TouristApp = () => {


   const handleAI = async () => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCr7RlUz910nhaLin7YMj98DqEh83TgLCA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Prompt)
      });

      const data = await response.json();

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        setAiData(aiText);
      } else {
        console.error("AI response format unexpected:", data);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };
  
  const [aiData,setAiData]=useState("")
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userLocations, setUserLocations] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your travel assistant. How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [leafletIcon, setLeafletIcon] = useState(null);
  const [userLocationIcon, setUserLocationIcon] = useState(null);
  const [safetyScore, setSafetyScore] = useState(100);
  const [isInRiskZone, setIsInRiskZone] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [emergencyContacts] = useState([
    { name: "Police", number: "100" },
    { name: "Emergency Services", number: "108" },
    { name: "Tourist Helpline", number: "1363" },
    { name: "Fire Department", number: "101" }
  ]);

  // Heatmap zones with risk levels around user location
  const [heatmapZones, setHeatmapZones] = useState([]);

 const generateHeatmapZones = (userLat, userLng) => {
  const zones = [];

  // ✅ Add user's current location
  zones.push({
    id: 0,
    name: "You Are Here",
    lat: userLat,
    lng: userLng,
    radius: 700,
    risk: "low",
    color: "#059669", // green
    icon: "📍",
    intensity: 0.1
  });

  // ✅ Add exactly one red zone (high risk), non-overlapping
  const redZoneType = {
    name: "Danger Zone",
    risk: "high",
    color: "#dc9626ff", // red
    radius: 500,
    icon: "⚠️"
  };

  let redZoneLat, redZoneLng, distanceFromUser;
  const minDistance = 0.01; // ~1km (in degrees)

  // Try to generate a red zone that's at least 1km from user
  do {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 0.01 + Math.random() * 0.01; // between 1km and ~2km
    const dx = distance * Math.cos(angle);
    const dy = distance * Math.sin(angle);
    redZoneLat = userLat + dy;
    redZoneLng = userLng + dx;

    // Calculate straight-line distance in degrees
    distanceFromUser = Math.sqrt(Math.pow(redZoneLat - userLat, 2) + Math.pow(redZoneLng - userLng, 2));
  } while (distanceFromUser < minDistance);

  zones.push({
    id: 1,
    name: redZoneType.name,
    lat: redZoneLat,
    lng: redZoneLng,
    radius: redZoneType.radius,
    risk: redZoneType.risk,
    color: redZoneType.color,
    icon: redZoneType.icon,
    intensity: 0.4
  });

  return zones;
};


  const router = useRouter();
  const { user, logout } = useAuth();

  // Initialize Leaflet icons on client side with better styling
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

      // Regular user icon (blue)
      const regularIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      // Custom user location icon (red/larger)
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="
          background-color: #dc2626;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 10px;
            font-weight: bold;
          ">📍</div>
        </div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      setLeafletIcon(regularIcon);
      setUserLocationIcon(userIcon);
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
          score -= 25;
          // Show warning for high risk zones
          if (typeof window !== 'undefined' && document && !document.querySelector('.risk-warning-active')) {
            showLocationWarning(zone);
          }
        } else if (zone.risk === 'medium') {
          score -= 10;
        } else if (zone.risk === 'low') {
          score += 5; // Bonus for safe areas
        }
      }
    });

    setIsInRiskZone(inRiskZone);
    return Math.min(Math.max(score, 0), 100);
  };

  // Show location-based warning with better styling
  const showLocationWarning = (zone) => {
    if (typeof window !== 'undefined' && document) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'risk-warning-active fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-pulse';
      warningDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl animate-bounce">${zone.icon}</span>
          <div>
            <div class="font-bold text-lg"> RISK ZONE ALERT</div>
            <div class="text-sm opacity-90">Entered: ${zone.name}</div>
            <div class="text-xs opacity-75 mt-1">Stay alert and follow safety protocols</div>
          </div>
        </div>
      `;

      document.body.appendChild(warningDiv);

      // Auto remove after 6 seconds
      setTimeout(() => {
        if (warningDiv && warningDiv.parentNode) {
          warningDiv.style.opacity = '0';
          warningDiv.style.transform = 'translate(-50%, -100%)';
          setTimeout(() => warningDiv.remove(), 300);
        }
      }, 6000);
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

  // Enhanced location tracking with better error handling
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log('Location obtained:', { latitude, longitude, accuracy });

      setPosition([latitude, longitude]);
      setLocationAccuracy(accuracy);
      setLastUpdated(new Date());
      setLocationError(null);

      // Generate heatmap zones around user location (only once)
      if (heatmapZones.length === 0) {
        const zones = generateHeatmapZones(latitude, longitude);
        console.log('Generated zones:', zones);
        setHeatmapZones(zones);
      }

      // Calculate safety score
      const score = calculateSafetyScore(latitude, longitude);
      setSafetyScore(score);

      // Emit location to socket
      if (socket) {
        socket.emit("send-location", {
          latitude,
          longitude,
          safetyScore: score,
          accuracy,
          timestamp: new Date().toISOString()
        });
      }
    };

    const error = (err) => {
      console.error('Geolocation error:', err);
      let errorMessage = "Unable to retrieve your location.";

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable location permissions.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "Location request timed out. Trying again...";
          break;
      }

      setLocationError(errorMessage);

      // Retry after timeout error
      if (err.code === err.TIMEOUT) {
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(success, error, options);
        }, 3000);
      }
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(success, error, options);

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Panic button handler with enhanced feedback
  const handlePanicButton = () => {
    if (!position) {
      alert("Location not available. Cannot send panic alert.");
      return;
    }

    if (confirm(" EMERGENCY ALERT\n\nAre you sure you want to send a panic alert? This will immediately notify emergency services and nearby authorities of your location.\n\nClick OK to confirm or Cancel to abort.")) {
      const alertData = {
        type: 'panic',
        touristId: socket.id,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Tourist',
        location: { lat: position[0], lng: position[1] },
        timestamp: new Date().toISOString(),
        status: 'active',
        safetyScore: safetyScore
      };

      // Send to backend
      socket.emit("panic-alert", alertData);

      // Show enhanced confirmation
      const confirmDiv = document.createElement('div');
      confirmDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-8 rounded-2xl shadow-2xl z-50 text-center max-w-md';
      confirmDiv.innerHTML = `
        <div class="text-6xl mb-4"></div>
        <div class="text-xl font-bold mb-2">EMERGENCY ALERT SENT!</div>
        <div class="text-sm opacity-90 mb-4">Help is on the way. Emergency services have been notified of your location.</div>
        <div class="text-xs opacity-75">Stay calm and remain in a safe location if possible.</div>
        <button onclick="this.parentElement.remove()" class="mt-4 bg-white text-red-600 px-4 py-2 rounded-lg font-bold">OK</button>
      `;

      document.body.appendChild(confirmDiv);
      setTimeout(() => confirmDiv.remove(), 10000);
    }
  };

  // Enhanced chatbot functionality
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = { type: 'user', text: newMessage };
    setChatMessages(prev => [...prev, userMessage, { type: 'bot', text: 'Typing…' }]);

    (async () => {
      const instruction = {
        text: `You are a helpful travel safety assistant. Use the provided DATA to answer user questions concisely and clearly. If the answer is not in the data, say you don't have that specific information and suggest safe general guidance. Prefer district-specific insights when mentioned by the user.`
      };

      const body = {
        contents: [
          {
            parts: [
              instruction,
              ...Prompt.contents[0].parts,
              { text: `User question: ${newMessage.trim()}` }
            ]
          }
        ]
      };

      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCr7RlUz910nhaLin7YMj98DqEh83TgLCA", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'bot', text: reply };
          return updated;
        });
        setAiData(reply);
      } catch (err) {
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'bot', text: 'I ran into an issue fetching AI assistance. Please try again.' };
          return updated;
        });
      }
    })();

    setNewMessage('');
  };

  // Socket listeners with enhanced connection handling
  useEffect(() => {
    // Handle socket connection
    socket.on("connect", () => {
      console.log("Socket connected, requesting all user locations");
      socket.emit("request-all-locations");
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log("Socket reconnected, requesting all user locations");
      socket.emit("request-all-locations");
    });

    // Handle receiving all user locations
    socket.on("all-locations", (locations) => {
      console.log("Received all locations:", locations);
      setUserLocations(locations);
    });

    // Handle individual location updates
    socket.on("receive-location", (data) => {
      const { id, latitude, longitude, accuracy, timestamp, safetyScore } = data;
      setUserLocations(prev => ({
        ...prev,
        [id]: {
          latitude,
          longitude,
          id,
          accuracy,
          timestamp,
          safetyScore,
          lastUpdate: new Date().toISOString()
        },
      }));
    });

    // Handle user disconnection
    socket.on("user-disconnected", (id) => {
      console.log("User disconnected:", id);
      setUserLocations(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("reconnect");
      socket.off("all-locations");
      socket.off("receive-location");
      socket.off("user-disconnected");
    };
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  // Loading state with better UX
  if (!position && !locationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Getting Your Location</h2>
          <p className="text-gray-600 mb-4">Please allow location access for the best experience</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (locationError && !position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Location Error</h2>
          <p className="text-gray-600 mb-4">{locationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navbar */}
  <Header  user={user} safetyScore={safetyScore} handleLogout={() => handleLogout } handlePanicButton={() => handlePanicButton()}  isInRiskZone={isInRiskZone}  lastUpdated={lastUpdated} />
      {/* Enhanced Dashboard Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Safety Score</p>
                <p className="text-3xl font-bold text-gray-900">{safetyScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Risk Zones</p>
                <p className="text-3xl font-bold text-gray-900">{heatmapZones.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-yellow-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-gray-900">{heatmapZones.filter(z => z.risk === 'high').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Nearby Users</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(userLocations).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-fit">
          {/* Main Map */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="h-96 md:h-[500px] w-full relative">
              {position && (
                <MapContainer
                  center={position}
                  zoom={15}
                  className="h-full w-full rounded-2xl"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User's current location */}
                  <Marker position={position} icon={userLocationIcon}>
                    <Popup>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">Your Location</div>
                        <div className="text-sm text-gray-600">
                          Accuracy: {locationAccuracy ? `${Math.round(locationAccuracy)}m` : 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Other users' locations */}
                  {Object.values(userLocations).map((userLoc) => (
                    <Marker
                      key={userLoc.id}
                      position={[userLoc.latitude, userLoc.longitude]}
                      icon={leafletIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-semibold">Tourist #{userLoc.id.slice(-4)}</div>
                          <div className="text-sm text-gray-600">
                            Safety: {userLoc.safetyScore}%
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Heatmap zones */}
                  {heatmapZones.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={[zone.lat, zone.lng]}
                      radius={zone.radius}
                      pathOptions={{
                        color: zone.color,
                        fillColor: zone.color,
                        fillOpacity: zone.intensity,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="text-2xl mb-1">{zone.icon}</div>
                          <div className={`font-bold ${zone.risk === 'high' ? 'text-red-600' :
                            zone.risk === 'medium' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                            {zone.name}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {zone.risk} risk area
                          </div>
                          <div className="text-xs text-gray-500">
                            Radius: {Math.round(zone.radius)}m
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          
        </div>
      </main>

      {/* Enhanced Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold">Travel Assistant</h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-emerald-200 transition"
            >
              ×
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl ${msg.type === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for help or information..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition transform hover:scale-110 z-40"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default TouristApp;