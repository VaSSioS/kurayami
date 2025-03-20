
import { Heart, BookOpen, CheckSquare } from "lucide-react";
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
  }, 
  {
    id: "favorites",
    name: "Favorites",
    icon: Heart,
    mangaIds: []  // Favorites are determined by manga.isFavorite
  }, 
  {
    id: "to-read",
    name: "To Read",
    icon: BookOpen,
    mangaIds: []  // To read are determined by !manga.isCompleted && !manga.currentChapter
  }, 
  {
    id: "completed",
    name: "Completed",
    icon: CheckSquare,
    mangaIds: []  // Completed are determined by manga.isCompleted
  }
];
