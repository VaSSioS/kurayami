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
  return;
};
export default FilterButton;