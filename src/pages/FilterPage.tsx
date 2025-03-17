
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Genre list for filtering
const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", 
  "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", 
  "Supernatural", "Thriller"
];

const FilterPage = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [status, setStatus] = useState("all");
  const [readingStatus, setReadingStatus] = useState("all");
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedGenres([]);
    setSortBy("latest");
    setStatus("all");
    setReadingStatus("all");
    setDownloadedOnly(false);
  };
  
  // Apply filters and go back
  const applyFilters = () => {
    // In a real app, this would save the filter state
    console.log("Applied filters:", {
      genres: selectedGenres,
      sortBy,
      status,
      readingStatus,
      downloadedOnly
    });
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen pb-6 animate-fadeIn">
      <AppHeader 
        title="Filter Manga"
        showBackButton={true}
        showSearch={false}
        showSettings={false}
        showFilter={false}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="ml-auto text-accent"
        >
          Reset
        </Button>
      </AppHeader>
      
      <main className="container px-4 py-6 space-y-8">
        {/* Sort Options */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Sort By</h2>
          
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
              <SelectItem value="most-read">Most Read</SelectItem>
              <SelectItem value="recently-added">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </section>
        
        {/* Genre Selection */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Genres</h2>
          
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedGenres.includes(genre) ? "bg-accent hover:bg-accent/80" : ""
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </section>
        
        {/* Status Filter */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Status</h2>
          
          <RadioGroup defaultValue={status} onValueChange={setStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ongoing" id="status-ongoing" />
              <Label htmlFor="status-ongoing">Ongoing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="status-completed" />
              <Label htmlFor="status-completed">Completed</Label>
            </div>
          </RadioGroup>
        </section>
        
        {/* Reading Status Filter */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Reading Status</h2>
          
          <RadioGroup defaultValue={readingStatus} onValueChange={setReadingStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="reading-all" />
              <Label htmlFor="reading-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unread" id="reading-unread" />
              <Label htmlFor="reading-unread">Unread</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-progress" id="reading-in-progress" />
              <Label htmlFor="reading-in-progress">In Progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="reading-completed" />
              <Label htmlFor="reading-completed">Completed</Label>
            </div>
          </RadioGroup>
        </section>
        
        {/* Downloaded Only Toggle */}
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Downloaded Only</h2>
            <p className="text-sm text-muted-foreground">Show only downloaded manga</p>
          </div>
          <Switch 
            checked={downloadedOnly} 
            onCheckedChange={setDownloadedOnly} 
          />
        </section>
        
        {/* Apply Filters Button */}
        <Button 
          className="w-full bg-accent hover:bg-accent/90 text-white py-6"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </main>
    </div>
  );
};

export default FilterPage;
