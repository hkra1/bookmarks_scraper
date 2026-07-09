import { BaseScraper } from './base.scraper.js';
import { Bookmark, FetchOptions } from '../types/index.js';
import axios from 'axios';

interface GitHubCredentials {
  token: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string;
  stargazers_count?: number;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * GitHub bookmark scraper (starred repositories)
 */
export class GitHubScraper extends BaseScraper {
  private token: string = '';
  private username: string = '';
  private readonly API_BASE = 'https://api.github.com';

  constructor() {
    super();
    this.platform = 'github';
  }

  async authenticate(credentials: Record<string, unknown>): Promise<void> {
    const creds = credentials as GitHubCredentials;

    if (!creds.token) {
      throw new Error('GitHub token is required');
    }

    this.token = creds.token;

    try {
      // Get authenticated user
      const response = await this.makeRequest('/user');
      this.username = (response as { login: string }).login;
      this.isAuthenticated = true;
      this.log(`Authentication successful as ${this.username}`);
    } catch (err) {
      this.error('Authentication failed', err as Error);
      throw err;
    }
  }

  async fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]> {
    this.checkAuthenticated();

    try {
      this.log(`Fetching starred repositories`);

      const limit = options?.limit || 100;
      const response = (await this.makeRequest(
        `/user/starred?per_page=${Math.min(limit, 100)}`
      )) as GitHubRepository[];

      const bookmarks: Bookmark[] = response.map((repo: GitHubRepository) => ({
        id: `github-${repo.id}`,
        title: repo.name,
        url: repo.html_url,
        description: repo.description,
        platform: 'github' as const,
        tags: repo.language ? [repo.language] : [],
        savedAt: repo.updated_at ? new Date(repo.updated_at) : new Date(),
        source: repo.html_url,
        metadata: {
          stars: repo.stargazers_count,
          language: repo.language,
          repository: repo.full_name,
        },
      }));

      this.log(`Fetched ${bookmarks.length} bookmarks`);
      return bookmarks;
    } catch (err) {
      this.error('Failed to fetch bookmarks', err as Error);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    this.token = '';
    this.username = '';
    this.isAuthenticated = false;
    this.log('Disconnected');
  }

  private async makeRequest(endpoint: string): Promise<unknown> {
    const response = await axios.get(`${this.API_BASE}${endpoint}`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  }
}
