
import React from "react";
import { Filter, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  type: "filter" | "sort";
  label: string;
  onClick: () => void;
  className?: string;
}

const FilterButton = ({
  type,
  label,
  onClick,
  className,
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-1.5 bg-secondary rounded-full text-xs font-medium transition-colors",
        className
      )}
    >
      {type === "filter" ? (
        <Filter className="w-3.5 h-3.5 mr-1.5" />
      ) : (
        <SortDesc className="w-3.5 h-3.5 mr-1.5" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;
