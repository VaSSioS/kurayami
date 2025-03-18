
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Download, Settings, History, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center px-3 py-2 transition-all",
      isActive 
        ? "text-accent text-glow" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    <Icon className={cn("w-5 h-5", isActive ? "animate-pulse" : "")} />
    <span className="text-xs mt-0.5">{label}</span>
  </Link>
);

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route !== "/" && path.startsWith(route)) return true;
    return false;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around">
        <NavItem 
          to="/" 
          icon={Home} 
          label="Library" 
          isActive={isActive("/")} 
        />
        <NavItem 
          to="/sources" 
          icon={Globe} 
          label="Sources" 
          isActive={isActive("/sources")} 
        />
        <NavItem 
          to="/downloads" 
          icon={Download} 
          label="Downloads" 
          isActive={isActive("/downloads")} 
        />
        <NavItem 
          to="/history" 
          icon={History} 
          label="History" 
          isActive={isActive("/history")} 
        />
        <NavItem 
          to="/settings" 
          icon={Settings} 
          label="Settings" 
          isActive={isActive("/settings")} 
        />
      </div>
    </nav>
  );
};

export default BottomNavigation;
