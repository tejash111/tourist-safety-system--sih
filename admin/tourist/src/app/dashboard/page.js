"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertTriangle, 
  Users, 
  MapPin, 
  Activity, 
  Bell, 
  Shield,
  TrendingUp,
  Clock,
  Phone,
  Search,
  Filter
} from "lucide-react";

// Import Leaflet CSS dynamically
import("leaflet/dist/leaflet.css");

// Socket.io connection
const socketUrl ="http://localhost:3001";
  
const socket = io(socketUrl, {
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

function DashboardComponent() {
  const [tourists, setTourists] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const { user, logout } = useAuth();
  const [leafletIcon, setLeafletIcon] = useState(null);
  const [riskZones, setRiskZones] = useState([]);
  const [stats, setStats] = useState({
    totalTourists: 0,
    activeAlerts: 0,
    riskZones: 0,
    avgSafetyScore: 0
  });

  // Initialize Leaflet icons
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
      
      const normalIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });
      
      setLeafletIcon(normalIcon);
    }
  }, []);

  // Mock risk zones data
  useEffect(() => {
    setRiskZones([
      { id: 1, name: "Forest Area", lat: 26.1445, lng: 91.7362, radius: 2000, risk: "high" },
      { id: 2, name: "Remote Hills", lat: 26.1545, lng: 91.7462, radius: 1500, risk: "medium" },
      { id: 3, name: "Border Area", lat: 26.1345, lng: 91.7262, radius: 3000, risk: "high" }
    ]);
  }, []);

  // Socket listeners for real-time updates
  useEffect(() => {
    socket.on("receive-location", (data) => {
      const { id, latitude, longitude } = data;
      const safetyScore = calculateSafetyScore(latitude, longitude);
      
      setTourists(prev => ({
        ...prev,
        [id]: { 
          id, 
          latitude, 
          longitude, 
          lastSeen: new Date(),
          safetyScore,
          status: safetyScore > 70 ? 'safe' : safetyScore > 40 ? 'caution' : 'danger'
        }
      }));
    });

    socket.on("user-disconnected", (id) => {
      setTourists(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    socket.on("panic-alert", (alertData) => {
      setAlerts(prev => [alertData, ...prev.slice(0, 9)]);
    });

    return () => {
      socket.off("receive-location");
      socket.off("user-disconnected"); 
      socket.off("panic-alert");
    };
  }, []);

  // Update stats when tourists change
  useEffect(() => {
    const touristList = Object.values(tourists);
    const activeAlertCount = alerts.filter(a => a.status === 'active').length;
    const avgScore = touristList.length > 0 
      ? touristList.reduce((sum, t) => sum + t.safetyScore, 0) / touristList.length 
      : 0;

    setStats({
      totalTourists: touristList.length,
      activeAlerts: activeAlertCount,
      riskZones: riskZones.length,
      avgSafetyScore: Math.round(avgScore)
    });
  }, [tourists, alerts, riskZones]);

  const calculateSafetyScore = (lat, lng) => {
    let score = 100;
    
    // Check proximity to risk zones
    riskZones.forEach(zone => {
      const distance = getDistance(lat, lng, zone.lat, zone.lng);
      if (distance < zone.radius) {
        score -= zone.risk === 'high' ? 40 : 20;
      }
    });
    
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

  const getSafetyColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskZoneColor = (risk) => {
    switch(risk) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff8800'; 
      default: return '#ffaa00';
    }
  };

  if (!leafletIcon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tourism Safety Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Bell className="w-4 h-4 mr-2" />
              Alerts ({stats.activeAlerts})
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tourists</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTourists}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Risk Zones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.riskZones}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                <p className={`text-2xl font-bold ${getSafetyColor(stats.avgSafetyScore)}`}>
                  {stats.avgSafetyScore}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         

          {/* Alerts Panel */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="p-4">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent alerts</p>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-red-50 border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="ml-2">
                            <p className="font-medium text-red-800">Panic Alert</p>
                            <p className="text-sm text-red-600">Tourist ID: {alert.touristId}</p>
                            <p className="text-xs text-red-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                          Respond
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tourist List */}
        <div className="mt-6 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tourist List</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Filter
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <Search className="w-4 h-4 inline mr-1" />
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tourist ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Safety Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(tourists).map(tourist => (
                  <tr key={tourist.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tourist.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tourist.latitude.toFixed(4)}, {tourist.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getSafetyColor(tourist.safetyScore)}`}>
                        {tourist.safetyScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tourist.status === 'safe' ? 'bg-green-100 text-green-800' :
                        tourist.status === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tourist.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tourist.lastSeen).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">
                        <Phone className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(tourists).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tourists currently being tracked
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardComponent />
    </ProtectedRoute>
  );
}