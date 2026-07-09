# Bookmarks Scraper Architecture

## Overview

The bookmarks scraper follows a modular, plugin-based architecture that allows for easy addition of new platforms while maintaining consistency across languages.

## Core Concepts

### 1. Bookmark Data Model

All platforms are normalized to a common `Bookmark` structure:

```
Bookmark {
  id: string              // Unique identifier from platform
  title: string           // Bookmark title
  url: string             // Target URL
  description: string     // Optional description/annotation
  platform: string        // Source platform (twitter, linkedin, github, etc.)
  tags: string[]          // User-defined tags
  savedAt: datetime       // When the bookmark was saved
  source: string          // Original post/content URL
  metadata: object        // Platform-specific metadata
}
```

### 2. Scraper Interface

Each platform implements a scraper with this contract:

```
Scraper {
  authenticate(credentials): Promise<void>
  fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]>
  disconnect(): Promise<void>
}
```

**FetchOptions**:
- `limit`: Maximum number of bookmarks to fetch
- `since`: Fetch bookmarks after this date
- `tags`: Filter by specific tags
- `offset`: Pagination offset

### 3. Exporter Interface

Exporters convert bookmarks to target formats:

```
Exporter {
  export(bookmarks: Bookmark[], options?: ExportOptions): Promise<void>
  validate(bookmarks: Bookmark[]): boolean
}
```

**ExportOptions**:
- `outputPath`: Where to write files
- `groupBy`: Group bookmarks by platform, tag, or date
- `format`: Output format (markdown, json, etc.)

### 4. Configuration Management

Configuration is hierarchical:

1. **Default config** in code
2. **Config files** (yaml/json)
3. **Environment variables** (highest priority)

## Platform Implementations

### X (Twitter)

**API Method**: Twitter API v2
**Auth**: Bearer token (API key + secret)
**Limitations**: API tier limits apply

**Data Extraction**:
- Bookmarks stored in Twitter's native bookmark feature
- Metadata: likes, retweets, author info

### LinkedIn

**API Method**: LinkedIn REST API
**Auth**: OAuth 2.0 or LinkedIn token
**Limitations**: Mobile-only scraping due to API restrictions

**Data Extraction**:
- Saved posts/articles from user's "My Items"
- Metadata: author, company, engagement metrics

### GitHub

**API Method**: GitHub REST API v3 / GraphQL
**Auth**: Personal access token
**Data**: No native bookmarks, custom solution

**Data Extraction**:
- Starred repositories (as bookmarks)
- Saved gists and discussions
- Metadata: stars, language, description

## Data Flow

```
┌────────────────────────────────────┐
│   Config Manager    │
│  (Load credentials) │
└────────────────────┬────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│   Scraper Factory   │
│  (Initialize)       │
└────────────────────┬────────────────┘
           │
      ┌─────────┬──────────┬────────────┬────────────┐
      ▼         ▼        ▼        ▼
   Twitter  LinkedIn  GitHub   [Future]
   Scraper  Scraper   Scraper  Scrapers
      │         │        │        │
      └─────┬───┴────┬───┴────┬───┘
           ▼         ▼        ▼
      ┌──────────────────────────────────────────────┐
      │  Bookmark Aggregator     │
      │  (Normalize & dedupe)    │
      └──────────────────────┬───────────────────────┘
                   │
                   ▼
      ┌──────────────────────────────────────────────┐
      │   Exporter Factory       │
      │  (Select export format)  │
      └──────────────────────┬───────────────────────┘
                   │
      ┌─────────────────────┬────────────────────────┐
      ▼                     ▼
   Obsidian                 [Future]
   Exporter                 Exporters
      │
      ▼
   Obsidian Vault
   (.md files)
```

## Extension Points

### Adding a New Platform

1. Create scraper implementation (extends `BaseScraper`)
2. Implement `authenticate()` and `fetchBookmarks()`
3. Register in `ScraperFactory`
4. Add configuration schema
5. Add tests

### Adding a New Export Format

1. Create exporter implementation (extends `BaseExporter`)
2. Implement `export()` method
3. Register in `ExporterFactory`
4. Add format-specific options
5. Add tests

## Error Handling

Common error scenarios:

1. **Authentication Errors**
   - Invalid credentials
   - Token expiration
   - Rate limiting

2. **Network Errors**
   - Connection timeout
   - HTTP errors (4xx, 5xx)
   - DNS resolution failures

3. **Data Errors**
   - Malformed responses
   - Missing required fields
   - Invalid bookmark data

4. **Filesystem Errors**
   - Permission denied
   - Disk space full
   - Invalid paths

## Security Considerations

1. **Credential Management**
   - Never hardcode credentials
   - Use environment variables or secure vaults
   - Rotate tokens regularly

2. **Rate Limiting**
   - Implement exponential backoff
   - Respect API rate limits
   - Cache results locally

3. **Data Privacy**
   - Don't store raw API responses unnecessarily
   - Encrypt sensitive metadata
   - Clear temporary files

4. **SSL/TLS**
   - Verify certificates
   - Use HTTPS for all requests
   - Pin certificates if needed

## Testing Strategy

1. **Unit Tests**: Individual scrapers and exporters
2. **Integration Tests**: Full pipeline with mock data
3. **E2E Tests**: Against real APIs (with test accounts)
4. **Mock Servers**: For testing error scenarios

## Language-Specific Patterns

Each language implementation follows its idioms while maintaining the same architecture:

- **TypeScript/JS**: Async/await, interfaces, decorators
- **Go**: Interfaces, goroutines, error returns
- **Python**: Abstract base classes, async context managers
- **Rust**: Traits, async/await, Result types
