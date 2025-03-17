
import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  id: string;
  title: string;
  message: string;
  mangaId?: string;
  chapterId?: string;
  coverImage?: string;
  onDismiss: (id: string) => void;
  className?: string;
}

const NotificationToast = ({
  id,
  title,
  message,
  mangaId,
  chapterId,
  coverImage,
  onDismiss,
  className,
}: NotificationToastProps) => {
  return (
    <div 
      className={cn(
        "w-full max-w-sm bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-slideInRight",
        className
      )}
    >
      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
        </div>
        
        {coverImage && (
          <div className="ml-3 w-12 h-16 rounded overflow-hidden">
            <img 
              src={coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <button 
          onClick={() => onDismiss(id)}
          className="ml-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex border-t border-border">
        {mangaId && (
          <Link
            to={chapterId ? `/manga/${mangaId}/chapter/${chapterId}` : `/manga/${mangaId}`}
            className="flex-1 py-2 text-center text-xs font-medium text-accent hover:bg-secondary/50 transition-colors"
          >
            View
          </Link>
        )}
        
        <button
          onClick={() => onDismiss(id)}
          className="flex-1 py-2 text-center text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
