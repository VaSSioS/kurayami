
export interface Manga {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  author: string;
  genres: string[];
  totalChapters: number;
  currentChapter: number;
  isCompleted: boolean;
  isInLibrary: boolean;
  isFavorite?: boolean;  // Add this property
  status?: string;
  lastRead?: Date;
}

export interface Collection {
  id: string;
  name: string;
  mangaIds: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  mangaId?: string;
  chapterId?: string;
  coverImage?: string;
  isRead: boolean;
  date: string;
}

export const mockManga: Manga[] = [
  {
    id: "1",
    title: "The Silent Voice",
    coverImage: "https://picsum.photos/seed/manga1/300/400",
    description: "A story about redemption and healing, following a boy who seeks to make amends with a girl he bullied in the past.",
    author: "Yoshitoki Oima",
    genres: ["Drama", "Romance", "Slice of Life"],
    totalChapters: 60,
    currentChapter: 32,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: true,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 5, 15),
  },
  {
    id: "2",
    title: "Demon Hunter",
    coverImage: "https://picsum.photos/seed/manga2/300/400",
    description: "A young boy who sells charcoal for a living finds his life turned upside down when his family is slaughtered by demons.",
    author: "Koyoharu Gotouge",
    genres: ["Action", "Fantasy", "Supernatural"],
    totalChapters: 120,
    currentChapter: 89,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: false,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 5, 20),
  },
  {
    id: "3",
    title: "Steel Alchemist",
    coverImage: "https://picsum.photos/seed/manga3/300/400",
    description: "Two brothers search for a philosopher's stone after an attempt to revive their dead mother goes awry.",
    author: "Hiromu Arakawa",
    genres: ["Action", "Adventure", "Fantasy"],
    totalChapters: 116,
    currentChapter: 116,
    isCompleted: true,
    isInLibrary: true,
    isFavorite: true,  // Added isFavorite property
    status: "Completed",
    lastRead: new Date(2023, 4, 10),
  },
  {
    id: "4",
    title: "Death Diary",
    coverImage: "https://picsum.photos/seed/manga4/300/400",
    description: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.",
    author: "Tsugumi Ohba",
    genres: ["Mystery", "Psychological", "Supernatural"],
    totalChapters: 108,
    currentChapter: 42,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: false,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 5, 1),
  },
  {
    id: "5",
    title: "One Strike",
    coverImage: "https://picsum.photos/seed/manga5/300/400",
    description: "A superhero who can defeat any opponent with a single punch faces an existential crisis.",
    author: "ONE",
    genres: ["Action", "Comedy", "Superhero"],
    totalChapters: 140,
    currentChapter: 98,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: true,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 5, 18),
  },
  {
    id: "6",
    title: "Attack of Giants",
    coverImage: "https://picsum.photos/seed/manga6/300/400",
    description: "In a world where humanity lives within cities surrounded by enormous walls, a young man vows to kill all Titans.",
    author: "Hajime Isayama",
    genres: ["Action", "Dark Fantasy", "Post-Apocalyptic"],
    totalChapters: 139,
    currentChapter: 72,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: false,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 4, 25),
  },
  {
    id: "7",
    title: "Hero Academia",
    coverImage: "https://picsum.photos/seed/manga7/300/400",
    description: "A boy born without superpowers in a world where they're the norm follows his dream to become a superhero.",
    author: "Kohei Horikoshi",
    genres: ["Action", "Superhero", "Fantasy"],
    totalChapters: 220,
    currentChapter: 112,
    isCompleted: false,
    isInLibrary: true,
    isFavorite: false,  // Added isFavorite property
    status: "Ongoing",
    lastRead: new Date(2023, 5, 12),
  },
  {
    id: "8",
    title: "Tokyo Ghoul",
    coverImage: "https://picsum.photos/seed/manga8/300/400",
    description: "A college student becomes a half-ghoul after a violent encounter with one, leading to a conflict between his human and ghoul sides.",
    author: "Sui Ishida",
    genres: ["Action", "Horror", "Supernatural"],
    totalChapters: 144,
    currentChapter: 144,
    isCompleted: true,
    isInLibrary: true,
    isFavorite: false,  // Added isFavorite property
    status: "Completed",
    lastRead: new Date(2023, 3, 5),
  },
];

export const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Favorites",
    mangaIds: ["1", "3", "5"],
  },
  {
    id: "2",
    name: "To Read",
    mangaIds: ["2", "6", "7"],
  },
  {
    id: "3",
    name: "Completed",
    mangaIds: ["3", "8"],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Chapter Available",
    message: "Chapter 33 of The Silent Voice is now available!",
    mangaId: "1",
    chapterId: "33",
    coverImage: "https://picsum.photos/seed/manga1/300/400",
    isRead: false,
    date: "2023-06-15T09:30:00Z",
  },
  {
    id: "2",
    title: "Continue Reading",
    message: "You haven't finished Chapter 89 of Demon Hunter. Continue reading?",
    mangaId: "2",
    chapterId: "89",
    coverImage: "https://picsum.photos/seed/manga2/300/400",
    isRead: false,
    date: "2023-06-14T18:45:00Z",
  },
  {
    id: "3",
    title: "New Manga Added",
    message: "Check out Moon Breaker, a new manga in our catalog!",
    mangaId: undefined,
    isRead: true,
    date: "2023-06-12T14:20:00Z",
  },
];

export const continueReading = mockManga
  .filter(manga => !manga.isCompleted)
  .sort(() => Math.random() - 0.5)
  .slice(0, 4);

export const getCollectionWithManga = (collectionId: string) => {
  const collection = mockCollections.find(c => c.id === collectionId);
  if (!collection) return null;
  
  const mangaInCollection = collection.mangaIds
    .map(id => mockManga.find(manga => manga.id === id))
    .filter(manga => manga !== undefined) as Manga[];
    
  return {
    ...collection,
    manga: mangaInCollection,
  };
};

export const getCollectionCovers = (collectionId: string): string[] => {
  const collection = mockCollections.find(c => c.id === collectionId);
  if (!collection) return [];
  
  return collection.mangaIds
    .map(id => {
      const manga = mockManga.find(m => m.id === id);
      return manga?.coverImage;
    })
    .filter(cover => cover !== undefined) as string[];
};
