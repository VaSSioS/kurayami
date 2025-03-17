import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Search, Settings, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  showFilter?: boolean;
  className?: string;
  children?: React.ReactNode;
}
const AppHeader = ({
  title,
  showBackButton = false,
  showSearch = true,
  showSettings = true,
  showFilter = true,
  className,
  children
}: AppHeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return <header className={cn("sticky top-0 z-50 w-full py-3 px-4 flex items-center justify-between bg-background/80 backdrop-blur-lg border-b border-border", className)}>
      
      
      <div className="flex items-center space-x-2">
        {showFilter && isHomePage && <Link to="#filter" className="p-2">
            <Filter className="w-5 h-5" />
          </Link>}
        
        {showSearch && <Link to="/search" className="p-2">
            <Search className="w-5 h-5 my-0 px-0 py-0 mx-[2px]" />
          </Link>}
        
        {showSettings}
      </div>
    </header>;
};
export default AppHeader;