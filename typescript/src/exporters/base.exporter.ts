import { IExporter } from '../types/index.js';
import { Bookmark, ExportOptions } from '../types/index.js';

/**
 * Abstract base class for exporters
 */
export abstract class BaseExporter implements IExporter {
  protected format: string = 'unknown';

  abstract export(bookmarks: Bookmark[], options: ExportOptions): Promise<void>;

  abstract validate(bookmarks: Bookmark[]): boolean;

  /**
   * Common logging method
   */
  protected log(message: string): void {
    console.log(`[EXPORTER:${this.format.toUpperCase()}] ${message}`);
  }

  /**
   * Common error logging method
   */
  protected error(message: string, err?: Error): void {
    console.error(`[EXPORTER:${this.format.toUpperCase()}] ERROR: ${message}`, err);
  }
}
