
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import MangaDetailsPage from "./pages/MangaDetailsPage";
import ChapterReadingPage from "./pages/ChapterReadingPage";
import DownloadsPage from "./pages/DownloadsPage";
import FilterPage from "./pages/FilterPage";
import SourcesPage from "./pages/SourcesPage";
import NotFound from "./pages/NotFound";
import SourceMangaListPage from "./pages/SourceMangaListPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/manga/:id" element={<MangaDetailsPage />} />
            <Route path="/manga/:id/chapter/:chapterId" element={<ChapterReadingPage />} />
            <Route path="/collections/:id" element={<HomePage />} /> {/* Placeholder */}
            <Route path="/continue-reading" element={<HistoryPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/filter" element={<FilterPage />} />
            <Route path="/reading-history" element={<HistoryPage />} />
            <Route path="/account-settings" element={<ProfilePage />} />
            <Route path="/sources/:sourceId" element={<SourceMangaListPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
