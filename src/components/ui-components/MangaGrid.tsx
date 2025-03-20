
import React, { useState, useRef, useEffect } from "react";
import MangaCard from "./MangaCard";
import { Button } from "@/components/ui/button";
import { Manga } from "@/types/manga";
import { Trash, Edit } from "lucide-react";
import { toast } from "sonner";

interface MangaGridProps {
  manga: Manga[];
  onRenameCollection?: () => void;
  collectionId?: string;
  onRemoveFromCollection?: (mangaIds: string[], collectionId: string) => void;
}

const MangaGrid: React.FC<MangaGridProps> = ({ 
  manga, 
  onRenameCollection,
  collectionId,
  onRemoveFromCollection
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedManga, setSelectedManga] = useState<string[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCustomCollection = collectionId && !["all", "favorites", "to-read", "completed"].includes(collectionId);

  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const startLongPress = (mangaId: string) => {
    if (!isCustomCollection) return;
    
    longPressTimerRef.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedManga([mangaId]);
    }, 800); // 800ms for long press
  };

  const endLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const toggleSelection = (mangaId: string) => {
    if (!selectionMode) return;
    
    setSelectedManga(prev => 
      prev.includes(mangaId) 
        ? prev.filter(id => id !== mangaId) 
        : [...prev, mangaId]
    );
  };

  const selectAll = () => {
    setSelectedManga(manga.map(m => m.id));
  };

  const deselectAll = () => {
    setSelectedManga([]);
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedManga([]);
  };

  const handleRemoveSelected = () => {
    if (selectedManga.length === 0 || !collectionId || !onRemoveFromCollection) return;
    
    onRemoveFromCollection(selectedManga, collectionId);
    toast.success(`Removed ${selectedManga.length} manga from collection`);
    exitSelectionMode();
  };

  return (
    <div className="space-y-4">
      {selectionMode && isCustomCollection && (
        <div className="sticky top-16 z-40 bg-background py-2 border-b border-border flex justify-between items-center animate-slideDown">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={selectedManga.length === manga.length ? deselectAll : selectAll}
            >
              {selectedManga.length === manga.length ? "Deselect All" : "Select All"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedManga.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onRenameCollection && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRenameCollection}
                disabled={selectedManga.length === 0}
              >
                <Edit className="w-4 h-4 mr-1" />
                Rename
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveSelected}
              disabled={selectedManga.length === 0}
            >
              <Trash className="w-4 h-4 mr-1" />
              Remove
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exitSelectionMode}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        {manga.map(m => (
          <div 
            key={m.id}
            onTouchStart={() => startLongPress(m.id)}
            onTouchEnd={endLongPress}
            onTouchCancel={endLongPress}
            onMouseDown={() => startLongPress(m.id)}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onClick={() => toggleSelection(m.id)}
            className={`relative ${selectionMode ? 'cursor-pointer' : ''}`}
          >
            {selectionMode && (
              <div className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 ${
                selectedManga.includes(m.id) 
                  ? 'bg-accent border-accent' 
                  : 'bg-transparent border-white'
              }`}>
                {selectedManga.includes(m.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            )}
            <MangaCard 
              id={m.id} 
              title={m.title} 
              coverImage={m.coverImage} 
              totalChapters={m.totalChapters} 
              currentChapter={m.currentChapter} 
              showProgress={false}
              className={selectionMode ? 'opacity-80' : ''}
            />
          </div>
        ))}
      </div>
      
      {manga.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-center">No manga in this collection yet</p>
        </div>
      )}
    </div>
  );
};

export default MangaGrid;
