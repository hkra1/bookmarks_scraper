package main

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/hkra1/bookmarks_scraper/go/internal/config"
	"github.com/hkra1/bookmarks_scraper/go/internal/exporter"
	"github.com/hkra1/bookmarks_scraper/go/internal/scraper"
)

func main() {
	fmt.Println("🔖 Bookmarks Scraper (Go)")
	fmt.Println("==========================")
	fmt.Println()

	cfg := config.LoadConfig()
	ctx := context.Background()

	if cfg.GitHub.Token == "" {
		fmt.Println("⚠️  GitHub token not configured. Set GITHUB_TOKEN environment variable.")
		return
	}

	fmt.Println("📥 Scraping GitHub bookmarks...")

	githubScraper := scraper.NewGitHubScraper()

	if err := githubScraper.Authenticate(ctx, map[string]interface{}{
		"token": cfg.GitHub.Token,
	}); err != nil {
		fmt.Printf("❌ Authentication error: %v\n", err)
		return
	}

	bookmarks, err := githubScraper.FetchBookmarks(ctx, &scraper.FetchOptions{
		Limit: 10,
	})
	if err != nil {
		fmt.Printf("❌ Fetch error: %v\n", err)
		return
	}

	fmt.Printf("\n✓ Fetched %d bookmarks\n", len(bookmarks))

	// Validate bookmarks
	obs := exporter.NewObsidianExporter()
	if !obs.Validate(bookmarks) {
		fmt.Println("❌ Invalid bookmarks")
		return
	}
	fmt.Println("✓ All bookmarks valid")

	// Export to Obsidian
	fmt.Println("\n📤 Exporting bookmarks to Obsidian...")

	outputPath := filepath.Join(cfg.Obsidian.VaultPath, cfg.Obsidian.OutputDir)

	if err := obs.Export(bookmarks, &scraper.ExportOptions{
		OutputPath: outputPath,
		GroupBy:    "platform",
	}); err != nil {
		fmt.Printf("❌ Export error: %v\n", err)
		return
	}

	fmt.Printf("✓ Exported to %s\n", outputPath)

	if err := githubScraper.Disconnect(ctx); err != nil {
		fmt.Printf("❌ Disconnect error: %v\n", err)
	}

	fmt.Println("\n✓ Done!")
}
