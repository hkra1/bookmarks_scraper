import { loadConfig } from './config/config.js';
import { GitHubScraper } from './scrapers/github.scraper.js';
import { ObsidianExporter } from './exporters/obsidian.exporter.js';
import { BookmarkModel } from './models/bookmark.model.js';
import * as path from 'path';

async function main(): Promise<void> {
  console.log('🔖 Bookmarks Scraper (TypeScript)');
  console.log('==================================\n');

  const config = loadConfig();

  try {
    // Example: Scrape GitHub bookmarks
    if (config.github.token) {
      console.log('📥 Scraping GitHub bookmarks...');
      const githubScraper = new GitHubScraper();

      await githubScraper.authenticate({ token: config.github.token });
      const bookmarks = await githubScraper.fetchBookmarks({ limit: 10 });

      // Validate bookmarks
      console.log(`\n✓ Fetched ${bookmarks.length} bookmarks`);
      console.log(`✓ All bookmarks valid: ${bookmarks.every((b) => BookmarkModel.validate(b))}`);

      // Export to Obsidian
      console.log('\n📤 Exporting bookmarks to Obsidian...');
      const exporter = new ObsidianExporter();
      const outputPath = path.join(config.obsidian.vaultPath, config.obsidian.outputDir);

      if (bookmarks.length > 0 && exporter.validate(bookmarks)) {
        await exporter.export(bookmarks, {
          outputPath,
          groupBy: 'platform',
        });
        console.log(`✓ Exported to ${outputPath}`);
      }

      await githubScraper.disconnect();
    } else {
      console.log('⚠️  GitHub token not configured. Set GITHUB_TOKEN environment variable.');
    }

    console.log('\n✓ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
