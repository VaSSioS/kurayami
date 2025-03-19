
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, SortAsc, Filter, ArrowLeft } from "lucide-react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockManga } from "@/data/mockData";

const SourceMangaListPage = () => {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showSearch, setShowSearch] = useState(false);
  
  // Get source from localStorage
  const sources = JSON.parse(localStorage.getItem("sources") || "[]");
  const source = sources.find((s: any) => s.id === sourceId);
  
  if (!source) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Source Not Found</h2>
          <p className="text-muted-foreground">The source you're looking for doesn't exist.</p>
          <Button 
            variant="accent" 
            onClick={() => navigate("/sources")}
          >
            Return to Sources
          </Button>
        </div>
      </div>
    );
  }
  
  // For demo purposes, using mockManga data filtered by search query
  const mangaList = mockManga.filter(manga => 
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle sort change
  const handleSortChange = () => {
    const sortOptions = ["latest", "a-z", "popular"];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };
  
  // Get sort label
  const getSortLabel = () => {
    switch (sortBy) {
      case "latest":
        return "Latest";
      case "a-z":
        return "A-Z";
      case "popular":
        return "Popular";
      default:
        return "Sort";
    }
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title={source.name} 
        showBackButton={true}
        showSettings={false}
        onBackClick={() => navigate("/sources")}
        rightElement={
          <Button variant="ghost" size="icon" onClick={handleSortChange}>
            <SortAsc className="h-5 w-5" />
          </Button>
        }
        rightElement2={
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(show => !show)}>
            <Search className="h-5 w-5" />
          </Button>
        }
      />
      
      <main className="container px-4 py-2 space-y-6">
        {showSearch && (
          <div className="pt-2 animate-slideDown">
            <Input
              placeholder="Search manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {searchQuery ? `Search Results: ${mangaList.length}` : "All Manga"}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <SortAsc className="h-3 w-3 mr-1" />
              <span>{getSortLabel()}</span>
            </Badge>
            
            <Button variant="outline" size="sm" className="h-8" onClick={() => navigate("/filter")}>
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          {mangaList.map(manga => (
            <div 
              key={manga.id}
              className="flex flex-col rounded-lg overflow-hidden border border-border cursor-pointer"
              onClick={() => navigate(`/manga/${manga.id}`)}
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary">
                <img 
                  src={manga.coverImage} 
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <Badge 
                    variant={manga.status === "Ongoing" ? "default" : "secondary"}
                    className={`text-xs ${manga.status === "Ongoing" ? "bg-accent" : ""}`}
                  >
                    {manga.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{manga.title}</h3>
                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                  <span>{manga.totalChapters} chapters</span>
                  {manga.isCompleted ? (
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] h-4 px-1 border-accent text-accent">
                      Latest: Ch. {manga.totalChapters}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {mangaList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No manga found</p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SourceMangaListPage;
