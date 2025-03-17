
import React from "react";
import { cn } from "@/lib/utils";

interface ScrollableRowProps {
  className?: string;
  children: React.ReactNode;
  spacing?: "default" | "tight" | "none";
}

const ScrollableRow = ({ className, children, spacing = "default" }: ScrollableRowProps) => {
  const getSpacingClass = () => {
    switch (spacing) {
      case "tight": return "space-x-2";
      case "none": return "space-x-0";
      case "default":
      default: return "space-x-4";
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar", className)}>
      <div className={cn("flex py-2 px-1", getSpacingClass())}>
        {children}
      </div>
    </div>
  );
};

export default ScrollableRow;
