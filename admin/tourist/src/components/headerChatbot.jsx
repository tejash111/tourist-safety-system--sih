"use client";

import Link from "next/link";
import { MapPin, Bot, Home } from "lucide-react";

export default function HeaderChatbot() {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Travling! AI
          </h1>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md">
              <Home className="w-5 h-5" />
              <span className="hidden md:inline">Home</span>
            </button>
          </Link>

          <Link href="/ai">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-md">
              <Bot className="w-5 h-5" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
