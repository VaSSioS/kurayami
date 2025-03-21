
import type { LucideIcon } from "lucide-react";

export interface Collection {
  id: string;
  name: string;
  icon: LucideIcon | null;
  mangaIds: string[];
}

// Define default collection types with mangaIds arrays
export const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: "all",
    name: "All",
    icon: null,
    mangaIds: []  // All manga are shown here
  }
];
