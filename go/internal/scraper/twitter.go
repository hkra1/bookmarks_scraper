package scraper

import (
	"context"
	"fmt"
	"github.com/go-resty/resty/v2"
	"github.com/hkra1/bookmarks_scraper/go/internal/types"
)

// TwitterScraper handles Twitter/X bookmarks
type TwitterScraper struct {
	BaseScraper
	bearerToken string
	client      *resty.Client
}

// TwitterCredentials represents Twitter API credentials
type TwitterCredentials struct {
	BearerToken string
}

// NewTwitterScraper creates a new Twitter scraper
func NewTwitterScraper() *TwitterScraper {
	return &TwitterScraper{
		BaseScraper: BaseScraper{
			Platform: "TWITTER",
		},
		client: resty.New().
			SetBaseURL("https://api.twitter.com/2").
			SetHeader("User-Agent", "BookmarksScraper/1.0"),
	}
}

// Authenticate authenticates with Twitter API
func (ts *TwitterScraper) Authenticate(ctx context.Context, creds map[string]interface{}) error {
	bearerToken, ok := creds["bearer_token"].(string)
	if !ok || bearerToken == "" {
		return fmt.Errorf("twitter bearer token is required")
	}

	ts.bearerToken = bearerToken

	// Test authentication
	resp, err := ts.client.
		R().
		SetHeader("Authorization", fmt.Sprintf("Bearer %s", ts.bearerToken)).
		SetContext(ctx).
		Get("/tweets/search/recent?query=test&max_results=10")

	if err != nil || resp.StatusCode() >= 400 {
		ts.Error("Authentication failed", err)
		return fmt.Errorf("twitter authentication failed")
	}

	ts.IsAuthenticated = true
	ts.Log("Authentication successful")
	return nil
}

// FetchBookmarks fetches bookmarks from Twitter
func (ts *TwitterScraper) FetchBookmarks(ctx context.Context, opts *types.FetchOptions) ([]types.Bookmark, error) {
	if err := ts.CheckAuthenticated(); err != nil {
		return nil, err
	}

	ts.Log(fmt.Sprintf("Fetching bookmarks (limit: %d)", opts.Limit))

	// Note: Twitter API for bookmarks requires additional permissions
	// This is a placeholder implementation
	var bookmarks []types.Bookmark

	ts.Log(fmt.Sprintf("Fetched %d bookmarks", len(bookmarks)))
	return bookmarks, nil
}

// Disconnect disconnects from Twitter
func (ts *TwitterScraper) Disconnect(ctx context.Context) error {
	ts.bearerToken = ""
	ts.IsAuthenticated = false
	ts.Log("Disconnected")
	return nil
}
