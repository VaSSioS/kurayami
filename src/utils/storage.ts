/**
 * Utility functions for localStorage management
 */

import { Collection } from '@/types/collection';

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
    return [];
  }
};

// Sources storage
export const saveSources = (sources: any[]): void => {
  try {
    localStorage.setItem('sources', JSON.stringify(sources));
  } catch (error) {
    console.error('Error saving sources:', error);
  }
};

export const getSources = (): any[] => {
  try {
    const sources = localStorage.getItem('sources');
    return sources ? JSON.parse(sources) : [];
  } catch (error) {
    console.error('Error loading sources:', error);
    return [];
  }
};

// Manga from sources storage
export const saveMangaFromSource = (sourceId: string, mangaList: any[]): void => {
  try {
    localStorage.setItem(`source_manga_${sourceId}`, JSON.stringify(mangaList));
  } catch (error) {
    console.error('Error saving manga from source:', error);
  }
};

export const getMangaFromSource = (sourceId: string): any[] => {
  try {
    const mangaList = localStorage.getItem(`source_manga_${sourceId}`);
    return mangaList ? JSON.parse(mangaList) : [];
  } catch (error) {
    console.error('Error loading manga from source:', error);
    return [];
  }
};

// Manga details storage
export const saveMangaDetails = (mangaId: string, details: any): void => {
  try {
    localStorage.setItem(`manga_details_${mangaId}`, JSON.stringify(details));
  } catch (error) {
    console.error('Error saving manga details:', error);
  }
};

export const getMangaDetails = (mangaId: string): any | null => {
  try {
    const details = localStorage.getItem(`manga_details_${mangaId}`);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error('Error loading manga details:', error);
    return null;
  }
};

// Active collection storage
export const saveActiveCollection = (collectionId: string): void => {
  try {
    localStorage.setItem('activeCollection', collectionId);
  } catch (error) {
    console.error('Error saving active collection:', error);
  }
};

export const getActiveCollection = (): string => {
  try {
    return localStorage.getItem('activeCollection') || 'all';
  } catch (error) {
    console.error('Error loading active collection:', error);
    return 'all';
  }
};

// Downloaded chapters storage
export const saveDownloadedChapters = (mangaId: string, chapters: string[]): void => {
  try {
    localStorage.setItem(`downloadedChapters-${mangaId}`, JSON.stringify(chapters));
  } catch (error) {
    console.error('Error saving downloaded chapters:', error);
  }
};

export const getDownloadedChapters = (mangaId: string): string[] => {
  try {
    const chapters = localStorage.getItem(`downloadedChapters-${mangaId}`);
    return chapters ? JSON.parse(chapters) : [];
  } catch (error) {
    console.error('Error loading downloaded chapters:', error);
    return [];
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
  }
};
