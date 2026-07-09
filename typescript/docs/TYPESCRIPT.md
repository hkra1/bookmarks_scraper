# TypeScript/Node.js Implementation

## Overview

This is the TypeScript/Node.js implementation of the bookmarks scraper. It uses modern ES modules, async/await, and Zod for runtime validation.

## Key Technologies

- **Language**: TypeScript 5.2+
- **Runtime**: Node.js 16+
- **HTTP Client**: Axios
- **Validation**: Zod
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

## Project Structure

```
typescript/
├── src/
│   ├── types/           # TypeScript interfaces and types
│   ├── models/          # Data models (Bookmark)
│   ├── scrapers/        # Platform-specific scrapers
│   ├── exporters/       # Export format handlers
│   ├── config/          # Configuration management
│   └── main.ts          # Entry point
├── tests/               # Test files
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── docs/                # Documentation
```

## Setup

```bash
cd typescript
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Architecture Patterns

### Interfaces (Duck Typing)

All scrapers implement `IScraper`:

```typescript
interface IScraper {
  authenticate(credentials: Record<string, unknown>): Promise<void>;
  fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]>;
  disconnect(): Promise<void>;
}
```

### Abstract Base Classes

Common functionality in `BaseScraper`:

```typescript
export abstract class BaseScraper implements IScraper {
  protected isAuthenticated = false;
  protected platform: string;
  // ... common methods
}
```

### Runtime Validation with Zod

Bookmarks are validated at runtime:

```typescript
const BookmarkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  // ...
});

const bookmark = BookmarkSchema.parse(data);
```

## Error Handling

Consistent error handling across scrapers:

```typescript
try {
  await scraper.fetchBookmarks();
} catch (err) {
  const error = err as Error;
  console.error('Error:', error.message);
}
```

## Adding a New Platform

1. Create a new file in `src/scrapers/`: `myplatform.scraper.ts`
2. Extend `BaseScraper`
3. Implement required methods
4. Export from `src/scrapers/index.ts`

```typescript
export class MyPlatformScraper extends BaseScraper {
  async authenticate(credentials: Record<string, unknown>): Promise<void> {
    // Implementation
  }

  async fetchBookmarks(options?: FetchOptions): Promise<Bookmark[]> {
    // Implementation
  }

  async disconnect(): Promise<void> {
    // Implementation
  }
}
```

## Testing

Use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest';
import { BookmarkModel } from '../src/models/bookmark.model';

describe('BookmarkModel', () => {
  it('should create a valid bookmark', () => {
    const bookmark = BookmarkModel.create({
      title: 'Test',
      url: 'https://example.com',
      platform: 'github',
    });
    expect(bookmark.id).toBeDefined();
  });
});
```

## Best Practices

1. **Type Safety**: Use strict TypeScript settings
2. **Async/Await**: Never mix callbacks and promises
3. **Error Handling**: Always handle errors explicitly
4. **Validation**: Validate all external data
5. **Logging**: Use consistent logging format
6. **Documentation**: Document public APIs
7. **Testing**: Write tests for business logic

## Performance Considerations

- Use `limit` and `offset` for pagination
- Cache results locally to avoid repeated API calls
- Implement exponential backoff for rate limiting
- Use streams for large file operations

## Dependencies

Key dependencies and their purposes:

- **axios**: HTTP client for API requests
- **dotenv**: Load environment variables
- **zod**: Runtime data validation
- **vitest**: Fast unit testing framework
- **eslint**: Code linting
- **prettier**: Code formatting
- **typescript**: Type safety

## Troubleshooting

### Module Resolution Errors

Ensure `package.json` has `"type": "module"` for ES modules.

### Type Errors

Run `npm run type-check` to verify types.

### Import Issues

Always include `.js` extension in imports when using ES modules:

```typescript
import { BaseScraper } from './base.scraper.js';
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Vitest Documentation](https://vitest.dev/)
