import React, { useState } from "react";
import { SortAsc, Filter } from "lucide-react";
import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import FilterButton from "@/components/ui-components/FilterButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockManga } from "@/data/mockData";
const HomePage = () => {
  const [sortBy, setSortBy] = useState("last_read");
  const [filterActive, setFilterActive] = useState(false);
  const [activeCollection, setActiveCollection] = useState("all");
  const handleSortClick = () => {
    // Toggle between different sort options
    const sortOptions = ["last_read", "a_z", "recent", "popular"];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };
  const handleFilterClick = () => {
    setFilterActive(!filterActive);
    // This would typically open a filter modal or expand filter options
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
  const mangaCount = 27;
  const manhwaCount = 292;
  const completedCount = 36;
  const totalCount = mangaCount + manhwaCount + completedCount;
  return <div className="pb-20 animate-fadeIn">
      <AppHeader title="Library" showBackButton={false} className="justify-between">
        
      </AppHeader>
      
      <main className="container px-4 py-2 space-y-6">
        {/* Collection Filter Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCollection}>
          <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="all" className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none">
              All
            </TabsTrigger>
            <TabsTrigger value="manhwa" className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center">
              <span>Currently reading</span>
              <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">{manhwaCount}</span>
            </TabsTrigger>
            <TabsTrigger value="manga" className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center">
              <span>Planning to read</span>
              <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">{mangaCount}</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center">
              <span>Completed/Stopped</span>
              <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">{completedCount}</span>
            </TabsTrigger>
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
            {mockManga.map(manga => <MangaCard key={manga.id} id={manga.id} title={manga.title} coverImage={manga.coverImage} totalChapters={manga.totalChapters} currentChapter={manga.currentChapter} showProgress={false} />)}
          </div>
        </section>
      </main>
      
      <BottomNavigation />
    </div>;
};
export default HomePage;