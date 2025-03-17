
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  id: string;
  name: string;
  count: number;
  coverImages: string[];
  className?: string;
}

const CollectionCard = ({
  id,
  name,
  count,
  coverImages,
  className,
}: CollectionCardProps) => {
  return (
    <Link 
      to={`/collections/${id}`}
      className={cn(
        "block relative rounded-lg overflow-hidden h-36 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      {/* Collection Cover Preview */}
      <div className="relative h-full flex">
        {coverImages.slice(0, 3).map((image, index) => (
          <div 
            key={index}
            className={cn(
              "h-full",
              index === 0 ? "w-full" : "w-20 absolute",
              index === 1 ? "right-12 opacity-60" : "",
              index === 2 ? "right-6 opacity-40" : ""
            )}
          >
            <img 
              src={image} 
              alt=""
              className="h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {/* Collection Info */}
      <div className="absolute bottom-0 left-0 w-full p-3 text-white">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-white/70">{count} manga</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
