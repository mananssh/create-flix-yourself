import prompts from 'prompts';
import chalk from 'chalk';
import { PromptAnswers } from './types.js';
import { isValidProjectName, sanitizeProjectName } from './utils.js';

export async function runInteractivePrompts(
  projectName: string | undefined
): Promise<PromptAnswers | null> {
  console.log(chalk.cyan('\n🎬 Welcome to create-flix-yourself!\n'));
  console.log(chalk.gray('Let\'s set up your streaming platform.\n'));

  const questions: prompts.PromptObject[] = [];

  // Project name
  if (!projectName) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-flix',
      validate: (value: string) => {
        if (!value) return 'Project name is required';
        if (!isValidProjectName(value)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      },
      format: (value: string) => sanitizeProjectName(value)
    });
  }

  // Database provider
  questions.push({
    type: 'select',
    name: 'database',
    message: 'Choose a database provider:',
    choices: [
      {
        title: 'SQLite (Local, Free)',
        description: 'File-based database, perfect for getting started',
        value: 'sqlite'
      },
      {
        title: 'PostgreSQL (Local/Hosted, Free tier available)',
        description: 'Production-ready SQL database (Supabase, Neon, Railway)',
        value: 'postgresql'
      },
      {
        title: 'CockroachDB (Hosted, Free tier)',
        description: 'Distributed SQL database with 10GB free tier',
        value: 'cockroachdb'
      }
    ],
    initial: 0
  });

  // Storage provider
  questions.push({
    type: 'select',
    name: 'storage',
    message: 'Choose a storage provider:',
    choices: [
      {
        title: 'Local filesystem (Free)',
        description: 'Store files on your server, simple setup',
        value: 'local'
      },
      {
        title: 'S3 (AWS)',
        description: 'AWS S3, limited free tier',
        value: 's3'
      },
      {
        title: 'R2 (Cloudflare)',
        description: 'Cloudflare R2, 10GB free tier',
        value: 'r2'
      },
      {
        title: 'GCS (Google Cloud)',
        description: 'Google Cloud Storage, 5GB free tier',
        value: 'gcs'
      },
      {
        title: 'Azure Blob',
        description: 'Microsoft Azure Blob Storage',
        value: 'azure'
      }
    ],
    initial: 0
  });

  // Auth provider
  questions.push({
    type: 'select',
    name: 'auth',
    message: 'Choose an authentication provider:',
    choices: [
      {
        title: 'None (Single-user)',
        description: 'No authentication, perfect for personal use',
        value: 'none'
      },
      {
        title: 'Internal (bcrypt)',
        description: 'Username/password authentication, self-hosted',
        value: 'internal'
      },
      {
        title: 'NextAuth (OAuth)',
        description: 'OAuth providers (Google, GitHub, etc.)',
        value: 'nextauth'
      }
    ],
    initial: 0
  });

  // Content preset
  questions.push({
    type: 'select',
    name: 'preset',
    message: 'Choose a content preset:',
    choices: [
      { title: 'Generic', description: 'Standard streaming platform', value: 'generic' },
      { title: 'Couple', description: 'For couples to share memories', value: 'couple' },
      { title: 'Gift to friend', description: 'Gift-themed collections', value: 'gift' },
      { title: 'Family', description: 'Family-friendly organization', value: 'family' },
      { title: 'Travel', description: 'Travel videos and memories', value: 'travel' },
      { title: 'Homework Mode', description: 'Educational content focus', value: 'homework' },
      { title: 'Custom', description: 'Configure manually later', value: 'custom' }
    ],
    initial: 0
  });

  // Install dependencies
  questions.push({
    type: 'confirm',
    name: 'install',
    message: 'Install dependencies?',
    initial: true
  });

  // Initialize git
  questions.push({
    type: 'confirm',
    name: 'git',
    message: 'Initialize git repository?',
    initial: true
  });

  // Setup database
  questions.push({
    type: 'confirm',
    name: 'setupDb',
    message: 'Run database setup now? (Prisma generate & push)',
    initial: true
  });

  try {
    const answers = await prompts(questions, {
      onCancel: () => {
        console.log(chalk.red('\n✖ Setup cancelled'));
        process.exit(0);
      }
    });

    // Use provided projectName or answer
    if (projectName) {
      answers.projectName = projectName;
    }

    return answers as PromptAnswers;
  } catch (error) {
    console.error(chalk.red('Error during prompts:'), error);
    return null;
  }
}

export function getDefaultAnswers(projectName: string): PromptAnswers {
  return {
    projectName,
    database: 'sqlite',
    storage: 'local',
    auth: 'none',
    preset: 'generic',
    install: true,
    git: true,
    setupDb: true
  };
}
