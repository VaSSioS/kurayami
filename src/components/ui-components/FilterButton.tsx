
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
  className
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-secondary transition-colors",
        className
      )}
    >
      {type === "filter" ? <Filter className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;
