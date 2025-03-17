
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Settings, Download, Bookmark,
  List, ZoomIn, ZoomOut, ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { mockManga } from "@/data/mockData";

const ChapterReadingPage = () => {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [brightness, setBrightness] = useState([80]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  // Find manga by ID
  const manga = mockManga.find(m => m.id === id);
  
  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Manga Not Found</h2>
          <p className="text-muted-foreground">The manga you're looking for doesn't exist.</p>
          <Link to="/" className="block text-accent hover:underline">
            Return to Library
          </Link>
        </div>
      </div>
    );
  }
  
  // Generate mock pages for the current chapter
  const totalPages = 20;
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    id: `p${i + 1}`,
    pageNumber: i + 1,
    imageUrl: `https://picsum.photos/seed/manga${id}-ch${chapterId}-${i+1}/600/900`,
  }));
  
  // Generate chapters list
  const chapters = Array.from({ length: manga.totalChapters || 10 }, (_, i) => ({
    id: `ch${i + 1}`,
    number: i + 1,
    title: `Chapter ${i + 1}`,
  }));
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Reached the end of the chapter, navigate to the next chapter if available
      const currentChapterNumber = parseInt(chapterId || "1");
      if (currentChapterNumber < manga.totalChapters) {
        navigate(`/manga/${id}/chapter/${currentChapterNumber + 1}`);
      }
    }
  };
  
  const handleJumpToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const handleChangeChapter = (chapterNumber: string) => {
    navigate(`/manga/${id}/chapter/${chapterNumber}`);
  };
  
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50));
  };
  
  const handleGoBack = () => {
    navigate(`/manga/${id}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - conditionally shown based on showControls */}
      {showControls && (
        <header className="p-3 border-b border-border glassmorphism sticky top-0 z-10 animate-slideDown">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-sm font-medium line-clamp-1">{manga.title}</h1>
              <p className="text-xs text-muted-foreground">Chapter {chapterId}</p>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>
      )}
      
      {/* Main reading area */}
      <main 
        className="flex-1 relative flex justify-center items-center" 
        onClick={toggleControls}
      >
        <div 
          className="relative max-h-screen overflow-auto" 
          style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease' }}
        >
          <img 
            src={pages[currentPage - 1].imageUrl} 
            alt={`Page ${currentPage}`}
            className="max-w-full h-auto object-contain"
            style={{ filter: `brightness(${brightness[0]}%)` }}
          />
        </div>
        
        {/* Page navigation buttons - conditionally shown based on showControls */}
        {showControls && (
          <>
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-r-lg transition-all duration-200"
              onClick={(e) => { e.stopPropagation(); handlePreviousPage(); }}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-l-lg transition-all duration-200"
              onClick={(e) => { e.stopPropagation(); handleNextPage(); }}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Zoom controls - conditionally shown based on showControls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/30 rounded-lg p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-black/50"
              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-black/50"
              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
      
      {/* Footer with page navigation - conditionally shown based on showControls */}
      {showControls && (
        <footer className="p-3 border-t border-border glassmorphism sticky bottom-0 animate-slideUp">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">
              Page {currentPage}/{totalPages}
            </div>
            
            <div className="flex gap-2">
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => handleJumpToPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => handleJumpToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => handleChangeChapter(String(parseInt(chapterId || "1") - 1))} disabled={parseInt(chapterId || "1") === 1}>
              Previous Chapter
            </Button>
            
            <Select value={chapterId} onValueChange={handleChangeChapter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={String(chapter.number)}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => handleChangeChapter(String(parseInt(chapterId || "1") + 1))} disabled={parseInt(chapterId || "1") === manga.totalChapters}>
              Next Chapter
            </Button>
          </div>
        </footer>
      )}
      
      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reading Settings</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Brightness</h4>
              <Slider
                value={brightness}
                onValueChange={(value) => setBrightness(value)}
                min={30}
                max={150}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Zoom Level: {zoomLevel}%</h4>
              <Slider
                value={[zoomLevel]}
                onValueChange={(value) => setZoomLevel(value[0])}
                min={50}
                max={200}
                step={10}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto Page Advance</span>
              <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={() => {}} variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
              
              <Button className="flex-1" onClick={() => {}} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChapterReadingPage;
