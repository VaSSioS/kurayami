
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  showFilter?: boolean;
  showProfile?: boolean;
  className?: string;
  children?: React.ReactNode;
  onBackClick?: () => void;
  rightElement?: React.ReactNode;
  rightElement2?: React.ReactNode;
}

const AppHeader = ({
  title,
  showBackButton = false,
  showSearch = true,
  showSettings = true,
  showFilter = false,
  showProfile = true,
  className,
  children,
  onBackClick,
  rightElement,
  rightElement2
}: AppHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isSourcesPage = location.pathname.startsWith("/sources");
  const isSearchPage = location.pathname.startsWith("/search");
  const isDownloadsPage = location.pathname.startsWith("/downloads");
  const isHistoryPage = location.pathname.startsWith("/history");
  
  // Hide settings button from specific pages in header
  const hideSettings = isSourcesPage || isDownloadsPage || isHistoryPage || isSearchPage;
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full py-3 px-4 flex items-center justify-between bg-background/80 backdrop-blur-lg border-b border-border", className)}>
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <button onClick={handleBackClick} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {title && (
          <div className="flex items-center">
            <h1 className="text-lg font-medium">{title}</h1>
            {children}
          </div>
        )}
        
        {!title && isHomePage && (
          <Link to="/" className="flex items-center">
            <h1 className="text-lg font-medium">Kurayami</h1>
          </Link>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {rightElement}
        {rightElement2}
        
        {showSearch && (
          <Link to="/search" className="p-2">
            <Search className="w-5 h-5" />
          </Link>
        )}
        
        {showProfile && isHomePage && (
          <Link to="/profile" className="p-2">
            <User className="w-5 h-5" />
          </Link>
        )}
        
        {showSettings && !hideSettings && (
          <Link to="/settings" className="p-2">
            <Settings className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
