
/**
 * Utility function to make HTTP requests
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with response data
 */
export const fetchData = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  // Set default headers
  const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  };

  // Merge provided options with defaults
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    } else if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      return text as unknown as T;
    } else {
      return await response.text() as unknown as T;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
