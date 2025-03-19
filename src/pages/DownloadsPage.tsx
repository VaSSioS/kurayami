import React, { useState, useEffect } from "react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import { mockManga } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock download states for demonstration
const DOWNLOAD_STATES = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed"
};
const DownloadsPage = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("downloadsActiveTab") || "all");

  // Mock downloaded manga with download status
  const [downloads, setDownloads] = useState(() => {
    const storedDownloads = localStorage.getItem("downloads");
    if (storedDownloads) {
      return JSON.parse(storedDownloads);
    }

    // Initialize with some mock data if no stored downloads
    return mockManga.slice(0, 6).map(manga => ({
      ...manga,
      downloadStatus: Math.random() > 0.5 ? DOWNLOAD_STATES.COMPLETED : DOWNLOAD_STATES.IN_PROGRESS,
      progress: Math.random() > 0.5 ? 100 : Math.floor(Math.random() * 95) + 5
    }));
  });

  // Save downloads state to localStorage
  useEffect(() => {
    localStorage.setItem("downloads", JSON.stringify(downloads));
  }, [downloads]);

  // Save active tab selection
  useEffect(() => {
    localStorage.setItem("downloadsActiveTab", activeTab);
  }, [activeTab]);

  // Simulate a download in progress
  useEffect(() => {
    const inProgressDownloads = downloads.filter(d => d.downloadStatus === DOWNLOAD_STATES.IN_PROGRESS);
    if (inProgressDownloads.length > 0) {
      // Show a notification for downloads in progress
      toast.info(`Downloading ${inProgressDownloads.length} manga`, {
        duration: 3000
      });

      // Simulate download progress updates
      const interval = setInterval(() => {
        setDownloads(prev => prev.map(item => {
          if (item.downloadStatus === DOWNLOAD_STATES.IN_PROGRESS) {
            const newProgress = item.progress + 5;
            if (newProgress >= 100) {
              toast.success(`Download completed: ${item.title}`, {
                duration: 3000
              });
              return {
                ...item,
                downloadStatus: DOWNLOAD_STATES.COMPLETED,
                progress: 100
              };
            }
            return {
              ...item,
              progress: newProgress
            };
          }
          return item;
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  // Filter manga based on active tab
  const filteredDownloads = activeTab === "all" ? downloads : downloads.filter(manga => manga.downloadStatus === activeTab);
  return <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader title="Downloads" showBackButton={false} showFilter={false} showSettings={false} />
      
      <main className="container px-4 py-6 space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All Downloads
              
            </TabsTrigger>
            <TabsTrigger value={DOWNLOAD_STATES.IN_PROGRESS} className="flex-1">
              In Progress
              
            </TabsTrigger>
            <TabsTrigger value={DOWNLOAD_STATES.COMPLETED} className="flex-1">
              Completed
              
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {downloads.length > 0 ? <div className="grid grid-cols-3 gap-4">
                {downloads.map(manga => <MangaCard key={manga.id} id={manga.id} title={manga.title} coverImage={manga.coverImage} totalChapters={manga.totalChapters} currentChapter={manga.currentChapter} showProgress={true} progressValue={manga.progress} progressLabel={manga.downloadStatus === DOWNLOAD_STATES.IN_PROGRESS ? `${manga.progress}%` : "Downloaded"} />)}
              </div> : <EmptyDownloadsState />}
          </TabsContent>
          
          <TabsContent value={DOWNLOAD_STATES.IN_PROGRESS} className="mt-6">
            {filteredDownloads.length > 0 ? <div className="grid grid-cols-3 gap-4">
                {filteredDownloads.map(manga => <MangaCard key={manga.id} id={manga.id} title={manga.title} coverImage={manga.coverImage} totalChapters={manga.totalChapters} currentChapter={manga.currentChapter} showProgress={true} progressValue={manga.progress} progressLabel={`${manga.progress}%`} />)}
              </div> : <div className="text-center py-12 text-muted-foreground">
                <p>No downloads in progress</p>
              </div>}
          </TabsContent>
          
          <TabsContent value={DOWNLOAD_STATES.COMPLETED} className="mt-6">
            {filteredDownloads.length > 0 ? <div className="grid grid-cols-3 gap-4">
                {filteredDownloads.map(manga => <MangaCard key={manga.id} id={manga.id} title={manga.title} coverImage={manga.coverImage} totalChapters={manga.totalChapters} currentChapter={manga.currentChapter} showProgress={true} progressValue={100} progressLabel="Downloaded" />)}
              </div> : <div className="text-center py-12 text-muted-foreground">
                <p>No completed downloads</p>
              </div>}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>;
};
const EmptyDownloadsState = () => <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-muted-foreground mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </div>
    <h3 className="text-xl font-medium mb-2">No Downloads Yet</h3>
    <p className="text-muted-foreground max-w-xs">
      Downloaded manga and chapters will appear here for offline reading.
    </p>
  </div>;
export default DownloadsPage;