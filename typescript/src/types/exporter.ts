import { Bookmark, ExportOptions } from './bookmark.js';

/**
 * Base interface for all exporters
 */
export interface IExporter {
  /**
   * Export bookmarks to target format
   * @param bookmarks Array of bookmarks to export
   * @param options Export options
   */
  export(bookmarks: Bookmark[], options: ExportOptions): Promise<void>;

  /**
   * Validate bookmarks before export
   * @param bookmarks Array of bookmarks to validate
   */
  validate(bookmarks: Bookmark[]): boolean;
}
