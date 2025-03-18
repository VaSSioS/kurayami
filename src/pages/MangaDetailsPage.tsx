import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BookOpen, Download, Bookmark, ChevronRight, ChevronDown, Check, Plus } from "lucide-react";
import { toast } from "sonner";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockManga, mockCollections, Collection } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const MangaDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandSynopsis, setExpandSynopsis] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);
  const [collections, setCollections] = useState(mockCollections);
  
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
    isDownloaded: downloadedChapters.includes(`ch${i + 1}`) || Math.random() > 0.7,
  }));
  
  const handleDownloadChapter = (chapterId: string) => {
    if (!downloadedChapters.includes(chapterId)) {
      setDownloadedChapters([...downloadedChapters, chapterId]);
      // In a real app, this would trigger a download
      toast.success(`Downloaded chapter ${chapterId.replace('ch', '')}`);
    }
  };
  
  const handleDownloadAllChapters = () => {
    const allChapterIds = chapters.map(chapter => chapter.id);
    setDownloadedChapters([...new Set([...downloadedChapters, ...allChapterIds])]);
    toast.success(`Downloaded all chapters of ${manga.title}`);
  };
  
  const handleAddToCollection = () => {
    setShowCollectionDialog(true);
  };
  
  const handleSelectCollection = (collectionId: string) => {
    // Update collections state to include the manga
    const updatedCollections = collections.map(collection => 
      collection.id === collectionId 
        ? { 
            ...collection, 
            mangaIds: collection.mangaIds.includes(manga.id) 
              ? collection.mangaIds 
              : [...collection.mangaIds, manga.id] 
          } 
        : collection
    );
    
    setCollections(updatedCollections);
    
    // Update mockCollections to persist changes
    // In a real app, this would save to localStorage or a database
    const collectionIndex = mockCollections.findIndex(c => c.id === collectionId);
    if (collectionIndex !== -1) {
      if (!mockCollections[collectionIndex].mangaIds.includes(manga.id)) {
        mockCollections[collectionIndex].mangaIds.push(manga.id);
      }
    }
    
    setShowCollectionDialog(false);
    toast.success(`Added ${manga.title} to collection`);
  };
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim() === "") {
      toast.error("Please enter a collection name");
      return;
    }
    
    // Create a new collection with the manga already added
    const newCollection: Collection = {
      id: `${Date.now()}`, // Generate a unique ID based on timestamp
      name: newCollectionName.trim(),
      mangaIds: [manga.id],
    };
    
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    
    // Update mockCollections to persist changes
    // In a real app, this would save to localStorage or a database
    mockCollections.push(newCollection);
    
    setShowCreateCollectionDialog(false);
    setNewCollectionName("");
    toast.success(`Created new collection: ${newCollectionName}`);
  };
  
  const handleContinueReading = () => {
    if (manga.currentChapter) {
      navigate(`/manga/${manga.id}/chapter/${manga.currentChapter}`);
    } else {
      navigate(`/manga/${manga.id}/chapter/1`);
    }
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title={manga.title}
        showBackButton={true}
        showSearch={false}
        showSettings={true}
        showProfile={false}
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
              <Button 
                className="bg-accent hover:bg-accent/90 text-white flex-1 sm:flex-none"
                onClick={handleContinueReading}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {manga.currentChapter ? 'Continue Reading' : 'Start Reading'}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 flex-1 sm:flex-none"
                onClick={handleDownloadAllChapters}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
              
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 flex-1 sm:flex-none"
                onClick={handleAddToCollection}
              >
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
            {chapters.map((chapter) => (
              <div 
                key={chapter.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  chapter.isRead 
                    ? 'bg-secondary/30 border-border text-muted-foreground' 
                    : 'bg-card border-border hover:border-accent'
                }`}
              >
                <Link 
                  to={`/manga/${manga.id}/chapter/${chapter.number}`}
                  className="flex-1 flex items-center"
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${chapter.isRead ? 'bg-muted-foreground' : 'bg-accent animate-pulse'}`}></div>
                  <span className="font-medium">{chapter.title}</span>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-muted-foreground">
                    {chapter.releaseDate.toLocaleDateString()}
                  </span>
                  
                  <button
                    onClick={() => handleDownloadChapter(chapter.id)}
                    className="p-1"
                  >
                    {chapter.isDownloaded || downloadedChapters.includes(chapter.id) ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Download className="w-4 h-4 text-muted-foreground hover:text-accent" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Add to Collection Dialog */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Choose a collection to add this manga to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {collections.map(collection => {
              const isInCollection = collection.mangaIds.includes(manga.id);
              
              return (
                <button
                  key={collection.id}
                  className={`w-full p-3 text-left bg-card border ${isInCollection ? 'border-accent' : 'border-border'} rounded-lg hover:border-accent transition-colors flex justify-between items-center`}
                  onClick={() => handleSelectCollection(collection.id)}
                >
                  <span>{collection.name}</span>
                  {isInCollection && <Check className="w-4 h-4 text-accent" />}
                </button>
              );
            })}
            
            <Button 
              variant="outline" 
              className="w-full p-3 text-center flex items-center justify-center mt-4"
              onClick={() => {
                setShowCollectionDialog(false);
                setShowCreateCollectionDialog(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Collection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Collection Dialog */}
      <Dialog open={showCreateCollectionDialog} onOpenChange={setShowCreateCollectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Enter a name for your new collection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCollectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default MangaDetailsPage;
