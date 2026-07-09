/**
 * Unified bookmark data structure used across all platforms
 */
export interface Bookmark {
  id: string; // Unique identifier from platform
  title: string; // Bookmark title
  url: string; // Target URL
  description?: string; // Optional description/annotation
  platform: 'twitter' | 'linkedin' | 'github'; // Source platform
  tags: string[]; // User-defined tags
  savedAt: Date; // When the bookmark was saved
  source: string; // Original post/content URL
  metadata?: Record<string, unknown>; // Platform-specific metadata
}

/**
 * Options for fetching bookmarks
 */
export interface FetchOptions {
  limit?: number; // Maximum number of bookmarks to fetch
  since?: Date; // Fetch bookmarks after this date
  tags?: string[]; // Filter by specific tags
  offset?: number; // Pagination offset
}

/**
 * Options for exporting bookmarks
 */
export interface ExportOptions {
  outputPath: string; // Where to write files
  groupBy?: 'platform' | 'tag' | 'date'; // Group bookmarks by
  format?: 'markdown' | 'json' | 'yaml'; // Output format
}
