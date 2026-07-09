package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration
type Config struct {
	Twitter struct {
		APIKey      string
		APISecret   string
		BearerToken string
	}
	LinkedIn struct {
		Email    string
		Password string
		Token    string
	}
	GitHub struct {
		Token string
	}
	Obsidian struct {
		VaultPath string
		OutputDir string
	}
	Logging struct {
		Level string
	}
}

// LoadConfig loads configuration from environment
func LoadConfig() *Config {
	_ = godotenv.Load()

	cfg := &Config{}

	cfg.Twitter.APIKey = os.Getenv("TWITTER_API_KEY")
	cfg.Twitter.APISecret = os.Getenv("TWITTER_API_SECRET")
	cfg.Twitter.BearerToken = os.Getenv("TWITTER_BEARER_TOKEN")

	cfg.LinkedIn.Email = os.Getenv("LINKEDIN_EMAIL")
	cfg.LinkedIn.Password = os.Getenv("LINKEDIN_PASSWORD")
	cfg.LinkedIn.Token = os.Getenv("LINKEDIN_TOKEN")

	cfg.GitHub.Token = os.Getenv("GITHUB_TOKEN")

	cfg.Obsidian.VaultPath = os.Getenv("OBSIDIAN_VAULT_PATH")
	if cfgVaultPath := os.Getenv("OBSIDIAN_VAULT_PATH"); cfgVaultPath != "" {
		cfg.Obsidian.VaultPath = cfgVaultPath
	} else {
		cfg.Obsidian.VaultPath = "./obsidian-vault"
	}

	cfg.Obsidian.OutputDir = os.Getenv("OBSIDIAN_OUTPUT_DIR")
	if cfg.Obsidian.OutputDir == "" {
		cfg.Obsidian.OutputDir = "bookmarks"
	}

	cfg.Logging.Level = os.Getenv("LOG_LEVEL")
	if cfg.Logging.Level == "" {
		cfg.Logging.Level = "info"
	}

	return cfg
}
