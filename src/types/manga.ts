
export interface Manga {
  id: string;
  title: string;
  coverImage: string;
  totalChapters?: number;
  currentChapter?: number;
  author?: string;
  genres?: string[];
  description?: string;
  status?: string;
  isCompleted?: boolean;
  isFavorite?: boolean;
  sourceUrl?: string;
}
