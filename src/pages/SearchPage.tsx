
import React, { useState, useEffect } from "react";
import { ChevronDown, X, Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockManga } from "@/data/mockData";
import { cn } from "@/lib/utils";

// Genre list for filtering
const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", 
  "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", 
  "Supernatural", "Thriller"
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [filteredManga, setFilteredManga] = useState(mockManga);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter manga based on search term and selected genres
  useEffect(() => {
    const results = mockManga.filter(manga => {
      const matchesSearch = searchTerm === "" || 
        manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manga.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.some(genre => manga.genres.includes(genre));
        
      return matchesSearch && matchesGenres;
    });
    
    setFilteredManga(results);
  }, [searchTerm, selectedGenres]);
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedGenres([]);
    setSearchTerm("");
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title="Search" 
        showBackButton={true} 
        showSearch={false}
      />
      
      <div className="container px-4 py-4 space-y-6">
        {/* Search Bar */}
        <div className="relative animate-slideDown">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <input
            type="text"
            placeholder="Search manga, authors or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {/* Filters Toggle */}
        <div className="animate-slideDown" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm"
          >
            <span className="font-medium">Filters & Sorting</span>
            <ChevronDown 
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                showFilters ? "transform rotate-180" : ""
              )} 
            />
          </button>
        </div>
        
        {/* Filter Options (Expandable) */}
        {showFilters && (
          <div className="p-4 bg-secondary/30 border border-border rounded-lg space-y-4 animate-slideDown" style={{ animationDelay: "0.2s" }}>
            <div>
              <h3 className="text-sm font-medium mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      selectedGenres.includes(genre) ? "bg-accent hover:bg-accent/80" : ""
                    )}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Search Results */}
        <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium">
              {filteredManga.length} {filteredManga.length === 1 ? "Result" : "Results"} Found
            </h2>
          </div>
          
          {filteredManga.length > 0 ? (
            <div className="space-y-4">
              {filteredManga.map((manga) => (
                <Link 
                  key={manga.id}
                  to={`/manga/${manga.id}`}
                  className="flex p-3 bg-card border border-border rounded-lg transition-all hover:shadow-md"
                >
                  <div className="w-16 h-24 flex-shrink-0">
                    <img 
                      src={manga.coverImage} 
                      alt={manga.title}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium">{manga.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{manga.author}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {manga.genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {manga.genres.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{manga.genres.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {manga.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No results found.</p>
              <p className="text-xs mt-1">Try different keywords or filters.</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
