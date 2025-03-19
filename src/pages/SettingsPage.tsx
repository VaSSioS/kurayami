
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, FileQuestion, Globe, HelpCircle, Moon, 
  Palette, Shield, Sun, X, AlertTriangle,
  ChevronRight, LogOut
} from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Define the accent colors
const ACCENT_COLORS = [
  { name: "blue", color: "#3E94F0", displayName: "Blue" },
  { name: "green", color: "#75B51B", displayName: "Green" },
  { name: "red", color: "#E03A24", displayName: "Red" },
  { name: "yellow", color: "#F5D72F", displayName: "Yellow" },
  { name: "purple", color: "#AC0EF0", displayName: "Purple" }
];

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Get stored theme preference or default to false (light mode)
    return localStorage.getItem("darkMode") === "true";
  });
  
  const [notifications, setNotifications] = useState(() => {
    // Get stored notification preference or default to true
    return localStorage.getItem("notifications") !== "false";
  });
  
  const [mangaUpdates, setMangaUpdates] = useState(() => {
    // Get stored manga updates preference or default to true
    return localStorage.getItem("mangaUpdates") !== "false";
  });
  
  const [fontScale, setFontScale] = useState(() => {
    // Get stored font scale or default to 100%
    const storedFontScale = localStorage.getItem("fontScale");
    return storedFontScale ? [parseInt(storedFontScale)] : [100];
  });
  
  const [accentColor, setAccentColor] = useState(() => {
    // Get stored accent color or default to red
    return localStorage.getItem("accentColor") || "red";
  });
  
  const [language, setLanguage] = useState(() => {
    // Get stored language or default to english
    return localStorage.getItem("language") || "english";
  });
  
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  const [readingHistory, setReadingHistory] = useState<string[]>(() => {
    // Get stored reading history or default to empty array
    const storedHistory = localStorage.getItem("readingHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  
  // Apply theme on initial load and when changed
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);
  
  // Apply font size on initial load and when changed
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale[0]}%`;
    localStorage.setItem("fontScale", fontScale[0].toString());
  }, [fontScale]);
  
  // Apply accent color on initial load and when changed
  useEffect(() => {
    const colorObj = ACCENT_COLORS.find(c => c.name === accentColor);
    if (colorObj) {
      document.documentElement.style.setProperty('--accent', colorObj.color);
      document.documentElement.style.setProperty('--accent-foreground', '#ffffff');
    }
    localStorage.setItem("accentColor", accentColor);
  }, [accentColor]);
  
  // Save reading history when changed
  useEffect(() => {
    localStorage.setItem("readingHistory", JSON.stringify(readingHistory));
  }, [readingHistory]);
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(!darkMode ? "Dark mode enabled" : "Light mode enabled");
  };
  
  const handleToggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", newValue.toString());
    toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
  };
  
  const handleToggleMangaUpdates = () => {
    const newValue = !mangaUpdates;
    setMangaUpdates(newValue);
    localStorage.setItem("mangaUpdates", newValue.toString());
    toast.success(mangaUpdates ? "Manga updates disabled" : "Manga updates enabled");
  };
  
  const handleFontSizeChange = (value: number[]) => {
    setFontScale(value);
    toast.success(`Font size set to ${value[0]}%`);
  };
  
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    toast.success(`Accent color changed to ${ACCENT_COLORS.find(c => c.name === color)?.displayName || color}`);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    toast.success(`Language changed to ${value}`);
  };
  
  const handleClearHistory = () => {
    // Clear reading history
    setReadingHistory([]);
    setShowClearHistoryDialog(false);
    toast.success("Reading history cleared");
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title="Settings" 
        showBackButton={true}
        showSearch={false}
        showSettings={false}
        showFilter={false}
      />
      
      <main className="container px-4 py-6 space-y-6">
        <section className="space-y-4 animate-slideDown">
          <h2 className="text-lg font-medium mb-2">Customization & Preferences</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? <Moon className="w-5 h-5 mr-3 text-accent" /> : <Sun className="w-5 h-5 mr-3 text-accent" />}
              <span>Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg space-y-3">
            <div className="flex items-center mb-2">
              <Palette className="w-5 h-5 mr-3 text-accent" />
              <span>Accent Color</span>
            </div>
            
            <div className="flex justify-between gap-2">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleAccentColorChange(color.name)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    accentColor === color.name ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  aria-label={`Set accent color to ${color.displayName}`}
                />
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs">A</span>
                <span className="mx-2">Font Size</span>
                <span className="text-base">A</span>
              </div>
              <span className="text-sm text-muted-foreground">{fontScale[0]}%</span>
            </div>
            
            <Slider
              value={fontScale}
              onValueChange={handleFontSizeChange}
              min={75}
              max={150}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-3 text-accent" />
              <span>Language</span>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        
        <Separator />
        
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-lg font-medium mb-2">Privacy & Security</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-accent" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <button
            className="w-full p-4 bg-card border border-border rounded-lg flex items-center justify-between"
            onClick={() => setShowClearHistoryDialog(true)}
          >
            <div className="flex items-center">
              <X className="w-5 h-5 mr-3 text-accent" />
              <span>Clear Reading History</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button
            className="w-full p-4 bg-card border border-border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 text-accent" />
              <span>Manage Connected Devices</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </section>
        
        <Separator />
        
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-medium mb-2">Notifications</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-accent" />
              <span>Push Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={handleToggleNotifications} />
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="ml-8">Manga Updates</span>
            </div>
            <Switch checked={mangaUpdates} onCheckedChange={handleToggleMangaUpdates} />
          </div>
        </section>
        
        <Separator />
        
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-medium mb-2">Help & Support</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileQuestion className="w-5 h-5 mr-3 text-accent" />
              <span>FAQs</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-accent" />
              <span>Report a Problem</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span>Version</span>
            </div>
            <div className="text-muted-foreground text-sm">
              1.0.0
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section className="pt-4 animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log Out</span>
          </Button>
        </section>
      </main>
      
      {/* Clear History Confirmation Dialog */}
      <Dialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Reading History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to clear your reading history? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearHistoryDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
