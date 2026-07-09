package exporter

import (
	"github.com/hkra1/bookmarks_scraper/go/internal/types"
)

// IExporter defines the interface for all exporters
type IExporter interface {
	Export(bookmarks []types.Bookmark, opts *types.ExportOptions) error
	Validate(bookmarks []types.Bookmark) bool
}

// BaseExporter provides common functionality for exporters
type BaseExporter struct {
	Format string
}

// Log logs a message with exporter prefix
func (b *BaseExporter) Log(msg string) {
	println("[EXPORTER:" + b.Format + "] " + msg)
}

// Error logs an error message with exporter prefix
func (b *BaseExporter) Error(msg string, err error) {
	println("[EXPORTER:" + b.Format + "] ERROR: " + msg + ": " + err.Error())
}
