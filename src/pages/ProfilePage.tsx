
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, ChevronRight, LogOut, User, Key, AlertTriangle, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

import AppHeader from "@/components/ui-components/AppHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockCollections } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest User");
  const [email, setEmail] = useState("guest@example.com");
  const [editing, setEditing] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("https://picsum.photos/seed/user/200");
  
  // Sample avatars for selection
  const avatarOptions = [
    "https://picsum.photos/seed/user1/200",
    "https://picsum.photos/seed/user2/200",
    "https://picsum.photos/seed/user3/200",
    "https://picsum.photos/seed/user4/200",
    "https://picsum.photos/seed/user5/200",
    "https://picsum.photos/seed/user6/200",
  ];
  
  const handleSaveProfile = () => {
    setEditing(false);
    // In a real app, this would save the profile
    console.log("Saved profile:", { username, email });
    toast.success("Profile updated successfully");
  };
  
  const handleChangeAvatar = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarDialog(false);
    toast.success("Profile picture updated");
  };
  
  const handleBackButton = () => {
    navigate(-1); // Go back to the previous page
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn">
      <AppHeader 
        title="Profile Settings" 
        showBackButton={true} 
        onBackClick={handleBackButton}
        showSearch={false}
        showSettings={false}
        showFilter={false}
      />
      
      <main className="container px-4 py-6 space-y-8">
        {/* User Info Section */}
        <section className="flex flex-col items-center animate-slideDown">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedAvatar} alt="User" />
              <AvatarFallback>
                <User className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <button 
              className="absolute bottom-0 right-0 bg-accent rounded-full p-1.5 text-white"
              onClick={() => setShowAvatarDialog(true)}
            >
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
            onClick={() => toast.success("Logged out successfully")}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log Out</span>
          </Button>
        </section>
      </main>
      
      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Profile Picture</DialogTitle>
            <DialogDescription>
              Select a new profile picture from the options below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-full overflow-hidden border-2 ${
                    selectedAvatar === avatar ? 'border-accent' : 'border-transparent'
                  }`}
                  onClick={() => handleChangeAvatar(avatar)}
                >
                  <img src={avatar} alt={`Avatar option ${index + 1}`} className="w-full h-auto aspect-square object-cover" />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
