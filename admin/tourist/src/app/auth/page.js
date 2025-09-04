"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Camera, MapPin, Plane } from "lucide-react";
import PublicRoute from "@/components/PublicRoute";

function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-0.5 bg-white/30 transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-0.5 bg-white/20 transform -rotate-45"></div>
        <div className="absolute bottom-32 left-20 w-40 h-0.5 bg-white/25 transform rotate-12"></div>
        <div className="absolute bottom-20 right-32 w-28 h-0.5 bg-white/30 transform -rotate-12"></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Panel - Login/Register Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-cyan-600 mb-2">Travling!</h1>
              </div>

              {/* Tab Navigation */}
              <div className="flex mb-8 gap-8">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 pb-2 text-lg font-semibold border-b-2 transition-colors duration-300 ${
                    activeTab === "login"
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 pb-2 text-lg font-semibold border-b-2 transition-colors duration-300 ${
                    activeTab === "register"
                      ? "text-cyan-600 border-cyan-600"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Phone Number or Email"
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors duration-300"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors duration-300"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.email || !formData.password}
                    className="w-full bg-gray-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "LOGGING IN..." : "LOGIN"}
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors duration-300">
                      Forgot your password? Click here!
                    </a>
                  </div>

                  <div className="text-center text-gray-400 text-sm">or login with</div>

                  {/* Social Login Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-300 py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
                    >
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        G
                      </div>
                      <span className="text-gray-800 font-medium">Google</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {activeTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors duration-300"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors duration-300"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors duration-300"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.email || !formData.password}
                    className="w-full bg-cyan-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "REGISTERING..." : "REGISTER"}
                  </button>

                  <div className="text-center text-gray-400 text-sm">or register with</div>

                  {/* Social Register Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-300 py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
                    >
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        G
                      </div>
                      <span className="text-gray-800 font-medium">Google</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Footer */}
              <div className="mt-12 text-center text-xs text-gray-400">
                © 2021 Travling, All Rights Reserved
              </div>
            </div>
          </div>

          {/* Right Panel - Hero Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute top-40 right-16 w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-32 left-12 w-12 h-12 bg-white/15 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/25 rounded-full"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12">
              {/* Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                  Start your journey by
                  <br />
                  one click, explore
                  <br />
                  beautiful world!
                </h2>

                {/* Image placeholder with traveler */}
                <div className="relative mx-auto lg:mx-0 w-80 h-96 bg-gradient-to-b from-cyan-300 to-blue-400 rounded-2xl overflow-hidden mb-8 shadow-xl">
                  {/* Sky background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-cyan-200 to-blue-400"></div>

                  {/* Clouds */}
                  <div className="absolute top-8 left-8 w-16 h-8 bg-white/60 rounded-full"></div>
                  <div className="absolute top-12 right-12 w-20 h-10 bg-white/40 rounded-full"></div>
                  <div className="absolute top-20 left-1/3 w-12 h-6 bg-white/50 rounded-full"></div>

                  {/* Sun */}
                  <div className="absolute top-12 right-20 w-12 h-12 bg-yellow-300 rounded-full opacity-80"></div>

                  {/* Traveler silhouette */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      {/* Person body */}
                      <div className="w-20 h-32 bg-blue-800 rounded-t-full rounded-b-lg relative">
                        {/* Head */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-300 rounded-full"></div>
                        {/* Hat */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-600 rounded-full"></div>
                        {/* Camera */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-4 bg-black rounded"></div>
                        <Camera className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 text-white" />
                        {/* Backpack */}
                        <div className="absolute top-2 -right-2 w-6 h-16 bg-gray-800 rounded-lg"></div>
                      </div>
                    </div>
                  </div>

                  {/* Location pin */}
                  <div className="absolute bottom-16 right-8">
                    <MapPin className="w-6 h-6 text-red-500 fill-current" />
                  </div>
                </div>

                {/* Page indicators */}
                <div className="flex justify-center lg:justify-start gap-2 mb-8">
                  <div className="w-8 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Decorative airplane */}
            <div className="absolute top-16 right-16 text-white/20">
              <Plane className="w-8 h-8 transform rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  );
}