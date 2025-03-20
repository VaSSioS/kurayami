
/**
 * Utility function to parse HTML using DOM parser
 * @param html HTML string to parse
 * @returns Document object
 */
export const parseHTML = (html: string): Document => {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
};

/**
 * Extract elements using querySelector/querySelectorAll
 * @param document Document to query
 * @param selector CSS selector
 * @param all Whether to return all matches or just the first one
 * @returns Element(s) matching the selector
 */
export const querySelectorElements = (document: Document, selector: string, all = false): Element[] | Element | null => {
  if (all) {
    const elements = document.querySelectorAll(selector);
    return elements.length > 0 ? Array.from(elements) : [];
  } else {
    return document.querySelector(selector);
  }
};

/**
 * Extract manga information from a document using selectors
 * @param document Document to parse
 * @param selectors Object containing CSS selectors for different manga properties
 * @returns Array of manga objects
 */
export const extractMangaList = (document: Document, selectors: {
  container: string;
  title: string;
  cover: string;
  url: string;
}): Array<{
  title: string;
  coverImage: string;
  url: string;
}> => {
  const containers = document.querySelectorAll(selectors.container);
  if (!containers || containers.length === 0) {
    console.error('No manga containers found');
    return [];
  }

  const mangaList = [];
  
  for (const container of Array.from(containers)) {
    try {
      const titleElement = container.querySelector(selectors.title);
      const coverElement = container.querySelector(selectors.cover) as HTMLImageElement;
      const urlElement = container.querySelector(selectors.url) as HTMLAnchorElement;
      
      if (!titleElement || !coverElement || !urlElement) {
        console.warn('Skipping manga: Missing required elements');
        continue;
      }
      
      const title = titleElement.textContent?.trim() || '';
      const coverImage = coverElement.src || coverElement.getAttribute('data-src') || '';
      const url = urlElement.href || urlElement.getAttribute('href') || '';
      
      if (!title || !url) {
        console.warn('Skipping manga: Missing title or URL');
        continue;
      }
      
      mangaList.push({
        title,
        coverImage: coverImage.startsWith('http') ? coverImage : `https:${coverImage}`,
        url: url.startsWith('http') ? url : `https://mangadex.org${url.startsWith('/') ? url : `/${url}`}`,
      });
    } catch (error) {
      console.error('Error extracting manga data:', error);
    }
  }

  return mangaList;
};

/**
 * Extract manga details from a document
 * @param document Document to parse
 * @param selectors Object containing CSS selectors for different manga details
 * @returns Manga details object
 */
export const extractMangaDetails = (document: Document, selectors: {
  title: string;
  cover: string;
  description: string;
  author: string;
  status: string;
  genres: string;
  chapters: string;
}): {
  title: string;
  coverImage: string;
  description: string;
  author: string;
  status: string;
  genres: string[];
  chapters: Array<{
    id: string;
    number: number;
    title: string;
    url: string;
    releaseDate: string;
  }>;
} => {
  try {
    const title = document.querySelector(selectors.title)?.textContent?.trim() || '';
    const coverElement = document.querySelector(selectors.cover) as HTMLImageElement;
    const coverImage = coverElement?.src || coverElement?.getAttribute('data-src') || '';
    const description = document.querySelector(selectors.description)?.textContent?.trim() || '';
    const author = document.querySelector(selectors.author)?.textContent?.trim() || '';
    const status = document.querySelector(selectors.status)?.textContent?.trim() || '';
    
    // Extract genres
    const genreElements = document.querySelectorAll(selectors.genres);
    const genres = Array.from(genreElements).map(el => el.textContent?.trim() || '').filter(Boolean);
    
    // Extract chapters
    const chapterElements = document.querySelectorAll(selectors.chapters);
    const chapters = Array.from(chapterElements).map((el, index) => {
      const chapterLink = el.querySelector('a') as HTMLAnchorElement;
      const chapterNumber = index + 1; // Fallback numbering
      const chapterTitle = chapterLink?.textContent?.trim() || `Chapter ${chapterNumber}`;
      const chapterUrl = chapterLink?.href || chapterLink?.getAttribute('href') || '';
      const releaseDateElement = el.querySelector('time') || el.querySelector('.date');
      const releaseDate = releaseDateElement?.textContent?.trim() || new Date().toISOString();
      
      return {
        id: `ch${chapterNumber}`,
        number: chapterNumber,
        title: chapterTitle,
        url: chapterUrl.startsWith('http') ? chapterUrl : `https://mangadex.org${chapterUrl.startsWith('/') ? chapterUrl : `/${chapterUrl}`}`,
        releaseDate
      };
    });
    
    return {
      title,
      coverImage: coverImage.startsWith('http') ? coverImage : `https:${coverImage}`,
      description,
      author,
      status,
      genres,
      chapters
    };
  } catch (error) {
    console.error('Error extracting manga details:', error);
    throw error;
  }
};
