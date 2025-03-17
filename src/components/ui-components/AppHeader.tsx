
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AppHeader = ({
  title,
  showBackButton = false,
  showSearch = true,
  showSettings = true,
  className,
  children,
}: AppHeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full py-3 px-4 flex items-center justify-between bg-background/80 backdrop-blur-lg border-b border-border",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Link to="-1" className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}
        
        {isHomePage ? (
          <Link to="/" className="flex items-center">
            <h1 className="text-lg font-medium">Kurayami</h1>
          </Link>
        ) : (
          title && <h1 className="text-lg font-medium">{title}</h1>
        )}
        
        {children}
      </div>
      
      <div className="flex items-center space-x-2">
        {showSearch && (
          <Link to="/search" className="p-2">
            <Search className="w-5 h-5" />
          </Link>
        )}
        
        {showSettings && (
          <Link to="/profile" className="p-2">
            <Settings className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
