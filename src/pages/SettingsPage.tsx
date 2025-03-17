
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, CircleQuestion, Globe, HelpCircle, LogOut, 
  Moon, Palette, Shield, Sun, User, X
} from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [fontScale, setFontScale] = useState([100]);
  const [accentColor, setAccentColor] = useState("red");
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the theme
  };
  
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would update notification settings
  };
  
  const handleFontSizeChange = (value: number[]) => {
    setFontScale(value);
    // In a real app, this would update the font size
  };
  
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    // In a real app, this would update the accent color
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
      />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Theme and Display Section */}
        <section className="space-y-4 animate-slideDown">
          <h2 className="text-lg font-medium mb-2">Theme & Display</h2>
          
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
        </section>
        
        {/* Notification Preferences */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-lg font-medium mb-2">Notifications</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-accent" />
              <span>Push Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={handleToggleNotifications} />
          </div>
        </section>
        
        {/* Language and Region */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-medium mb-2">Language & Region</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-3 text-accent" />
              <span>Language</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <span>English</span>
            </div>
          </div>
        </section>
        
        {/* Account Settings */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-medium mb-2">Account</h2>
          
          <Link
            to="/account-settings"
            className="p-4 bg-card border border-border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-accent" />
              <span>Profile Settings</span>
            </div>
          </Link>
        </section>
        
        {/* Privacy and Data */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-medium mb-2">Privacy & Data</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-accent" />
              <span>Privacy Policy</span>
            </div>
          </div>
          
          <button
            className="w-full p-4 bg-card border border-border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <X className="w-5 h-5 mr-3 text-accent" />
              <span>Clear App Data</span>
            </div>
          </button>
        </section>
        
        {/* Help and Support */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-lg font-medium mb-2">Help & Support</h2>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <CircleQuestion className="w-5 h-5 mr-3 text-accent" />
              <span>FAQs</span>
            </div>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-accent" />
              <span>Contact Support</span>
            </div>
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
        
        {/* Logout */}
        <section className="pt-4 animate-slideUp" style={{ animationDelay: "0.6s" }}>
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
