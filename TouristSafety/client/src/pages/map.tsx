import { useQuery } from "@tanstack/react-query";
import useLocation from "@/hooks/use-location";

interface SafetyZone {
  id: string;
  name: string;
  riskLevel: string;
  coordinates: {
    lat: number;
    lng: number;
    radius: number;
  };
  description: string;
  warnings?: string[];
}

export default function Map() {
  const { location } = useLocation();

  const { data: safetyZones = [] } = useQuery<SafetyZone[]>({
    queryKey: ["/api/safety-zones"],
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'bg-emerald-500';
      case 'moderate': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'bg-emerald-50';
      case 'moderate': return 'bg-amber-50';
      case 'high': return 'bg-red-50';
      default: return 'bg-blue-50';
    }
  };

  const getRiskTextColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-emerald-700';
      case 'moderate': return 'text-amber-700';
      case 'high': return 'text-red-700';
      default: return 'text-blue-700';
    }
  };

  const getRiskDescription = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'Safe Zone - Low risk area';
      case 'moderate': return 'Moderate Zone - Exercise caution';
      case 'high': return 'High Risk - Avoid if possible';
      default: return 'Unknown risk level';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 pb-24" data-testid="map-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Safe Navigation</h1>
        <p className="text-slate-600">Real-time safety zones and route guidance</p>
      </div>
      
      {/* Map Container */}
      <div className="relative mb-6" data-testid="map-container">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="relative h-80 bg-gradient-to-br from-blue-100 to-green-100">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Map of Northeast India region" 
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Current Location Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50" data-testid="map-overlay">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">Your Current Location</h4>
                  <p className="text-xs text-slate-600">
                    {location?.address || "Shillong, Meghalaya"}
                  </p>
                </div>
                <button 
                  className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors" 
                  data-testid="button-center-map"
                  onClick={() => {
                    alert("Centering map on your location...");
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Zone markers positioned absolutely */}
            <div className="absolute top-20 left-16">
              <div className="relative">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" data-testid="safe-zone-marker"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-emerald-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
            <div className="absolute top-32 right-24">
              <div className="relative">
                <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg animate-pulse" data-testid="moderate-zone-marker"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-amber-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
            <div className="absolute bottom-20 left-20">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" data-testid="high-risk-zone-marker"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-red-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
            
            {/* Your location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-xl"></div>
                <div className="absolute top-0 left-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Legend */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6" data-testid="zone-legend">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800">Zone Classifications</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {['safe', 'moderate', 'high'].map((riskLevel) => (
            <div key={riskLevel} className={`${getRiskBgColor(riskLevel)} rounded-xl p-4 flex items-center gap-4`}>
              <div className={`w-5 h-5 ${getRiskColor(riskLevel)} rounded-full shadow-sm`}></div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${getRiskTextColor(riskLevel)}`}>
                  {getRiskDescription(riskLevel)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Zones List */}
      {safetyZones.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6" data-testid="safety-zones-list">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800">Nearby Safety Zones</h3>
          </div>
          <div className="space-y-4">
            {safetyZones.map((zone) => (
              <div key={zone.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors" data-testid={`zone-${zone.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-4 h-4 ${getRiskColor(zone.riskLevel)} rounded-full mt-1 shadow-sm flex-shrink-0`}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{zone.name}</h4>
                    <p className="text-xs text-slate-600 mb-2">{zone.description}</p>
                    {zone.warnings && zone.warnings.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs text-amber-700 font-medium">
                            {zone.warnings.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Navigation Tools</h3>
        <div className="grid grid-cols-2 gap-4" data-testid="navigation-options">
          <div 
            className="bg-white rounded-xl shadow-md border border-slate-200 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" 
            data-testid="button-safe-route"
            onClick={() => {
              alert("Opening safe route navigation...");
            }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">AI Safe Route</h4>
            <p className="text-slate-500 text-xs">Optimized pathfinding</p>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-md border border-slate-200 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" 
            data-testid="button-safe-places"
            onClick={() => {
              alert("Showing nearby safe places...");
            }}
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">Safe Places</h4>
            <p className="text-slate-500 text-xs">Nearby secure locations</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 text-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-lg font-bold text-slate-800">12</div>
          <div className="text-xs text-slate-500">Safe Zones</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-lg font-bold text-slate-800">4.2km</div>
          <div className="text-xs text-slate-500">To Safety</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-lg font-bold text-slate-800">8min</div>
          <div className="text-xs text-slate-500">ETA Safe</div>
        </div>
      </div>
    </div>
  );
}