"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  IdCard,
  Users,
  Bot,
  LogOut,
  Shield,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function Header({
  user,
  safetyScore = 0,
  lastUpdated = null,
  isInRiskZone = false,
  handleLogout = () => {},
  handlePanicButton = () => {},
}) {
  const router = useRouter();

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow-xl px-6 py-4 sticky top-0 z-40">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Logo + User */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Travling!
            </h1>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <IdCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
          >
            <Users className="w-5 h-5" />
            <span className="hidden md:inline">Tourist List</span>
          </button>

          <Link href="/ai">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg">
              <Bot className="w-5 h-5" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Safety Status Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-6 py-4 border border-gray-200">
        <div className="flex items-center space-x-8">
          {/* Safety Score */}
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                safetyScore >= 70
                  ? "bg-green-100"
                  : safetyScore >= 40
                  ? "bg-yellow-100"
                  : "bg-red-100"
              }`}
            >
              <Shield
                className={`w-6 h-6 ${
                  safetyScore >= 70
                    ? "text-green-600"
                    : safetyScore >= 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">
                Safety Score
              </div>
              <div
                className={`text-2xl font-bold ${
                  safetyScore >= 70
                    ? "text-green-600"
                    : safetyScore >= 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {safetyScore}%
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <Activity className="w-4 h-4" />
              <div className="text-xs">
                <div>Last Updated</div>
                <div className="font-mono">
                  {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {/* Risk Zone */}
          {isInRiskZone && (
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-full">
              <AlertTriangle className="w-5 h-5 text-orange-600 animate-pulse" />
              <span className="text-sm font-semibold text-orange-700">
                Risk Zone Alert
              </span>
            </div>
          )}
        </div>

        {/* Panic Button */}
        <button
          onClick={handlePanicButton}
          className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-2xl animate-pulse"
        >
          <AlertTriangle className="w-6 h-6" />
          <span className="text-lg">🚨 PANIC BUTTON</span>
        </button>
      </div>
    </nav>
  );
}
