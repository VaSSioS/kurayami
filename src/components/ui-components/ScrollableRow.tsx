
import React from "react";
import { cn } from "@/lib/utils";

interface ScrollableRowProps {
  className?: string;
  children: React.ReactNode;
}

const ScrollableRow = ({ className, children }: ScrollableRowProps) => {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar", className)}>
      <div className="flex space-x-4 py-1 px-1">
        {children}
      </div>
    </div>
  );
};

export default ScrollableRow;
