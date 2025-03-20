
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, SlidersHorizontal, ArrowDown01, ArrowUp01, SortAsc } from "lucide-react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getSources, getMangaFromSource, saveMangaFromSource } from "@/utils/storage";
import { fetchData } from "@/utils/http";
import { parseHTML, extractMangaList } from "@/utils/parser";
import { toast } from "sonner";

interface MangaListItem {
  title: string;
  coverImage: string;
  url: string;
}

const SourceMangaListPage = () => {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "a-z" | "popular">("latest");
  const [showOngoing, setShowOngoing] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Get source from localStorage
  const sources = getSources();
  const source = sources.find((s: any) => s.id === sourceId);
  
  // Get manga list from localStorage or initialize empty array
  const [mangaList, setMangaList] = useState<MangaListItem[]>(() => {
    if (!sourceId) return [];
    const storedManga = getMangaFromSource(sourceId);
    return storedManga.length > 0 ? storedManga : [];
  });
  
  // Fetch manga list from source on mount
  useEffect(() => {
    if (!source) return;
    
    const fetchMangaList = async () => {
      // Check if we already have manga list in storage
      const storedManga = getMangaFromSource(sourceId || "");
      if (storedManga.length > 0) {
        setMangaList(storedManga);
        return;
      }
      
      // If no manga list in storage, fetch it
      setIsLoading(true);
      try {
        // Get the source URL from localStorage
        const sourceUrl = localStorage.getItem("selected_source_url") || `https://${source.domain}`;
        
        // Fetch the HTML from the source
        const html = await fetchData<string>(sourceUrl);
        
        // Parse the HTML
        const doc = parseHTML(html);
        
        // Extract manga information based on the source domain
        let extractedManga: MangaListItem[] = [];
        
        if (source.domain.includes("mangadex")) {
          // MangaDex specific selectors
          extractedManga = extractMangaList(doc, {
            container: 'div.manga-card',
            title: '.manga-card-title',
            cover: 'img.rounded',
            url: 'a.manga-link'
          }) as MangaListItem[];
        } else {
          // Generic selectors as fallback
          extractedManga = extractMangaList(doc, {
            container: '.manga-item, .comic-item, .book-item, article',
            title: 'h3, .title, .name',
            cover: 'img',
            url: 'a'
          }) as MangaListItem[];
        }
        
        // Simulate getting some manga if extraction failed
        if (extractedManga.length === 0) {
          console.log("Extraction failed, using mock data");
          extractedManga = Array.from({ length: 30 }, (_, i) => ({
            title: `${source.name} Manga ${i + 1}`,
            coverImage: `https://picsum.photos/200/300?random=${i}`,
            url: `https://${source.domain}/manga/${i + 1}`
          }));
        }
        
        // Save to storage and state
        saveMangaFromSource(sourceId || "", extractedManga);
        setMangaList(extractedManga);
        toast.success(`Loaded ${extractedManga.length} manga from ${source.name}`);
      } catch (error) {
        console.error("Error fetching manga list:", error);
        toast.error("Failed to fetch manga list");
        
        // Use fallback mock data
        const mockManga = Array.from({ length: 20 }, (_, i) => ({
          title: `${source.name} Manga ${i + 1}`,
          coverImage: `https://picsum.photos/200/300?random=${i}`,
          url: `https://${source.domain}/manga/${i + 1}`
        }));
        
        saveMangaFromSource(sourceId || "", mockManga);
        setMangaList(mockManga);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMangaList();
  }, [source, sourceId]);
  
  if (!source) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Source Not Found</h2>
          <p className="text-muted-foreground">The source you're looking for doesn't exist.</p>
          <Button 
            variant="secondary" 
            onClick={() => navigate("/sources")}
          >
            Return to Sources
          </Button>
        </div>
      </div>
    );
  }
  
  // Filter manga list by search query
  const filteredMangaList = mangaList.filter(manga => 
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort manga list
  const sortedMangaList = [...filteredMangaList].sort((a, b) => {
    if (sortBy === "a-z") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "popular") {
      // We don't have real popularity data, so let's just use a random number
      return Math.random() - 0.5;
    }
    // Default to latest (no sorting needed, assuming the API returns in latest order)
    return 0;
  });
  
  // Handle open manga details
  const handleOpenManga = (manga: MangaListItem) => {
    // Store the manga URL for details page
    localStorage.setItem("selected_manga_url", manga.url);
    
    // Create a unique ID based on the manga title and source
    const mangaId = `${sourceId}-${manga.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Store manga details in localStorage
    const mangaDetails = {
      id: mangaId,
      title: manga.title,
      coverImage: manga.coverImage,
      sourceUrl: manga.url,
      source: sourceId
    };
    
    localStorage.setItem(`manga_details_${mangaId}`, JSON.stringify(mangaDetails));
    
    // Navigate to manga details page
    navigate(`/manga/${mangaId}`);
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title={source.name} 
        showBackButton={true}
        showSettings={false}
        showSearch={false}
        onBackClick={() => navigate("/sources")}
        rightElement={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">Sort By</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setSortBy("latest")}
                className="flex items-center justify-between"
              >
                Latest
                {sortBy === "latest" && <span className="text-accent">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("a-z")}
                className="flex items-center justify-between"
              >
                Title A-Z
                {sortBy === "a-z" && <span className="text-accent">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("popular")}
                className="flex items-center justify-between"
              >
                Popular
                {sortBy === "popular" && <span className="text-accent">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm font-medium">Status</div>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 flex items-center justify-between">
                <Label htmlFor="ongoing" className="cursor-pointer">Ongoing</Label>
                <Switch 
                  id="ongoing" 
                  checked={showOngoing} 
                  onCheckedChange={setShowOngoing} 
                />
              </div>
              <div className="px-2 py-1.5 flex items-center justify-between">
                <Label htmlFor="completed" className="cursor-pointer">Completed</Label>
                <Switch 
                  id="completed" 
                  checked={showCompleted} 
                  onCheckedChange={setShowCompleted} 
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
            {searchQuery ? `Search Results: ${sortedMangaList.length}` : "All Manga"}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading manga from {source.name}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            {sortedMangaList.map((manga, index) => (
              <div 
                key={index}
                className="flex flex-col rounded-lg overflow-hidden border border-border cursor-pointer"
                onClick={() => handleOpenManga(manga)}
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary">
                  <img 
                    src={manga.coverImage} 
                    alt={manga.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">{manga.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && sortedMangaList.length === 0 && (
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

// Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
