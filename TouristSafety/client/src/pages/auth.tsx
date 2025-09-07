import { SignIn, SignUp } from "@/components/authComp";
import { AlertTriangle, MapPin, Shield } from "lucide-react";
import { useState } from "react";

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">SafeTravel</h1>
          <p className="text-blue-100 text-center text-sm">Your trusted companion for safe journeys</p>
          
          {/* Feature icons */}
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex flex-col items-center">
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-xs">Real-time Location</span>
            </div>
            <div className="flex flex-col items-center">
              <AlertTriangle
               className="w-5 h-5 mb-1" />
              <span className="text-xs">Emergency Alerts</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-xs">24/7 Safety</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-sm">
          {isSignUp ? (
            <SignUp onToggle={toggleAuthMode} loading={loading} setLoading={setLoading} />
          ) : (
            <SignIn onToggle={toggleAuthMode} loading={loading} setLoading={setLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
