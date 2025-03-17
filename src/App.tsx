
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/manga/:id" element={<HomePage />} /> {/* Placeholder */}
          <Route path="/manga/:id/chapter/:chapterId" element={<HomePage />} /> {/* Placeholder */}
          <Route path="/collections/:id" element={<HomePage />} /> {/* Placeholder */}
          <Route path="/continue-reading" element={<HomePage />} /> {/* Placeholder */}
          <Route path="/downloads" element={<HomePage />} /> {/* Placeholder */}
          <Route path="/reading-history" element={<ProfilePage />} /> {/* Placeholder */}
          <Route path="/account-settings" element={<ProfilePage />} /> {/* Placeholder */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
