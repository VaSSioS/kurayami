
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, BookOpen, Check, ChevronRight, 
  Moon, LogOut, Settings, Sun, UserCircle 
} from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockManga, mockCollections } from "@/data/mockData";

const ProfilePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Stats calculations
  const totalManga = mockManga.length;
  const inProgress = mockManga.filter(m => !m.isCompleted).length;
  const completed = mockManga.filter(m => m.isCompleted).length;
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would also update the theme
  };
  
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would update notification settings
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title="Profile" 
        showBackButton={false} 
        showSearch={false}
        showSettings={false}
      />
      
      <main className="container px-4 py-6 space-y-8">
        {/* User Info Section */}
        <section className="flex items-center animate-slideDown">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://picsum.photos/seed/user/200" alt="User" />
            <AvatarFallback>
              <UserCircle className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-4">
            <h2 className="text-xl font-medium">Guest User</h2>
            <p className="text-sm text-muted-foreground">guest@example.com</p>
          </div>
        </section>
        
        {/* Reading Progress Section */}
        <section className="grid grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-2xl font-medium">{totalManga}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Manga</p>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-2xl font-medium">{inProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">In Progress</p>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-2xl font-medium">{completed}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
        </section>
        
        {/* Collections Section */}
        <section className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-medium mb-3">Collections</h3>
          
          <div className="space-y-2">
            {mockCollections.map(collection => (
              <Link
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
              >
                <span className="font-medium">{collection.name}</span>
                <div className="flex items-center text-muted-foreground">
                  <span className="text-sm mr-1">{collection.mangaIds.length}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
            
            <Link
              to="/collections/new"
              className="flex items-center justify-center p-3 bg-secondary/50 border border-dashed border-border rounded-lg text-muted-foreground"
            >
              <span className="text-sm">Create New Collection</span>
            </Link>
          </div>
        </section>
        
        {/* Settings Section */}
        <section className="space-y-2 animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-medium mb-3">Settings</h3>
          
          <div className="p-3 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
              <span>Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
          </div>
          
          <div className="p-3 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3" />
              <span>Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={handleToggleNotifications} />
          </div>
          
          <Link
            to="/reading-history"
            className="p-3 bg-card border border-border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Reading History</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          
          <Link
            to="/account-settings"
            className="p-3 bg-card border border-border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              <span>Account Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          
          <button
            className="w-full p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center justify-center mt-4"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log Out</span>
          </button>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
