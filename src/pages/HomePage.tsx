
import React, { useState } from "react";
import { SortAsc, Filter } from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import MangaCard from "@/components/ui-components/MangaCard";
import CollectionCard from "@/components/ui-components/CollectionCard";
import SectionHeader from "@/components/ui-components/SectionHeader";
import ScrollableRow from "@/components/ui-components/ScrollableRow";
import FilterButton from "@/components/ui-components/FilterButton";

import { mockManga, mockCollections, continueReading, getCollectionCovers } from "@/data/mockData";

const HomePage = () => {
  const [sortBy, setSortBy] = useState("last_read");
  const [filterActive, setFilterActive] = useState(false);
  
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
      case "last_read": return "Last Read";
      case "a_z": return "A-Z";
      case "recent": return "Recent";
      case "popular": return "Popular";
      default: return "Sort";
    }
  };
  
  return (
    <div className="pb-20 animate-fadeIn">
      <AppHeader />
      
      <main className="container px-4 py-4 space-y-8">
        {/* Collections Section */}
        <section className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <SectionHeader title="Your Collections" link="/collections" />
          
          <ScrollableRow>
            {mockCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                id={collection.id}
                name={collection.name}
                count={collection.mangaIds.length}
                coverImages={getCollectionCovers(collection.id)}
                className="min-w-[160px]"
              />
            ))}
          </ScrollableRow>
        </section>
        
        {/* Continue Reading Section */}
        <section className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <SectionHeader title="Continue Reading" link="/continue-reading" />
          
          <ScrollableRow>
            {continueReading.map(manga => (
              <MangaCard
                key={manga.id}
                id={manga.id}
                title={manga.title}
                coverImage={manga.coverImage}
                totalChapters={manga.totalChapters}
                currentChapter={manga.currentChapter}
                showProgress={true}
                isContinueReading={true}
                className="min-w-[120px]"
              />
            ))}
          </ScrollableRow>
        </section>
        
        {/* All Manga Section with Filters */}
        <section className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <SectionHeader title="Your Library">
            <div className="flex space-x-2">
              <FilterButton
                type="sort"
                label={getSortLabel()}
                onClick={handleSortClick}
              />
              <FilterButton
                type="filter"
                label="Filter"
                onClick={handleFilterClick}
                className={filterActive ? "bg-accent text-white" : ""}
              />
            </div>
          </SectionHeader>
          
          <div className="grid grid-cols-3 gap-4">
            {mockManga.map(manga => (
              <MangaCard
                key={manga.id}
                id={manga.id}
                title={manga.title}
                coverImage={manga.coverImage}
                totalChapters={manga.totalChapters}
                currentChapter={manga.currentChapter}
                showProgress={true}
              />
            ))}
          </div>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
