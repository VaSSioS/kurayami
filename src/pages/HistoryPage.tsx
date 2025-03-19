
import React, { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import { mockManga } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const HistoryPage = () => {
  // State for reading history
  const [readingHistory, setReadingHistory] = useState<typeof mockManga>(() => {
    const storedHistory = localStorage.getItem("readingHistory");
    if (storedHistory) {
      try {
        return JSON.parse(storedHistory);
      } catch (e) {
        console.error("Failed to parse reading history", e);
        return [];
      }
    }
    
    // Initialize with some mock data
    return mockManga
      .filter(manga => manga.currentChapter && manga.currentChapter > 0)
      .sort((a, b) => (b.lastRead?.getTime() || 0) - (a.lastRead?.getTime() || 0));
  });
  
  const [completedManga, setCompletedManga] = useState<typeof mockManga>(() => {
    const storedCompleted = localStorage.getItem("completedManga");
    if (storedCompleted) {
      try {
        return JSON.parse(storedCompleted);
      } catch (e) {
        console.error("Failed to parse completed manga", e);
        return [];
      }
    }
    
    // Initialize with mock data for completed manga
    return mockManga.filter(manga => manga.isCompleted);
  });
  
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  
  // Save reading history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("readingHistory", JSON.stringify(readingHistory));
  }, [readingHistory]);
  
  // Save completed manga to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("completedManga", JSON.stringify(completedManga));
  }, [completedManga]);
  
  // Simulate reading progress updates in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setReadingHistory(prev => 
        prev.map(manga => {
          // Skip completed manga
          if (manga.isCompleted) return manga;
          
          // Randomly update progress for some manga
          if (Math.random() > 0.8 && manga.currentChapter < manga.totalChapters) {
            const newProgress = Math.min(manga.totalChapters, manga.currentChapter + 1);
            const newManga = {
              ...manga,
              currentChapter: newProgress,
              lastRead: new Date(),
            };
            
            // If manga is now completed, move it to completed manga
            if (newProgress === manga.totalChapters) {
              newManga.isCompleted = true;
              setCompletedManga(prev => [newManga, ...prev]);
              toast.success(`Completed: ${manga.title}`);
              return newManga;
            }
            
            toast.info(`Progress updated: ${manga.title} - Chapter ${newProgress}`);
            return newManga;
          }
          
          return manga;
        })
      );
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const handleClearHistory = () => {
    setReadingHistory([]);
    localStorage.setItem("readingHistory", JSON.stringify([]));
    setShowClearHistoryDialog(false);
    toast.success("Reading history cleared");
  };
  
  // Filter manga to show only those that have been started but not completed
  const inProgressManga = readingHistory
    .filter(manga => manga.currentChapter && manga.currentChapter > 0 && !manga.isCompleted);
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title="Reading History" 
        showBackButton={true}
        showSearch={true}
        showSettings={false}
        rightElement={
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowClearHistoryDialog(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        }
      />
      
      <main className="container px-4 py-6 space-y-8">
        {/* Continue Reading Section */}
        <section className="animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-accent" />
              Continue Reading
            </h2>
          </div>
          
          {inProgressManga.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {inProgressManga.map(manga => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  coverImage={manga.coverImage}
                  totalChapters={manga.totalChapters}
                  currentChapter={manga.currentChapter}
                  showProgress={true}
                  isContinueReading={true}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">No manga in progress.</p>
              <p className="text-sm text-muted-foreground mt-1">Start reading to see your progress here!</p>
            </div>
          )}
        </section>
        
        {/* Recently Completed Section */}
        <section className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recently Completed</h2>
          </div>
          
          {completedManga.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {completedManga
                .slice(0, 4)
                .map(manga => (
                  <MangaCard
                    key={manga.id}
                    id={manga.id}
                    title={manga.title}
                    coverImage={manga.coverImage}
                    totalChapters={manga.totalChapters}
                    currentChapter={manga.totalChapters}
                    showProgress={true}
                  />
                ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">No completed manga yet.</p>
            </div>
          )}
        </section>
      </main>
      
      {/* Clear History Confirmation Dialog */}
      <Dialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Reading History</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All reading history will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearHistoryDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default HistoryPage;
