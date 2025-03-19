
import React, { useState, useEffect } from "react";
import { Heart, BookOpen, CheckSquare } from "lucide-react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockManga } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define collection type
interface Collection {
  id: string;
  name: string;
  icon: React.ComponentType<any> | null;
  mangaIds: string[];
}

// Define default collection types with mangaIds arrays
const DEFAULT_COLLECTIONS: Collection[] = [
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

const HomePage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState(() => {
    // Get stored sort preference or default to "last_read"
    return localStorage.getItem("sortPreference") || "last_read";
  });
  const [activeCollection, setActiveCollection] = useState(() => {
    // Get stored active collection or default to "all"
    return localStorage.getItem("activeCollection") || "all";
  });
  
  // Update to include mangaIds in the collections
  const [collections, setCollections] = useState<Collection[]>(() => {
    // First check for user collections
    const storedUserCollections = localStorage.getItem("collections");
    const userCollections = storedUserCollections ? JSON.parse(storedUserCollections) : [];
    
    // Then check for default collections
    const storedDefaults = localStorage.getItem("defaultCollections");
    const defaultCollections = storedDefaults ? JSON.parse(storedDefaults) : DEFAULT_COLLECTIONS;
    
    // Make sure default collections have the right structure
    const formattedDefaultCollections = defaultCollections.map((collection: any) => {
      // Ensure each collection has a mangaIds array
      if (!collection.mangaIds) {
        collection.mangaIds = [];
      }
      return collection;
    });
    
    // Combine user collections with default collections
    return [...formattedDefaultCollections, ...userCollections];
  });
  
  const [editingCollection, setEditingCollection] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  // Effect to update active collection in localStorage
  useEffect(() => {
    localStorage.setItem("activeCollection", activeCollection);
  }, [activeCollection]);

  // Effect to update collections in localStorage
  useEffect(() => {
    // Save all collections (both default and user-created) to localStorage
    localStorage.setItem("collections", JSON.stringify(collections));
    
    // For backward compatibility, also save default collections separately
    const defaultCollections = collections.filter(c => 
      ["all", "favorites", "to-read", "completed"].includes(c.id)
    );
    localStorage.setItem("defaultCollections", JSON.stringify(defaultCollections));
  }, [collections]);

  // Effect to update sort preference in localStorage
  useEffect(() => {
    localStorage.setItem("sortPreference", sortBy);
  }, [sortBy]);

  const handleRenameCollection = () => {
    if (!editingCollection || !newCollectionName.trim()) return;
    
    // Update collection name
    const updatedCollections = collections.map(collection => 
      collection.id === editingCollection.id ? {
        ...collection,
        name: newCollectionName
      } : collection
    );
    
    setCollections(updatedCollections);
    toast.success(`Collection renamed to "${newCollectionName}"`);
    setShowRenameDialog(false);
    setEditingCollection(null);
    setNewCollectionName("");
  };

  // Filter manga based on active collection
  const filteredManga = React.useMemo(() => {
    if (activeCollection === "all") {
      return mockManga;
    } else if (activeCollection === "favorites") {
      return mockManga.filter(m => m.isFavorite);
    } else if (activeCollection === "to-read") {
      return mockManga.filter(m => !m.isCompleted && !m.currentChapter);
    } else if (activeCollection === "completed") {
      return mockManga.filter(m => m.isCompleted);
    } else {
      // Find the collection
      const collection = collections.find(c => c.id === activeCollection);
      if (collection && collection.mangaIds.length > 0) {
        // Return manga that are in this collection
        return mockManga.filter(manga => collection.mangaIds.includes(manga.id));
      }
      return [];
    }
  }, [activeCollection, collections]);

  // Collection counts
  const allCount = mockManga.length;
  const favoritesCount = mockManga.filter(m => m.isFavorite).length;
  const toReadCount = mockManga.filter(m => !m.isCompleted && !m.currentChapter).length;
  const completedCount = mockManga.filter(m => m.isCompleted).length;

  return (
    <div className="pb-20 animate-fadeIn">
      <AppHeader 
        title="Library" 
        showBackButton={false} 
        showProfile={true}
        showSettings={true}
      />

      <main className="container px-4 py-2 space-y-6">
        {/* Collection Filter Tabs */}
        <Tabs defaultValue={activeCollection} value={activeCollection} onValueChange={setActiveCollection} className="w-full">
          <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
            {collections.map(collection => {
              // Use the correct icon or null
              const IconComponent = collection.icon;
              const count = collection.id === "all" ? allCount 
                : collection.id === "favorites" ? favoritesCount 
                : collection.id === "to-read" ? toReadCount 
                : collection.id === "completed" ? completedCount
                : (collection.mangaIds ? collection.mangaIds.length : 0);
              
              return (
                <div key={collection.id} className="relative group">
                  <TabsTrigger 
                    value={collection.id} 
                    className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{collection.name}</span>
                    <Badge variant="secondary" className="ml-1">
                      {count}
                    </Badge>
                  </TabsTrigger>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setEditingCollection({
                          id: collection.id,
                          name: collection.name
                        });
                        setNewCollectionName(collection.name);
                        setShowRenameDialog(true);
                      }}>
                        Rename
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </TabsList>
        </Tabs>

        {/* All Manga Section with Filters */}
        <section className="animate-slideUp" style={{
          animationDelay: "0.1s"
        }}>
          <div className="grid grid-cols-3 gap-4">
            {filteredManga.map(manga => (
              <MangaCard 
                key={manga.id} 
                id={manga.id} 
                title={manga.title} 
                coverImage={manga.coverImage} 
                totalChapters={manga.totalChapters} 
                currentChapter={manga.currentChapter} 
                showProgress={false} 
              />
            ))}
          </div>
        </section>
      </main>

      {/* Rename Collection Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
            <DialogDescription>
              Enter a new name for this collection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Collection Name" 
              value={newCollectionName} 
              onChange={e => setNewCollectionName(e.target.value)} 
              className="w-full" 
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameCollection}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
