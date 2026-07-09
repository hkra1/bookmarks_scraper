# Setup Guide

## Prerequisites

### All Languages
- Git
- Text editor or IDE of your choice

### TypeScript/Node.js
- Node.js 16+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Optional: nvm for Node version management

### Go
- Go 1.21+ ([Download](https://golang.org/dl/))
- Optional: Air for hot reloading during development

### Python
- Python 3.9+ ([Download](https://www.python.org/))
- pip (comes with Python)
- Optional: pyenv for Python version management
- Optional: Poetry for dependency management

### Rust
- Rust 1.70+ ([Download](https://rustup.rs/))
- Cargo (comes with Rust)
- Optional: cargo-watch for recompilation on file changes

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hkra1/bookmarks_scraper.git
cd bookmarks_scraper
```

### 2. Create API Credentials

You'll need credentials for the platforms you want to scrape:

#### X (Twitter)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/)
2. Create a new project and app
3. Generate API keys and Bearer token
4. Note: Bookmarks are available via Twitter API v2

#### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Get OAuth 2.0 credentials or use official API
4. Note: LinkedIn has strict API access policies

#### GitHub
1. Go to [GitHub Settings > Developer settings](https://github.com/settings/tokens)
2. Create a Personal Access Token
3. Select `read:user` and `public_repo` scopes
4. Copy the token

### 3. Setup Each Language Implementation

#### TypeScript/Node.js

```bash
cd typescript

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your editor

# Install development dependencies
npm install --save-dev

# Run tests
npm test

# Start development
npm run dev
```

**Useful Commands**:
```bash
npm run build     # Build for production
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
npm run type-check # Run TypeScript type checking
```

#### Go

```bash
cd go

# Initialize Go module (if needed)
go mod init github.com/hkra1/bookmarks_scraper/go
go mod tidy

# Create config directory
mkdir -p config
cp config/config.example.yaml config/config.yaml

# Edit config with your credentials

# Run tests
go test ./...

# Run the application
go run cmd/main.go
```

**Useful Commands**:
```bash
go build -o bin/scraper cmd/main.go    # Build binary
go fmt ./...                             # Format code
go vet ./...                             # Lint code
go test -v ./...                         # Verbose testing
```

#### Python

```bash
cd python

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your credentials

# Run tests
pytest

# Run the application
python src/main.py
```

**Useful Commands**:
```bash
pip install -e .                # Install in development mode
pip install -r requirements-dev.txt  # Install dev dependencies
black src/                       # Format code
flake8 src/                      # Lint code
mypy src/                        # Type checking
```

#### Rust

```bash
cd rust

# Build the project
cargo build

# Create config directory
mkdir -p config
cp config/config.example.toml config/config.toml

# Edit config with your credentials

# Run tests
cargo test

# Run the application
cargo run

# Release build
cargo build --release
```

**Useful Commands**:
```bash
cargo check              # Quick syntax check
cargo fmt               # Format code
cargo clippy            # Lint code
cargo test -- --nocapture  # Show println! output
cargo doc --open        # Generate and open documentation
```

## Environment Variables

Create a `.env` file in each language directory:

```env
# Twitter API
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# LinkedIn
LINKEDIN_EMAIL=your_email
LINKEDIN_PASSWORD=your_password
# OR
LINKEDIN_TOKEN=your_token

# GitHub
GITHUB_TOKEN=your_github_token

# Obsidian
OBSIDIAN_VAULT_PATH=/path/to/your/obsidian/vault
OBSIDIAN_OUTPUT_DIR=bookmarks

# Logging
LOG_LEVEL=info
```

## Testing Setup

Each implementation includes tests. Run them to verify setup:

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

## First Run

After setup, try a simple test run:

```bash
# TypeScript
cd typescript
npm run dev  # Should show CLI and available commands

# Go
cd go
go run cmd/main.go  # Should show help

# Python
cd python
python src/main.py  # Should show help

# Rust
cd rust
cargo run  # Should show help
```

Each should display a help message with available commands.

## Troubleshooting

### Node.js Issues

**Problem**: `npm install` fails
- **Solution**: Clear npm cache: `npm cache clean --force`

**Problem**: Module not found
- **Solution**: Delete node_modules and package-lock.json, reinstall: `rm -rf node_modules package-lock.json && npm install`

### Go Issues

**Problem**: `go mod tidy` fails
- **Solution**: Initialize module: `go mod init github.com/hkra1/bookmarks_scraper/go`

**Problem**: Import errors
- **Solution**: Run `go get -u` to update dependencies

### Python Issues

**Problem**: `pip install` fails
- **Solution**: Upgrade pip: `pip install --upgrade pip`

**Problem**: Virtual environment not activating
- **Solution**: Ensure you created it: `python -m venv venv`

### Rust Issues

**Problem**: `cargo build` fails
- **Solution**: Update Rust: `rustup update`

**Problem**: Compilation errors
- **Solution**: Check Rust version: `rustc --version`

## Next Steps

1. Read the `ARCHITECTURE.md` for system design
2. Explore the language-specific documentation:
   - `typescript/docs/TYPESCRIPT.md`
   - `go/docs/GO.md`
   - `python/docs/PYTHON.md`
   - `rust/docs/RUST.md`
3. Start with scraping bookmarks from one platform
4. Experiment with different export formats

## Additional Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs/)
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/)
- [GitHub API](https://docs.github.com/en/rest)
- [Obsidian Vault Format](https://help.obsidian.md/)
