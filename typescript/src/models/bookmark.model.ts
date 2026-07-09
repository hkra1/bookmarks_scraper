import { Bookmark, FetchOptions } from '../types/index.js';
import { z } from 'zod';

/**
 * Zod schema for bookmark validation
 */
const BookmarkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  platform: z.enum(['twitter', 'linkedin', 'github']),
  tags: z.array(z.string()),
  savedAt: z.date(),
  source: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Bookmark model with validation and utilities
 */
export class BookmarkModel {
  /**
   * Create and validate a bookmark
   */
  static create(data: Partial<Bookmark>): Bookmark {
    return BookmarkSchema.parse({
      id: data.id ?? `${data.platform}-${Date.now()}`,
      title: data.title ?? 'Untitled',
      url: data.url,
      description: data.description,
      platform: data.platform,
      tags: data.tags ?? [],
      savedAt: data.savedAt ?? new Date(),
      source: data.source ?? data.url,
      metadata: data.metadata,
    });
  }

  /**
   * Validate a bookmark object
   */
  static validate(bookmark: unknown): boolean {
    try {
      BookmarkSchema.parse(bookmark);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Filter bookmarks based on options
   */
  static filter(bookmarks: Bookmark[], options?: FetchOptions): Bookmark[] {
    let filtered = bookmarks;

    if (options?.since) {
      filtered = filtered.filter((b) => b.savedAt >= options.since!);
    }

    if (options?.tags && options.tags.length > 0) {
      filtered = filtered.filter((b) => options.tags!.some((tag) => b.tags.includes(tag)));
    }

    if (options?.offset) {
      filtered = filtered.slice(options.offset);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Deduplicate bookmarks by URL
   */
  static deduplicate(bookmarks: Bookmark[]): Bookmark[] {
    const seen = new Set<string>();
    return bookmarks.filter((b) => {
      if (seen.has(b.url)) {
        return false;
      }
      seen.add(b.url);
      return true;
    });
  }
}
