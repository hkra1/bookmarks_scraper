import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

export interface Config {
  twitter: {
    apiKey?: string;
    apiSecret?: string;
    bearerToken?: string;
  };
  linkedin: {
    email?: string;
    password?: string;
    token?: string;
  };
  github: {
    token?: string;
  };
  obsidian: {
    vaultPath: string;
    outputDir: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): Config {
  return {
    twitter: {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
    },
    linkedin: {
      email: process.env.LINKEDIN_EMAIL,
      password: process.env.LINKEDIN_PASSWORD,
      token: process.env.LINKEDIN_TOKEN,
    },
    github: {
      token: process.env.GITHUB_TOKEN,
    },
    obsidian: {
      vaultPath: process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'obsidian-vault'),
      outputDir: process.env.OBSIDIAN_OUTPUT_DIR || 'bookmarks',
    },
    logging: {
      level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
    },
  };
}
