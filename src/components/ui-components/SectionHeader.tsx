
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  link?: string;
  className?: string;
  children?: React.ReactNode;
}

const SectionHeader = ({
  title,
  link,
  className,
  children,
}: SectionHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <h2 className="text-lg font-medium">{title}</h2>
      
      <div className="flex items-center">
        {children}
        
        {link && (
          <Link 
            to={link}
            className="flex items-center text-xs text-muted-foreground ml-2"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
