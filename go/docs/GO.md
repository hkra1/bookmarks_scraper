# Go Implementation

## Overview

This is the Go implementation of the bookmarks scraper. It emphasizes simplicity, performance, and idiomatic Go patterns.

## Key Features

- **Language**: Go 1.21+
- **Concurrency**: Goroutines for parallel scraping
- **HTTP**: github.com/go-resty/resty for HTTP requests
- **GitHub API**: Official google-go-github library
- **Configuration**: godotenv for environment variables

## Project Structure

```
go/
├── cmd/
│   └── main.go              # Entry point
├── internal/
│   ├── types/               # Type definitions
│   ├── scraper/             # Platform scrapers
│   ├── exporter/            # Export handlers
│   └── config/              # Configuration
├── go.mod                   # Module definition
├── go.sum                   # Dependency checksums
└── docs/
    └── GO.md                # Go-specific documentation
```

## Setup

```bash
cd go
go mod download
cp .env.example .env
# Edit .env with your credentials
go run cmd/main.go
```

## Development

### Build

```bash
go build -o bin/scraper cmd/main.go
./bin/scraper
```

### Test

```bash
go test ./...
go test -v ./...
go test -cover ./...
```

### Format & Lint

```bash
go fmt ./...
go vet ./...
golangci-lint run
```

## Architecture Patterns

### Interfaces

All scrapers implement `IScraper`:

```go
type IScraper interface {
    Authenticate(ctx context.Context, creds map[string]interface{}) error
    FetchBookmarks(ctx context.Context, opts *FetchOptions) ([]Bookmark, error)
    Disconnect(ctx context.Context) error
}
```

### Embedding

Common functionality via struct embedding:

```go
type BaseScraper struct {
    IsAuthenticated bool
    Platform string
}

type GitHubScraper struct {
    BaseScraper
    token string
}
```

### Error Handling

Go's explicit error handling:

```go
if err := scraper.Authenticate(ctx, creds); err != nil {
    return fmt.Errorf("authentication failed: %w", err)
}
```

### Context

Context for cancellation and timeouts:

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
bookmarks, err := scraper.FetchBookmarks(ctx, opts)
```

## Adding a New Platform

1. Create a new file in `internal/scraper/`: `myplatform.go`
2. Define credentials struct
3. Embed `BaseScraper`
4. Implement `IScraper` methods

```go
type MyPlatformScraper struct {
    BaseScraper
    // fields
}

func NewMyPlatformScraper() *MyPlatformScraper {
    return &MyPlatformScraper{
        BaseScraper: BaseScraper{Platform: "MYPLATFORM"},
    }
}

func (mps *MyPlatformScraper) Authenticate(ctx context.Context, creds map[string]interface{}) error {
    // Implementation
}

func (mps *MyPlatformScraper) FetchBookmarks(ctx context.Context, opts *FetchOptions) ([]Bookmark, error) {
    // Implementation
}

func (mps *MyPlatformScraper) Disconnect(ctx context.Context) error {
    // Implementation
}
```

## Best Practices

1. **Use Context**: Always pass context through function calls
2. **Error Wrapping**: Use `fmt.Errorf` with `%w` for error wrapping
3. **Package Structure**: Keep `internal/` packages private
4. **Naming**: Use package prefix for exported functions
5. **Documentation**: Every exported function should have comments
6. **Testing**: Write table-driven tests
7. **Goroutines**: Use sync.WaitGroup for synchronization

## Performance Considerations

- Use goroutines for parallel API calls
- Implement rate limiting with time.Ticker
- Cache results to avoid repeated calls
- Use sync.Pool for object reuse

## Testing

Table-driven testing pattern:

```go
func TestFetchBookmarks(t *testing.T) {
    tests := []struct {
        name    string
        token   string
        wantErr bool
    }{
        {"valid token", "token123", false},
        {"empty token", "", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```

## Dependencies

- `github.com/go-resty/resty/v2` - HTTP client
- `github.com/google/go-github/v56` - GitHub API client
- `golang.org/x/oauth2` - OAuth2 support
- `github.com/joho/godotenv` - Environment loading

## Troubleshooting

### Module not found errors

```bash
go mod tidy
go mod download
```

### GitHub authentication fails

Verify your PAT (Personal Access Token):
- Should have `repo` and `user` scopes
- Not expired
- Valid permissions

## Resources

- [Go Documentation](https://golang.org/doc/)
- [GitHub Go Client](https://github.com/google/go-github)
- [Go Best Practices](https://golang.org/doc/effective_go)
