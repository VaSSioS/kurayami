
import React from "react";
import { BookOpen } from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import { mockManga } from "@/data/mockData";

const HistoryPage = () => {
  // Filter manga to show only those that have been started but not completed
  const inProgressManga = mockManga
    .filter(manga => manga.currentChapter && manga.currentChapter > 0 && !manga.isCompleted)
    .sort((a, b) => (b.lastRead?.getTime() || 0) - (a.lastRead?.getTime() || 0));
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title="Reading History" 
        showBackButton={true}
        showSearch={true}
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
          
          {mockManga.filter(manga => manga.isCompleted).length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {mockManga
                .filter(manga => manga.isCompleted)
                .slice(0, 4)
                .map(manga => (
                  <MangaCard
                    key={manga.id}
                    id={manga.id}
                    title={manga.title}
                    coverImage={manga.coverImage}
                    totalChapters={manga.totalChapters}
                    currentChapter={manga.currentChapter}
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
      
      <BottomNavigation />
    </div>
  );
};

export default HistoryPage;
