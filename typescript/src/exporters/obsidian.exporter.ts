import { BaseExporter } from './base.exporter.js';
import { Bookmark, ExportOptions } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Obsidian markdown exporter
 */
export class ObsidianExporter extends BaseExporter {
  constructor() {
    super();
    this.format = 'markdown';
  }

  validate(bookmarks: Bookmark[]): boolean {
    return Array.isArray(bookmarks) && bookmarks.every((b) => this.isValidBookmark(b));
  }

  async export(bookmarks: Bookmark[], options: ExportOptions): Promise<void> {
    this.log(`Exporting ${bookmarks.length} bookmarks to ${options.outputPath}`);

    try {
      // Create output directory if it doesn't exist
      await fs.mkdir(options.outputPath, { recursive: true });

      // Group bookmarks if specified
      const groups = this.groupBookmarks(bookmarks, options.groupBy);

      // Export each group
      for (const [groupName, groupBookmarks] of Object.entries(groups)) {
        const filePath = path.join(options.outputPath, `${groupName}.md`);
        const content = this.generateMarkdown(groupBookmarks);
        await fs.writeFile(filePath, content, 'utf-8');
        this.log(`Exported ${groupBookmarks.length} bookmarks to ${filePath}`);
      }
    } catch (err) {
      this.error('Failed to export bookmarks', err as Error);
      throw err;
    }
  }

  private isValidBookmark(bookmark: Bookmark): boolean {
    return (
      bookmark.id &&
      bookmark.title &&
      bookmark.url &&
      bookmark.platform &&
      Array.isArray(bookmark.tags) &&
      bookmark.savedAt instanceof Date
    );
  }

  private groupBookmarks(
    bookmarks: Bookmark[],
    groupBy?: 'platform' | 'tag' | 'date'
  ): Record<string, Bookmark[]> {
    const groups: Record<string, Bookmark[]> = {};

    if (!groupBy) {
      return { bookmarks };
    }

    for (const bookmark of bookmarks) {
      let key: string;

      switch (groupBy) {
        case 'platform':
          key = bookmark.platform;
          break;
        case 'tag':
          // If bookmark has tags, create a group for each
          if (bookmark.tags.length > 0) {
            for (const tag of bookmark.tags) {
              if (!groups[tag]) {
                groups[tag] = [];
              }
              groups[tag].push(bookmark);
            }
            continue;
          }
          key = 'untagged';
          break;
        case 'date':
          key = bookmark.savedAt.toISOString().split('T')[0];
          break;
        default:
          key = 'bookmarks';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(bookmark);
    }

    return groups;
  }

  private generateMarkdown(bookmarks: Bookmark[]): string {
    const lines: string[] = [];

    lines.push(`# Bookmarks\n`);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Total: ${bookmarks.length}\n\n`);

    for (const bookmark of bookmarks) {
      lines.push(`## [${bookmark.title}](${bookmark.url})`);
      lines.push(`- **Platform**: ${bookmark.platform}`);
      lines.push(`- **Saved**: ${bookmark.savedAt.toISOString()}`);

      if (bookmark.description) {
        lines.push(`- **Description**: ${bookmark.description}`);
      }

      if (bookmark.tags.length > 0) {
        lines.push(`- **Tags**: ${bookmark.tags.join(', ')}`);
      }

      if (bookmark.metadata && Object.keys(bookmark.metadata).length > 0) {
        lines.push(`- **Metadata**:`);
        for (const [key, value] of Object.entries(bookmark.metadata)) {
          lines.push(`  - ${key}: ${JSON.stringify(value)}`);
        }
      }

      lines.push('');
    }

    return lines.join('\n');
  }
}
