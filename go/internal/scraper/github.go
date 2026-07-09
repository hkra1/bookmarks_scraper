package scraper

import (
	"context"
	"fmt"
	"time"

	"github.com/google/go-github/v56/github"
	"github.com/hkra1/bookmarks_scraper/go/internal/types"
	"golang.org/x/oauth2
)

// GitHubScraper handles GitHub bookmarks (starred repos)
type GitHubScraper struct {
	BaseScraper
	token    string
	username string
	client   *github.Client
}

// GitHubCredentials represents GitHub API credentials
type GitHubCredentials struct {
	Token string
}

// NewGitHubScraper creates a new GitHub scraper
func NewGitHubScraper() *GitHubScraper {
	return &GitHubScraper{
		BaseScraper: BaseScraper{
			Platform: "GITHUB",
		},
	}
}

// Authenticate authenticates with GitHub API
func (gs *GitHubScraper) Authenticate(ctx context.Context, creds map[string]interface{}) error {
	token, ok := creds["token"].(string)
	if !ok || token == "" {
		return fmt.Errorf("github token is required")
	}

	gs.token = token

	// Create OAuth2 client
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauthClient := oauth2.NewClient(ctx, tokenSource)
	gs.client = github.NewClient(oauthClient)

	// Test authentication by getting authenticated user
	user, _, err := gs.client.Users.GetAuthenticated(ctx)
	if err != nil {
		gs.Error("Authentication failed", err)
		return err
	}

	gs.username = user.GetLogin()
	gs.IsAuthenticated = true
	gs.Log(fmt.Sprintf("Authentication successful as %s", gs.username))
	return nil
}

// FetchBookmarks fetches starred repositories as bookmarks
func (gs *GitHubScraper) FetchBookmarks(ctx context.Context, opts *types.FetchOptions) ([]types.Bookmark, error) {
	if err := gs.CheckAuthenticated(); err != nil {
		return nil, err
	}

	gs.Log("Fetching starred repositories")

	var bookmarks []types.Bookmark
	limit := opts.Limit
	if limit <= 0 {
		limit = 100
	}

	// Fetch starred repos
	repos, _, err := gs.client.Activity.ListStarred(ctx, "", &github.ActivityListStarredOptions{
		ListOptions: github.ListOptions{
			PerPage: limit,
		},
	})

	if err != nil {
		gs.Error("Failed to fetch bookmarks", err)
		return nil, err
	}

	for _, repo := range repos {
		tags := []string{}
		if repo.Language != nil {
			tags = append(tags, *repo.Language)
		}

		updatedAt := repo.UpdatedAt.Time
		if updatedAt.IsZero() {
			updatedAt = time.Now()
		}

		bookmark := types.Bookmark{
			ID:          fmt.Sprintf("github-%d", repo.GetID()),
			Title:       repo.GetName(),
			URL:         repo.GetHTMLURL(),
			Description: repo.GetDescription(),
			Platform:    "github",
			Tags:        tags,
			SavedAt:     updatedAt,
			Source:      repo.GetHTMLURL(),
			Metadata: map[string]interface{}{
				"stars":       repo.GetStargazersCount(),
				"language":    repo.GetLanguage(),
				"repository": repo.GetFullName(),
			},
		}

		bookmarks = append(bookmarks, bookmark)
	}

	gs.Log(fmt.Sprintf("Fetched %d bookmarks", len(bookmarks)))
	return bookmarks, nil
}

// Disconnect disconnects from GitHub
func (gs *GitHubScraper) Disconnect(ctx context.Context) error {
	gs.token = ""
	gs.username = ""
	gs.client = nil
	gs.IsAuthenticated = false
	gs.Log("Disconnected")
	return nil
}
