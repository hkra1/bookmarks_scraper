import { Bookmark, FetchOptions } from './bookmark.js';

/**
 * Base interface for all platform scrapers
 */
export interface IScraper {
  /**
   * Authenticate with the platform
   * @param credentials Platform-specific credentials
   */
  authenticate(credentials: Record<string, unknown>): Promise<void>;

  /**
   * Fetch bookmarks from the platform
   * @param options Fetch options (limit, since, tags, offset)
   */
  fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]>;

  /**
   * Cleanup and disconnect from the platform
   */
  disconnect(): Promise<void>;
}
