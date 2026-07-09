package scraper

import (
	"context"
	"fmt"
	"github.com/hkra1/bookmarks_scraper/go/internal/types"
)

// IScraper defines the interface for all platform scrapers
type IScraper interface {
	Authenticate(ctx context.Context, creds map[string]interface{}) error
	FetchBookmarks(ctx context.Context, opts *types.FetchOptions) ([]types.Bookmark, error)
	Disconnect(ctx context.Context) error
}

// BaseScraper provides common functionality for scrapers
type BaseScraper struct {
	IsAuthenticated bool
	Platform        string
}

// CheckAuthenticated verifies the scraper is authenticated
func (b *BaseScraper) CheckAuthenticated() error {
	if !b.IsAuthenticated {
		return fmt.Errorf("%s scraper not authenticated. Call Authenticate() first", b.Platform)
	}
	return nil
}

// Log logs a message with platform prefix
func (b *BaseScraper) Log(msg string) {
	fmt.Printf("[%s] %s\n", b.Platform, msg)
}

// Error logs an error message with platform prefix
func (b *BaseScraper) Error(msg string, err error) {
	fmt.Printf("[%s] ERROR: %s: %v\n", b.Platform, msg, err)
}
