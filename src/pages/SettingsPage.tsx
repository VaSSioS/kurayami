
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, FileQuestion, Globe, HelpCircle, Moon, 
  Palette, Shield, Sun, X, AlertTriangle
} from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mangaUpdates, setMangaUpdates] = useState(true);
  const [fontScale, setFontScale] = useState([100]);
  const [accentColor, setAccentColor] = useState("red");
  const [language, setLanguage] = useState("english");
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the theme
    document.documentElement.classList.toggle('dark', !darkMode);
  };
  
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
  };
  
  const handleToggleMangaUpdates = () => {
    setMangaUpdates(!mangaUpdates);
  };
  
  const handleFontSizeChange = (value: number[]) => {
    setFontScale(value);
  };
  
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };
  
  // Available accent colors
  const accentColors = [
    { name: "red", color: "#A50000" },
    { name: "blue", color: "#0066CC" },
    { name: "green", color: "#008055" },
    { name: "purple", color: "#6C0BA9" },
    { name: "orange", color: "#CC5500" },
  ];
  
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
        {/* Theme and Display Section */}
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
              {accentColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleAccentColorChange(color.name)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    accentColor === color.name ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  aria-label={`Set accent color to ${color.name}`}
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
        
        {/* Privacy and Security */}
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
        
        {/* Notification Preferences */}
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
        
        {/* Help and Support */}
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
        
        {/* Logout */}
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
      
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
