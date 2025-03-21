
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Collection } from "@/types/collection";

interface CollectionTabsProps {
  collections: (Collection & { count?: number })[];
  activeCollection: string;
  setActiveCollection: (value: string) => void;
  onRenameClick: (collection: { id: string; name: string }) => void;
  onDeleteClick?: (collectionId: string) => void;
}

const CollectionTabs: React.FC<CollectionTabsProps> = ({
  collections,
  activeCollection,
  setActiveCollection,
  onRenameClick,
  onDeleteClick
}) => {
  return (
    <Tabs 
      defaultValue={activeCollection} 
      value={activeCollection} 
      onValueChange={setActiveCollection} 
      className="w-full"
    >
      <TabsList className="w-full h-12 bg-background rounded-none border-b border-border p-0 justify-start overflow-x-auto no-scrollbar">
        {collections.map((collection) => {
          const isDefaultCollection = collection.id === "all";
          const count = collection.count || 0;
          
          return (
            <div key={collection.id} className="relative group">
              <TabsTrigger 
                value={collection.id} 
                className="px-4 py-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none transition-none flex gap-2 items-center"
              >
                {collection.icon && typeof collection.icon === 'function' && 
                  React.createElement(collection.icon, { className: "w-4 h-4" })}
                <span>{collection.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </TabsTrigger>
              
              {/* Only show dropdown for custom collections (not default ones) */}
              {!isDefaultCollection && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onRenameClick({
                      id: collection.id,
                      name: collection.name
                    })}>
                      Rename
                    </DropdownMenuItem>
                    {onDeleteClick && (
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(collection.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default CollectionTabs;
