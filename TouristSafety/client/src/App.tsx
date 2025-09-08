import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import MobileContainer from "./components/mobile-container";
import Home from "./pages/home";
import Emergency from "./pages/emergency";
import Map from "./pages/map";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth";
import ProtectedRoute from "./components/protectedRoutes";

export function App() {
  return (
    <TooltipProvider>
      <MobileContainer>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <Emergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MobileContainer>
      <Toaster />
    </TooltipProvider>
  );
}
