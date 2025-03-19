
import React, { useState, useEffect } from "react";
import { SortAsc, Filter, Heart, BookOpen, CheckSquare } from "lucide-react";
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

// Define default collection types
const DEFAULT_COLLECTIONS = [{
  id: "all",
  name: "All",
  icon: null
}, {
  id: "favorites",
  name: "Favorites",
  icon: Heart
}, {
  id: "to-read",
  name: "To Read",
  icon: BookOpen
}, {
  id: "completed",
  name: "Completed",
  icon: CheckSquare
}];

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
  const [defaultCollections, setDefaultCollections] = useState(() => {
    // Get stored default collections or use DEFAULT_COLLECTIONS
    const storedDefaults = localStorage.getItem("defaultCollections");
    return storedDefaults ? JSON.parse(storedDefaults) : DEFAULT_COLLECTIONS;
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

  // Effect to update default collections in localStorage
  useEffect(() => {
    localStorage.setItem("defaultCollections", JSON.stringify(defaultCollections));
  }, [defaultCollections]);

  // Effect to update sort preference in localStorage
  useEffect(() => {
    localStorage.setItem("sortPreference", sortBy);
  }, [sortBy]);

  const handleSortClick = () => {
    // Toggle between different sort options
    const sortOptions = ["last_read", "a_z", "recent", "popular"];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
    toast.success(`Sorted by ${getSortLabel(sortOptions[nextIndex])}`);
  };

  const handleFilterClick = () => {
    navigate('/filter');
  };

  // Get sort label based on current sort option
  const getSortLabel = (sort = sortBy) => {
    switch (sort) {
      case "last_read":
        return "Last Read";
      case "a_z":
        return "A-Z";
      case "recent":
        return "Recent";
      case "popular":
        return "Popular";
      default:
        return "Sort";
    }
  };

  // Collection counts
  const allCount = mockManga.length;
  const favoritesCount = mockManga.filter(m => m.isFavorite).length;
  const toReadCount = mockManga.filter(m => !m.isCompleted && !m.currentChapter).length;
  const completedCount = mockManga.filter(m => m.isCompleted).length;

  const handleRenameCollection = () => {
    if (!editingCollection || !newCollectionName.trim()) return;
    
    // Update collection name
    const updatedCollections = defaultCollections.map(collection => 
      collection.id === editingCollection.id ? {
        ...collection,
        name: newCollectionName
      } : collection
    );
    
    setDefaultCollections(updatedCollections);
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
    }
    return mockManga;
  }, [activeCollection]);

  return (
    <div className="pb-20 animate-fadeIn">
      <AppHeader 
        title="Library" 
        showBackButton={false} 
        showProfile={true}
        showSettings={true}
        rightElement={
          <Button variant="ghost" size="icon" onClick={handleSortClick}>
            <SortAsc className="h-5 w-5" />
          </Button>
        }
        rightElement2={
          <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
            <Filter className="h-5 w-5" />
          </Button>
        }
      />

      <main className="container px-4 py-2 space-y-6">
        {/* Collection Filter Tabs */}
        <Tabs defaultValue={activeCollection} value={activeCollection} onValueChange={setActiveCollection} className="w-full">
          <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
            {defaultCollections.map(collection => {
              const Icon = collection.icon;
              return (
                <div key={collection.id} className="relative group">
                  <TabsTrigger 
                    value={collection.id} 
                    className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{collection.name}</span>
                    <Badge variant="secondary" className="ml-1">
                      {collection.id === "all" ? allCount : 
                       collection.id === "favorites" ? favoritesCount : 
                       collection.id === "to-read" ? toReadCount : 
                       collection.id === "completed" ? completedCount : 0}
                    </Badge>
                  </TabsTrigger>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <SortAsc className="h-4 w-4" />
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
