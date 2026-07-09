# Bookmarks Scraper

A multi-language learning project to scrape bookmarks from various social media platforms (X, LinkedIn, GitHub, etc.) and export them to Obsidian format.

## 🎯 Project Goals

- Learn and practice across multiple programming languages: TypeScript/JS, Go, Python, and Rust
- Create a modular, extensible architecture for scraping bookmarks
- Support multiple platforms with easy addition of new ones
- Export bookmarks to Obsidian-compatible format

## 📁 Project Structure

```
bookmarks-scraper/
├── typescript/          # TypeScript/Node.js implementation
├── go/                  # Go implementation
├── python/              # Python implementation
├── rust/                # Rust implementation
├── docs/                # Documentation and guides
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for TypeScript)
- Go 1.21+ (for Go)
- Python 3.9+ (for Python)
- Rust 1.70+ (for Rust)

### Installation

Each language implementation is self-contained. Navigate to the respective directory and follow the setup instructions.

#### TypeScript
```bash
cd typescript
npm install
npm run dev
```

#### Go
```bash
cd go
go mod download
go run cmd/main.go
```

#### Python
```bash
cd python
pip install -r requirements.txt
python src/main.py
```

#### Rust
```bash
cd rust
cargo build --release
cargo run --release
```

## 📱 Supported Platforms

- [x] X (Twitter)
- [x] LinkedIn
- [x] GitHub
- [ ] Reddit
- [ ] Medium
- [ ] Dev.to
- [ ] HackerNews

## 🔧 Configuration

Each implementation requires authentication credentials for the platforms. See `config/` directories in each language folder for configuration examples.

```yaml
platforms:
  twitter:
    api_key: "your-api-key"
    api_secret: "your-api-secret"
  linkedin:
    email: "your-email"
    password: "your-password"
  github:
    token: "your-github-token"

obsidian:
  vault_path: "/path/to/obsidian/vault"
  output_dir: "bookmarks"
```

## 📚 Architecture

### Core Components

1. **Scraper Interface**: Common interface for all platform scrapers
2. **Bookmark Model**: Unified bookmark data structure
3. **Exporter**: Converts bookmarks to Obsidian format
4. **Config Manager**: Handles configuration and secrets

### Data Flow

```
Platform APIs → Scrapers → Bookmark Model → Exporter → Obsidian Files
```

## 🔐 Security

- Never commit API keys or credentials
- Use environment variables for sensitive data
- See `.gitignore` for excluded files

## 📖 Learning Resources

Each language folder contains:
- `docs/LANGUAGE.md`: Language-specific setup and patterns
- Example code and best practices
- Architecture decisions and rationale

## 🤝 Contributing

This is a personal learning project. Feel free to extend it with:
- New platform scrapers
- Additional export formats
- CLI improvements
- Error handling enhancements

## 📝 License

MIT

## 🛠️ Development

### Running Tests

```bash
# TypeScript
cd typescript && npm test

# Go
cd go && go test ./...

# Python
cd python && pytest

# Rust
cd rust && cargo test
```

### Code Style

Each implementation follows the language's standard conventions:
- TypeScript: ESLint + Prettier
- Go: gofmt + golint
- Python: Black + Flake8
- Rust: cargo fmt + clippy
