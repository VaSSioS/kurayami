
import React, { useState, useEffect } from "react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { DEFAULT_COLLECTIONS, Collection } from "@/types/collection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mockManga } from "@/data/mockData";
import CollectionTabs from "@/components/ui-components/CollectionTabs";
import MangaGrid from "@/components/ui-components/MangaGrid";
import { saveCollections, getCollections, saveActiveCollection, getActiveCollection } from "@/utils/storage";
import { Manga } from "@/types/manga";

const HomePage = () => {
  // Active collection state
  const [activeCollection, setActiveCollection] = useState<string>(() => {
    return getActiveCollection() || "all";
  });
  
  // Collections state
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      // First check for collections in localStorage
      const storedCollections = getCollections();
      if (storedCollections && storedCollections.length > 0) {
        return storedCollections;
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
    saveActiveCollection(activeCollection);
  }, [activeCollection]);

  // Effect to update collections in localStorage
  useEffect(() => {
    saveCollections(collections);
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

  // Handle setting up the editing collection
  const handleEditCollection = (collection: { id: string; name: string }) => {
    setEditingCollection(collection);
    setNewCollectionName(collection.name);
    setShowRenameDialog(true);
  };

  // Handle removing manga from collection
  const handleRemoveFromCollection = (mangaIds: string[], collectionId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          mangaIds: collection.mangaIds.filter(id => !mangaIds.includes(id))
        };
      }
      return collection;
    });
    
    setCollections(updatedCollections);
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

  // Update collection counts
  const collectionsWithCounts = collections.map(collection => {
    if (collection.id === "all") {
      return { ...collection, count: allCount };
    } else if (collection.id === "favorites") {
      return { ...collection, count: favoritesCount };
    } else if (collection.id === "to-read") {
      return { ...collection, count: toReadCount };
    } else if (collection.id === "completed") {
      return { ...collection, count: completedCount };
    } else {
      return { 
        ...collection, 
        count: collection.mangaIds.length 
      };
    }
  });

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
        <CollectionTabs 
          collections={collectionsWithCounts}
          activeCollection={activeCollection}
          setActiveCollection={setActiveCollection}
          onRenameClick={handleEditCollection}
        />

        {/* Manga Grid Section */}
        <section className="animate-slideUp" style={{
          animationDelay: "0.1s"
        }}>
          <MangaGrid 
            manga={filteredManga as Manga[]} 
            collectionId={activeCollection}
            onRenameCollection={activeCollection !== "all" && 
                                activeCollection !== "favorites" && 
                                activeCollection !== "to-read" && 
                                activeCollection !== "completed" ? 
                                () => handleEditCollection({
                                  id: activeCollection,
                                  name: collections.find(c => c.id === activeCollection)?.name || ""
                                }) : undefined}
            onRemoveFromCollection={handleRemoveFromCollection}
          />
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
