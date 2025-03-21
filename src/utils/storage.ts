
/**
 * Utility functions for localStorage management
 */

import { Collection } from '@/types/collection';
import { toast } from 'sonner';

// Collection storage
export const saveCollections = (collections: Collection[]): void => {
  try {
    // Serialize objects with special handling for React components (like icons)
    const serializableCollections = collections.map(collection => ({
      ...collection,
      // Store icon name as a string identifier, not the component itself
      icon: collection.icon ? collection.icon.name || null : null
    }));
    
    localStorage.setItem('collections', JSON.stringify(serializableCollections));
    console.log('Collections saved successfully:', serializableCollections);
  } catch (error) {
    console.error('Error saving collections:', error);
    toast.error('Failed to save collections');
  }
};

export const getCollections = (): Collection[] => {
  try {
    const collections = localStorage.getItem('collections');
    if (!collections) return [];
    
    // Parse and restore the collections
    const parsedCollections = JSON.parse(collections);
    
    return parsedCollections.map((collection: any) => {
      return {
        ...collection,
        icon: null // All icons will be null for consistency
      };
    });
  } catch (error) {
    console.error('Error loading collections:', error);
    toast.error('Failed to load collections');
    return [];
  }
};

// Sources storage
export const saveSources = (sources: any[]): void => {
  try {
    localStorage.setItem('sources', JSON.stringify(sources));
  } catch (error) {
    console.error('Error saving sources:', error);
    toast.error('Failed to save sources');
  }
};

export const getSources = (): any[] => {
  try {
    const sources = localStorage.getItem('sources');
    return sources ? JSON.parse(sources) : [];
  } catch (error) {
    console.error('Error loading sources:', error);
    toast.error('Failed to load sources');
    return [];
  }
};

// Manga from sources storage
export const saveMangaFromSource = (sourceId: string, mangaList: any[]): void => {
  try {
    localStorage.setItem(`source_manga_${sourceId}`, JSON.stringify(mangaList));
  } catch (error) {
    console.error('Error saving manga from source:', error);
    toast.error('Failed to save manga from source');
  }
};

export const getMangaFromSource = (sourceId: string): any[] => {
  try {
    const mangaList = localStorage.getItem(`source_manga_${sourceId}`);
    return mangaList ? JSON.parse(mangaList) : [];
  } catch (error) {
    console.error('Error loading manga from source:', error);
    toast.error('Failed to load manga from source');
    return [];
  }
};

// Manga details storage
export const saveMangaDetails = (mangaId: string, details: any): void => {
  try {
    localStorage.setItem(`manga_details_${mangaId}`, JSON.stringify(details));
  } catch (error) {
    console.error('Error saving manga details:', error);
    toast.error('Failed to save manga details');
  }
};

export const getMangaDetails = (mangaId: string): any | null => {
  try {
    const details = localStorage.getItem(`manga_details_${mangaId}`);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error('Error loading manga details:', error);
    toast.error('Failed to load manga details');
    return null;
  }
};

// Active collection storage
export const saveActiveCollection = (collectionId: string): void => {
  try {
    localStorage.setItem('activeCollection', collectionId);
  } catch (error) {
    console.error('Error saving active collection:', error);
    toast.error('Failed to save active collection');
  }
};

export const getActiveCollection = (): string => {
  try {
    return localStorage.getItem('activeCollection') || 'all';
  } catch (error) {
    console.error('Error loading active collection:', error);
    toast.error('Failed to load active collection');
    return 'all';
  }
};

// Downloaded chapters storage
export const saveDownloadedChapters = (mangaId: string, chapters: string[]): void => {
  try {
    localStorage.setItem(`downloadedChapters-${mangaId}`, JSON.stringify(chapters));
  } catch (error) {
    console.error('Error saving downloaded chapters:', error);
    toast.error('Failed to save downloaded chapters');
  }
};

export const getDownloadedChapters = (mangaId: string): string[] => {
  try {
    const chapters = localStorage.getItem(`downloadedChapters-${mangaId}`);
    return chapters ? JSON.parse(chapters) : [];
  } catch (error) {
    console.error('Error loading downloaded chapters:', error);
    toast.error('Failed to load downloaded chapters');
    return [];
  }
};

// Reading history storage
export const saveReadingHistory = (history: any[]): void => {
  try {
    localStorage.setItem('readingHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving reading history:', error);
    toast.error('Failed to save reading history');
  }
};

export const getReadingHistory = (): any[] => {
  try {
    const history = localStorage.getItem('readingHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading reading history:', error);
    toast.error('Failed to load reading history');
    return [];
  }
};

// Settings storage
export const saveSettings = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  } catch (error) {
    console.error(`Error saving setting ${key}:`, error);
    toast.error(`Failed to save ${key} setting`);
  }
};

export const getSetting = (key: string, defaultValue: any): any => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // Try to parse as JSON if it's an object
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    
    // Handle boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Handle numeric values
    if (!isNaN(Number(value))) return Number(value);
    
    return value;
  } catch (error) {
    console.error(`Error loading setting ${key}:`, error);
    toast.error(`Failed to load ${key} setting`);
    return defaultValue;
  }
};

// Clear browser cache to prevent stale data
export const clearCache = (): void => {
  try {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    toast.error('Failed to clear cache');
  }
};
