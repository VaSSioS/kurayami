
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, ChevronRight, LogOut, User, Key, AlertTriangle
} from "lucide-react";

import AppHeader from "@/components/ui-components/AppHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockCollections } from "@/data/mockData";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest User");
  const [email, setEmail] = useState("guest@example.com");
  const [editing, setEditing] = useState(false);
  
  const handleSaveProfile = () => {
    setEditing(false);
    // In a real app, this would save the profile
    console.log("Saved profile:", { username, email });
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title="Profile Settings" 
        showBackButton={true} 
        showSearch={false}
        showSettings={false}
        showFilter={false}
      />
      
      <main className="container px-4 py-6 space-y-8">
        {/* User Info Section */}
        <section className="flex flex-col items-center animate-slideDown">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://picsum.photos/seed/user/200" alt="User" />
              <AvatarFallback>
                <User className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <button className="absolute bottom-0 right-0 bg-accent rounded-full p-1.5 text-white">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full mt-6 space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Username</label>
                  <Input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email"
                    className="w-full"
                  />
                </div>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-white" 
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-medium">{username}</h2>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </section>
        
        <Separator />
        
        {/* Account Management Section */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-medium">Account Management</h3>
          
          <div className="space-y-2">
            <button className="w-full p-3 text-left bg-card border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-5 h-5 mr-3 text-accent" />
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full p-3 text-left bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3" />
                <span>Delete Account</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
        
        <Separator />
        
        {/* Logout */}
        <section className="pt-4 animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log Out</span>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
