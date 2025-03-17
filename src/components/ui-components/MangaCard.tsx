
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MangaCardProps {
  id: string;
  title: string;
  coverImage: string;
  totalChapters?: number;
  currentChapter?: number;
  className?: string;
  aspectRatio?: "portrait" | "square";
  showProgress?: boolean;
  isContinueReading?: boolean;
}

const MangaCard = ({
  id,
  title,
  coverImage,
  totalChapters,
  currentChapter,
  className,
  aspectRatio = "portrait",
  showProgress = true,
  isContinueReading = false,
}: MangaCardProps) => {
  const progress = currentChapter && totalChapters 
    ? Math.round((currentChapter / totalChapters) * 100) 
    : 0;
  
  const isCompleted = currentChapter && totalChapters && currentChapter >= totalChapters;
  
  return (
    <div 
      className={cn(
        "manga-card group",
        className
      )}
    >
      <Link to={`/manga/${id}`} className="relative block w-full h-full">
        <div 
          className={cn(
            "manga-cover card-hover",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        >
          <img 
            src={coverImage} 
            alt={title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="mt-2 space-y-1">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          
          {showProgress && (
            <>
              {isCompleted ? (
                <span className="text-xs text-accent">Completed</span>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Chapter {currentChapter}/{totalChapters}</span>
                  </div>
                  
                  {isContinueReading && (
                    <div className="relative">
                      <Progress value={progress} className="h-1" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Link>
      
      {isContinueReading && (
        <Link 
          to={`/manga/${id}/chapter/${currentChapter}`}
          className="mt-3 text-center py-1.5 px-3 bg-accent text-white text-xs font-medium rounded-md transition-transform hover:translate-y-[-2px]"
        >
          Continue
        </Link>
      )}
    </div>
  );
};

export default MangaCard;
