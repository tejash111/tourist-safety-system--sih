import { useLocation } from "wouter";
import { Link } from "wouter";

const tabs = [
  { id: "home", path: "/", icon: "home", label: "Home" },
  { id: "emergency", path: "/emergency", icon: "emergency", label: "Emergency" },
  { id: "map", path: "/map", icon: "map", label: "Map" },
  { id: "profile", path: "/profile", icon: "person", label: "Profile" },
  { id: "settings", path: "/settings", icon: "settings", label: "Settings" },
];

export default function BottomTabs() {
  const [location] = useLocation();

  return (
    <div className="bottom-tabs" data-testid="bottom-tabs">
      {tabs.map((tab) => {
        const isActive = location === tab.path;
        return (
          <Link key={tab.id} to={tab.path}>
            <div
              className={`tab-item ${isActive ? "active" : "inactive"}`}
              data-testid={`tab-${tab.id}`}
            >
              <span className="material-icons tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
