
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Download, Bookmark, ChevronRight, ChevronDown } from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockManga } from "@/data/mockData";

const MangaDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [expandSynopsis, setExpandSynopsis] = useState(false);
  
  // Find the manga by ID from mock data
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
  
  const progress = manga.currentChapter && manga.totalChapters 
    ? Math.round((manga.currentChapter / manga.totalChapters) * 100) 
    : 0;
    
  // Generate sample chapters for the manga
  const chapters = Array.from({ length: manga.totalChapters || 10 }, (_, i) => ({
    id: `ch${i + 1}`,
    number: i + 1,
    title: `Chapter ${i + 1}`,
    releaseDate: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)), // One week apart
    isRead: manga.currentChapter ? i + 1 <= manga.currentChapter : false,
    isDownloaded: Math.random() > 0.7,
  }));
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title={manga.title}
        showBackButton={true}
        showSearch={false}
      />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Manga Cover and Info */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start animate-slideDown">
          <div className="manga-cover w-48 shadow-lg">
            <img 
              src={manga.coverImage} 
              alt={manga.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{manga.title}</h1>
            
            <p className="text-sm text-muted-foreground mt-1">
              By {manga.author || 'Unknown Author'}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {manga.genres?.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-muted">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4">
              <Badge 
                variant={manga.status === 'Ongoing' ? 'default' : 'secondary'}
                className={manga.status === 'Ongoing' ? 'bg-accent' : ''}
              >
                {manga.status || 'Unknown Status'}
              </Badge>
            </div>
            
            {/* Reading Progress */}
            {manga.currentChapter && manga.totalChapters && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Reading Progress</span>
                  <span>
                    {manga.currentChapter}/{manga.totalChapters} chapters
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 flex-wrap justify-center sm:justify-start">
              <Button className="bg-accent hover:bg-accent/90 text-white flex-1 sm:flex-none">
                <BookOpen className="w-4 h-4 mr-2" />
                {manga.currentChapter ? 'Continue Reading' : 'Start Reading'}
              </Button>
              
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 flex-1 sm:flex-none">
                <Bookmark className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          </div>
        </div>
        
        {/* Synopsis */}
        <div className="bg-card rounded-lg p-4 border border-border animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => setExpandSynopsis(!expandSynopsis)}
          >
            <h2 className="text-lg font-semibold">Synopsis</h2>
            {expandSynopsis ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          
          <div className={`mt-2 text-sm text-muted-foreground overflow-hidden transition-all duration-300 ${expandSynopsis ? 'max-h-96' : 'max-h-16'}`}>
            <p>{manga.description || 'No synopsis available for this manga.'}</p>
          </div>
        </div>
        
        {/* Chapters List */}
        <div className="space-y-4 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-semibold">Chapters</h2>
          
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <Link 
                key={chapter.id}
                to={`/manga/${manga.id}/chapter/${chapter.number}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  chapter.isRead 
                    ? 'bg-secondary/30 border-border text-muted-foreground' 
                    : 'bg-card border-border hover:border-accent'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${chapter.isRead ? 'bg-muted-foreground' : 'bg-accent animate-pulse'}`}></div>
                  <span className="font-medium">{chapter.title}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-muted-foreground">
                    {chapter.releaseDate.toLocaleDateString()}
                  </span>
                  
                  {chapter.isDownloaded && (
                    <Download className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MangaDetailsPage;
