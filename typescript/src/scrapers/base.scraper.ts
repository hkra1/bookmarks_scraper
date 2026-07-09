import { IScraper } from '../types/index.js';
import { Bookmark, FetchOptions } from '../types/index.js';

/**
 * Abstract base class for platform scrapers
 */
export abstract class BaseScraper implements IScraper {
  protected isAuthenticated = false;
  protected platform: 'twitter' | 'linkedin' | 'github' | string = 'unknown';

  abstract authenticate(credentials: Record<string, unknown>): Promise<void>;

  abstract fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]>;

  abstract disconnect(): Promise<void>;

  /**
   * Check if scraper is authenticated
   */
  protected checkAuthenticated(): void {
    if (!this.isAuthenticated) {
      throw new Error(`${this.platform} scraper not authenticated. Call authenticate() first.`);
    }
  }

  /**
   * Common logging method
   */
  protected log(message: string): void {
    console.log(`[${this.platform.toUpperCase()}] ${message}`);
  }

  /**
   * Common error logging method
   */
  protected error(message: string, err?: Error): void {
    console.error(`[${this.platform.toUpperCase()}] ERROR: ${message}`, err);
  }
}
