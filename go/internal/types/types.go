package types

import "time"

// Bookmark represents a unified bookmark from any platform
type Bookmark struct {
	ID          string                 `json:"id"`
	Title       string                 `json:"title"`
	URL         string                 `json:"url"`
	Description string                 `json:"description,omitempty"`
	Platform    string                 `json:"platform"`
	Tags        []string               `json:"tags"`
	SavedAt     time.Time              `json:"saved_at"`
	Source      string                 `json:"source"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// FetchOptions specifies options for fetching bookmarks
type FetchOptions struct {
	Limit  int
	Since  *time.Time
	Tags   []string
	Offset int
}

// ExportOptions specifies options for exporting bookmarks
type ExportOptions struct {
	OutputPath string
	GroupBy    string // "platform", "tag", or "date"
	Format     string // "markdown", "json", etc.
}
