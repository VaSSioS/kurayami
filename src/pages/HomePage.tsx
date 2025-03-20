
import React, { useState, useEffect } from "react";
import { Heart, BookOpen, CheckSquare, Plus } from "lucide-react";
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

// Define collection type with proper icon handling
interface Collection {
  id: string;
  name: string;
  icon: React.ElementType | null; // Changed from React.ComponentType to React.ElementType
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
  const [activeCollection, setActiveCollection] = useState(() => {
    // Get stored active collection or default to "all"
    return localStorage.getItem("activeCollection") || "all";
  });
  
  // Load collections from localStorage
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      // First check for collections in localStorage
      const storedCollections = localStorage.getItem("collections");
      if (storedCollections) {
        return JSON.parse(storedCollections);
      }
      
      // If no collections found, use defaults
      return DEFAULT_COLLECTIONS;
    } catch (error) {
      console.error("Error loading collections:", error);
      return DEFAULT_COLLECTIONS;
    }
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
    try {
      localStorage.setItem("collections", JSON.stringify(collections));
    } catch (error) {
      console.error("Error saving collections:", error);
    }
  }, [collections]);

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
        showSearch={true}
      />

      <main className="container px-4 py-2 space-y-6">
        {/* Collection Filter Tabs */}
        <Tabs defaultValue={activeCollection} value={activeCollection} onValueChange={setActiveCollection} className="w-full">
          <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
            {collections.map((collection) => {
              // Determine the count based on collection ID
              let count = 0;
              if (collection.id === "all") {
                count = allCount;
              } else if (collection.id === "favorites") {
                count = favoritesCount;
              } else if (collection.id === "to-read") {
                count = toReadCount;
              } else if (collection.id === "completed") {
                count = completedCount;
              } else {
                count = collection.mangaIds?.length || 0;
              }
              
              // Create the proper icon element
              const IconComponent = collection.icon;
              
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
                  
                  {/* Only show dropdown for custom collections (not default ones) */}
                  {!["all", "favorites", "to-read", "completed"].includes(collection.id) && (
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
                  )}
                </div>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Manga Grid Section */}
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
          
          {filteredManga.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-center">No manga in this collection yet</p>
            </div>
          )}
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
