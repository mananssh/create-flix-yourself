export interface ProjectConfig {
  projectName: string;
  databaseProvider: 'sqlite' | 'postgresql' | 'cockroachdb';
  storageProvider: 'local' | 's3' | 'r2' | 'gcs' | 'azure';
  authProvider: 'none' | 'internal' | 'nextauth';
  contentPreset: 'couple' | 'gift' | 'family' | 'travel' | 'generic' | 'homework' | 'custom';
  installDependencies: boolean;
  initializeGit: boolean;
  setupDatabase: boolean;
}

export interface PromptAnswers {
  projectName: string;
  database: 'sqlite' | 'postgresql' | 'cockroachdb';
  storage: 'local' | 's3' | 'r2' | 'gcs' | 'azure';
  auth: 'none' | 'internal' | 'nextauth';
  preset: 'couple' | 'gift' | 'family' | 'travel' | 'generic' | 'homework' | 'custom';
  install: boolean;
  git: boolean;
  setupDb: boolean;
}

export interface CLIOptions {
  yes?: boolean;
  skipInstall?: boolean;
  templateVersion?: string;
}
