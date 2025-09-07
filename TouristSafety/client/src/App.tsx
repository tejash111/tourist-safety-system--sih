import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/map" component={Map} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MobileContainer>
          <Router />
        </MobileContainer>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
