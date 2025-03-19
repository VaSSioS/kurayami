
import React, { useState, useEffect } from "react";
import { Search, Plus, MoreVertical, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AppHeader from "@/components/ui-components/AppHeader";
import BottomNavigation from "@/components/ui-components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Source interface
interface Source {
  id: string;
  name: string;
  domain: string;
  icon?: string;
}

const SourcesPage = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<Source[]>(() => {
    // Get sources from localStorage or use default
    const storedSources = localStorage.getItem("sources");
    return storedSources ? JSON.parse(storedSources) : [
      { id: "1", name: "MangaDex", domain: "mangadex.org", icon: "https://mangadex.org/favicon.ico" },
      { id: "2", name: "Manga Plus", domain: "mangaplus.shueisha.co.jp", icon: "https://mangaplus.shueisha.co.jp/favicon.ico" },
    ];
  });
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [showEditDomainDialog, setShowEditDomainDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [editName, setEditName] = useState("");
  const [editDomain, setEditDomain] = useState("");
  
  // Save sources to localStorage when they change
  useEffect(() => {
    localStorage.setItem("sources", JSON.stringify(sources));
  }, [sources]);
  
  const handleAddSource = () => {
    if (!newDomain) {
      toast.error("Please enter a domain");
      return;
    }
    
    setIsProcessing(true);
    
    // Extract domain name for the default name
    let domain = newDomain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    
    // Simulate API call/scraping process
    setTimeout(() => {
      const id = Date.now().toString();
      
      // Format domain name for the default name
      let name = domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];
      
      const newSource: Source = {
        id,
        name,
        domain,
      };
      
      setSources(prev => [...prev, newSource]);
      setNewDomain("");
      setShowAddDialog(false);
      setIsProcessing(false);
      toast.success("Source added successfully");
    }, 1500);
  };
  
  const handleEditName = () => {
    if (!selectedSource || !editName) return;
    
    setSources(sources.map(source => 
      source.id === selectedSource.id ? { ...source, name: editName } : source
    ));
    
    setShowEditNameDialog(false);
    setSelectedSource(null);
    setEditName("");
    toast.success("Source name updated");
  };
  
  const handleEditDomain = () => {
    if (!selectedSource || !editDomain) return;
    
    setIsProcessing(true);
    
    // Simulate API call/scraping process for the new domain
    setTimeout(() => {
      setSources(sources.map(source => 
        source.id === selectedSource.id ? { ...source, domain: editDomain } : source
      ));
      
      setShowEditDomainDialog(false);
      setSelectedSource(null);
      setEditDomain("");
      setIsProcessing(false);
      toast.success("Source domain updated");
    }, 1500);
  };
  
  const handleDeleteSource = (source: Source) => {
    setSources(sources.filter(s => s.id !== source.id));
    toast.success("Source deleted");
  };
  
  const openEditNameDialog = (source: Source) => {
    setSelectedSource(source);
    setEditName(source.name);
    setShowEditNameDialog(true);
  };
  
  const openEditDomainDialog = (source: Source) => {
    setSelectedSource(source);
    setEditDomain(source.domain);
    setShowEditDomainDialog(true);
  };
  
  const handleOpenSource = (source: Source) => {
    // Navigate to source manga list page
    navigate(`/sources/${source.id}`);
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fadeIn bg-background">
      <AppHeader 
        title="Sources" 
        showBackButton={false}
        showSettings={false}
        rightElement={
          <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
        rightElement2={
          <Link to="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      
      <main className="container px-4 py-6 space-y-6">
        <div className="animate-slideDown space-y-4">
          {sources.length > 0 ? (
            sources.map((source) => (
              <div 
                key={source.id}
                className="p-4 bg-card border border-border rounded-lg flex items-center justify-between"
              >
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => handleOpenSource(source)}
                >
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {source.icon ? (
                      <img src={source.icon} alt={source.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-lg font-bold">
                        {source.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{source.domain}</span>
                      <a 
                        href={`https://${source.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditNameDialog(source)}>
                      Change Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDomainDialog(source)}>
                      Change Domain
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteSource(source)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No sources added yet</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Add New Source Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Source</DialogTitle>
            <DialogDescription>
              Enter the domain of the website to add as a new source
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAddSource} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Add Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Name Dialog */}
      <Dialog open={showEditNameDialog} onOpenChange={setShowEditNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Source Name</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Source Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditName}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Domain Dialog */}
      <Dialog open={showEditDomainDialog} onOpenChange={setShowEditDomainDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Source Domain</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="example.com"
              value={editDomain}
              onChange={(e) => setEditDomain(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDomainDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleEditDomain} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default SourcesPage;
