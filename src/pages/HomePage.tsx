import React, { useState, useEffect } from "react";
import { SortAsc, Filter } from "lucide-react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import FilterButton from "@/components/ui-components/FilterButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockManga, mockCollections } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("last_read");
  const [filterActive, setFilterActive] = useState(false);
  const [activeCollection, setActiveCollection] = useState("all");
  const [collections, setCollections] = useState(mockCollections);

  // Effect to update collections when they change in other components
  useEffect(() => {
    // This would typically fetch from an API or state management in a real app
    setCollections(mockCollections);
  }, []);
  const handleSortClick = () => {
    // Toggle between different sort options
    const sortOptions = ["last_read", "a_z", "recent", "popular"];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };
  const handleFilterClick = () => {
    navigate('/filter');
  };

  // Get sort label based on current sort option
  const getSortLabel = () => {
    switch (sortBy) {
      case "last_read":
        return "Last Read";
      case "a_z":
        return "A-Z";
      case "recent":
        return "Recent";
      case "popular":
        return "Popular";
      default:
        return "Sort";
    }
  };

  // Collection counts
  const allCount = mockManga.length;
  const manhwaCount = mockManga.filter(m => m.genres.includes("Manhwa") || m.genres.includes("Manhua")).length;
  const mangaCount = mockManga.filter(m => !m.genres.includes("Manhwa") && !m.genres.includes("Manhua")).length;
  const completedCount = mockManga.filter(m => m.isCompleted).length;

  // Filter manga based on active collection
  const filteredManga = React.useMemo(() => {
    if (activeCollection === "all") {
      return mockManga;
    } else if (activeCollection === "manhwa") {
      return mockManga.filter(m => m.genres.includes("Manhwa") || m.genres.includes("Manhua"));
    } else if (activeCollection === "manga") {
      return mockManga.filter(m => !m.genres.includes("Manhwa") && !m.genres.includes("Manhua"));
    } else if (activeCollection === "completed") {
      return mockManga.filter(m => m.isCompleted);
    } else if (activeCollection.startsWith("collection-")) {
      const collectionId = activeCollection.replace("collection-", "");
      const collection = collections.find(c => c.id === collectionId);
      return collection ? mockManga.filter(m => collection.mangaIds.includes(m.id)) : [];
    }
    return mockManga;
  }, [activeCollection, collections]);
  return <div className="pb-20 animate-fadeIn">
      <AppHeader title="Library" showBackButton={false} showProfile={true} showSettings={false} />

      <main className="container px-4 py-2 space-y-6">
        {/* Collection Filter Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCollection}>
          <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="all" className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center">
              <span>All</span>
              <Badge variant="secondary" className="ml-1">{allCount}</Badge>
            </TabsTrigger>
            
            
            
            
            
            
            
            {/* Show the user collections from profile */}
            {collections.map(collection => <TabsTrigger key={collection.id} value={`collection-${collection.id}`} className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center">
                <span>{collection.name}</span>
                <Badge variant="secondary" className="ml-1">{collection.mangaIds.length}</Badge>
              </TabsTrigger>)}
          </TabsList>
        </Tabs>

        {/* All Manga Section with Filters */}
        <section className="animate-slideUp" style={{
        animationDelay: "0.1s"
      }}>
          {/* Filter Buttons */}
          <div className="flex justify-end space-x-2 mb-4">
            <FilterButton type="sort" label={getSortLabel()} onClick={handleSortClick} />
            <FilterButton type="filter" label="Filter" onClick={handleFilterClick} className={filterActive ? "bg-accent text-white" : ""} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredManga.map(manga => <MangaCard key={manga.id} id={manga.id} title={manga.title} coverImage={manga.coverImage} totalChapters={manga.totalChapters} currentChapter={manga.currentChapter} showProgress={false} />)}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>;
};
export default HomePage;