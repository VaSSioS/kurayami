
import React, { useState } from "react";
import NotificationToast from "@/components/ui-components/NotificationToast";
import { mockNotifications } from "@/data/mockData";

interface NotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsOverlay = ({ isOpen, onClose }: NotificationsOverlayProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm max-h-[80vh] overflow-y-auto space-y-3 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Notifications</h2>
          <button 
            onClick={onClose}
            className="text-sm text-accent underline"
          >
            Close
          </button>
        </div>
        
        {notifications.length > 0 ? (
          <>
            {notifications.map(notification => (
              <NotificationToast 
                key={notification.id}
                id={notification.id}
                title={notification.title}
                message={notification.message}
                mangaId={notification.mangaId}
                chapterId={notification.chapterId}
                coverImage={notification.coverImage}
                onDismiss={dismissNotification}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsOverlay;
