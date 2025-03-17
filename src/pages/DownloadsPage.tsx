
import React from "react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import { mockManga } from "@/data/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DownloadsPage = () => {
  // Mock downloaded manga (in a real app, this would come from a downloads store)
  const downloadedManga = mockManga.slice(0, 6); // Just use a few for demonstration
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title="Downloads"
        showBackButton={false}
        showFilter={false}
      />
      
      <main className="container px-4 py-6 space-y-6">
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All Downloads</TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1">In Progress</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {downloadedManga.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {downloadedManga.map(manga => (
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-muted-foreground mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No Downloads Yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Downloaded manga and chapters will appear here for offline reading.
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default DownloadsPage;
