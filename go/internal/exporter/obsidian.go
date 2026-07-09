package exporter

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/hkra1/bookmarks_scraper/go/internal/types"
)

// ObsidianExporter exports bookmarks to Obsidian markdown format
type ObsidianExporter struct {
	BaseExporter
}

// NewObsidianExporter creates a new Obsidian exporter
func NewObsidianExporter() *ObsidianExporter {
	return &ObsidianExporter{
		BaseExporter: BaseExporter{Format: "markdown"},
	}
}

// Validate validates bookmarks
func (oe *ObsidianExporter) Validate(bookmarks []types.Bookmark) bool {
	for _, b := range bookmarks {
		if b.ID == "" || b.Title == "" || b.URL == "" || b.Platform == "" {
			return false
		}
	}
	return true
}

// Export exports bookmarks to Obsidian format
func (oe *ObsidianExporter) Export(bookmarks []types.Bookmark, opts *types.ExportOptions) error {
	oe.Log(fmt.Sprintf("Exporting %d bookmarks to %s", len(bookmarks), opts.OutputPath))

	// Create output directory
	if err := os.MkdirAll(opts.OutputPath, 0755); err != nil {
		oe.Error("Failed to create output directory", err)
		return err
	}

	// Group bookmarks
	groups := oe.groupBookmarks(bookmarks, opts.GroupBy)

	// Export each group
	for groupName, groupBookmarks := range groups {
		filePath := filepath.Join(opts.OutputPath, groupName+".md")
		content := oe.generateMarkdown(groupBookmarks)

		if err := os.WriteFile(filePath, []byte(content), 0644); err != nil {
			oe.Error(fmt.Sprintf("Failed to write file %s", filePath), err)
			return err
		}

		oe.Log(fmt.Sprintf("Exported %d bookmarks to %s", len(groupBookmarks), filePath))
	}

	return nil
}

func (oe *ObsidianExporter) groupBookmarks(bookmarks []types.Bookmark, groupBy string) map[string][]types.Bookmark {
	groups := make(map[string][]types.Bookmark)

	if groupBy == "" {
		groups["bookmarks"] = bookmarks
		return groups
	}

	for _, bookmark := range bookmarks {
		var key string

		switch groupBy {
		case "platform":
			key = bookmark.Platform
		case "tag":
			if len(bookmark.Tags) > 0 {
				for _, tag := range bookmark.Tags {
					groups[tag] = append(groups[tag], bookmark)
				}
				continue
			}
			key = "untagged"
		case "date":
			key = bookmark.SavedAt.Format("2006-01-02")
		default:
			key = "bookmarks"
		}

		groups[key] = append(groups[key], bookmark)
	}

	return groups
}

func (oe *ObsidianExporter) generateMarkdown(bookmarks []types.Bookmark) string {
	var content string
	content += "# Bookmarks\n\n"
	content += fmt.Sprintf("Generated: %s\n", time.Now().Format(time.RFC3339))
	content += fmt.Sprintf("Total: %d\n\n", len(bookmarks))

	for _, bookmark := range bookmarks {
		content += fmt.Sprintf("## [%s](%s)\n", bookmark.Title, bookmark.URL)
		content += fmt.Sprintf("- **Platform**: %s\n", bookmark.Platform)
		content += fmt.Sprintf("- **Saved**: %s\n", bookmark.SavedAt.Format(time.RFC3339))

		if bookmark.Description != "" {
			content += fmt.Sprintf("- **Description**: %s\n", bookmark.Description)
		}

		if len(bookmark.Tags) > 0 {
			tags := ""
			for _, tag := range bookmark.Tags {
				if tags != "" {
					tags += ", "
				}
				tags += tag
			}
			content += fmt.Sprintf("- **Tags**: %s\n", tags)
		}

		if len(bookmark.Metadata) > 0 {
			content += "- **Metadata**:\n"
			for key, value := range bookmark.Metadata {
				valueJSON, _ := json.Marshal(value)
				content += fmt.Sprintf("  - %s: %s\n", key, string(valueJSON))
			}
		}

		content += "\n"
	}

	return content
}
