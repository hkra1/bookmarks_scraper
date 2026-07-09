import { BaseScraper } from './base.scraper.js';
import { Bookmark, FetchOptions } from '../types/index.js';
import axios from 'axios';

interface TwitterCredentials {
  bearerToken: string;
}

interface TwitterBookmark {
  id: string;
  text: string;
  public_metrics?: {
    like_count?: number;
    retweet_count?: number;
  };
  created_at?: string;
}

/**
 * Twitter/X bookmark scraper
 */
export class TwitterScraper extends BaseScraper {
  private bearerToken: string = '';
  private readonly API_BASE = 'https://api.twitter.com/2';

  constructor() {
    super();
    this.platform = 'twitter';
  }

  async authenticate(credentials: Record<string, unknown>): Promise<void> {
    const creds = credentials as TwitterCredentials;

    if (!creds.bearerToken) {
      throw new Error('Twitter bearer token is required');
    }

    this.bearerToken = creds.bearerToken;

    try {
      // Test authentication
      await this.makeRequest('/tweets/search/recent?query=test&max_results=10');
      this.isAuthenticated = true;
      this.log('Authentication successful');
    } catch (err) {
      this.error('Authentication failed', err as Error);
      throw err;
    }
  }

  async fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]> {
    this.checkAuthenticated();

    try {
      this.log(`Fetching bookmarks (limit: ${options?.limit || 'all'})`);

      // Note: Twitter API for bookmarks requires additional permissions
      // This is a placeholder implementation
      const bookmarks: Bookmark[] = [];

      this.log(`Fetched ${bookmarks.length} bookmarks`);
      return bookmarks;
    } catch (err) {
      this.error('Failed to fetch bookmarks', err as Error);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    this.bearerToken = '';
    this.isAuthenticated = false;
    this.log('Disconnected');
  }

  private async makeRequest(endpoint: string): Promise<unknown> {
    const response = await axios.get(`${this.API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });
    return response.data;
  }
}
