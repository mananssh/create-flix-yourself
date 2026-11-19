#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { runInteractivePrompts, getDefaultAnswers } from './prompts.js';
import { fetchTemplate } from './template.js';
import { generateConfigYaml, generateEnvFile, patchPrismaSchema } from './config.js';
import { installDependencies, initializeGit, setupDatabase, checkNodeVersion } from './setup.js';
import { ProjectConfig, CLIOptions } from './types.js';
import { directoryExists, isDirectoryEmpty, sanitizeProjectName } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const program = new Command();

  // Read package.json for version
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  let version = '0.1.0';
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    version = packageJson.version;
  } catch {
    // Use default version if can't read package.json
  }

  program
    .name('create-flix-yourself')
    .description('Create your own Netflix-like streaming platform')
    .version(version)
    .argument('[project-name]', 'Name of the project directory')
    .option('--yes', 'Use default configuration (non-interactive)')
    .option('--skip-install', 'Skip dependency installation')
    .option('--template-version <version>', 'Specific template version/tag to use')
    .action(async (projectName: string | undefined, options: CLIOptions) => {
      await createProject(projectName, options);
    });

  program.parse();
}

async function createProject(projectName: string | undefined, options: CLIOptions) {
  console.log(chalk.bold.cyan('\n🎬 create-flix-yourself\n'));

  // Check Node.js version
  const nodeCheck = await checkNodeVersion();
  if (!nodeCheck.valid) {
    console.error(chalk.red('✖ Node.js 18 or higher is required'));
    console.error(chalk.red(`  Current version: ${nodeCheck.version}`));
    process.exit(1);
  }

  // Get project configuration
  let answers;
  if (options.yes) {
    // Non-interactive mode with defaults
    const defaultProjectName = projectName || 'my-flix';
    answers = getDefaultAnswers(sanitizeProjectName(defaultProjectName));
    console.log(chalk.gray('Using default configuration...\n'));
  } else {
    // Interactive mode
    answers = await runInteractivePrompts(projectName);
    if (!answers) {
      console.error(chalk.red('\n✖ Failed to get configuration'));
      process.exit(1);
    }
  }

  // Override install setting if --skip-install is provided
  if (options.skipInstall) {
    answers.install = false;
  }

  const projectConfig: ProjectConfig = {
    projectName: answers.projectName,
    databaseProvider: answers.database,
    storageProvider: answers.storage,
    authProvider: answers.auth,
    contentPreset: answers.preset,
    installDependencies: answers.install,
    initializeGit: answers.git,
    setupDatabase: answers.setupDb
  };

  // Determine project path
  const projectPath = path.resolve(process.cwd(), projectConfig.projectName);

  // Check if directory exists
  if (await directoryExists(projectPath)) {
    const isEmpty = await isDirectoryEmpty(projectPath);
    if (!isEmpty) {
      console.error(chalk.red(`\n✖ Directory "${projectConfig.projectName}" already exists and is not empty`));
      console.error(chalk.gray('  Please choose a different project name or remove the existing directory'));
      process.exit(1);
    }
  }

  console.log(chalk.cyan(`\nCreating project: ${chalk.bold(projectConfig.projectName)}\n`));

  // Step 1: Fetch template
  const templateFetched = await fetchTemplate(projectPath, options.templateVersion);
  if (!templateFetched) {
    console.error(chalk.red('\n✖ Failed to fetch template'));
    process.exit(1);
  }

  // Step 2: Generate configuration files
  console.log(chalk.cyan('\nGenerating configuration...\n'));
  try {
    await generateConfigYaml(projectPath, projectConfig);
    await generateEnvFile(projectPath, projectConfig);
    await patchPrismaSchema(projectPath, projectConfig.databaseProvider);
  } catch (error) {
    console.error(chalk.red('\n✖ Failed to generate configuration:'), (error as Error).message);
    process.exit(1);
  }

  // Step 3: Install dependencies
  if (projectConfig.installDependencies) {
    console.log(chalk.cyan('\nInstalling dependencies...\n'));
    await installDependencies(projectPath);
  }

  // Step 4: Initialize git
  if (projectConfig.initializeGit) {
    console.log(chalk.cyan('\nInitializing git...\n'));
    await initializeGit(projectPath);
  }

  // Step 5: Setup database
  if (projectConfig.setupDatabase && projectConfig.installDependencies) {
    console.log(chalk.cyan('\nSetting up database...\n'));
    await setupDatabase(projectPath);
  }

  // Success message and next steps
  printSuccessMessage(projectPath, projectConfig);
}

function printSuccessMessage(projectPath: string, config: ProjectConfig) {
  const projectName = config.projectName;
  
  console.log(chalk.green.bold(`\n✨ Success! Created ${projectName} at ${projectPath}\n`));

  console.log(chalk.cyan.bold('Next steps:\n'));
  console.log(chalk.white(`  cd ${projectName}`));

  // Database-specific instructions
  if (config.databaseProvider !== 'sqlite') {
    console.log(chalk.yellow('\n  📝 Update .env with your database connection URL'));
  }

  // Storage-specific instructions
  if (config.storageProvider !== 'local') {
    console.log(chalk.yellow(`  📝 Update .env with your ${config.storageProvider.toUpperCase()} credentials`));
  }

  // Auth-specific instructions
  if (config.authProvider === 'nextauth') {
    console.log(chalk.yellow('  📝 Update .env with your OAuth provider credentials'));
  }

  // Installation instructions
  if (!config.installDependencies) {
    console.log(chalk.white('\n  npm install'));
  }

  // Database setup instructions
  if (!config.setupDatabase) {
    console.log(chalk.white('\n  npx prisma generate'));
    console.log(chalk.white('  npx prisma db push'));
    console.log(chalk.white('  npm run db:seed'));
  }

  // Start the server
  console.log(chalk.white('\n  npm run dev'));

  console.log(chalk.gray('\n  Open http://localhost:3000 in your browser'));
  console.log(chalk.gray('  Admin panel: http://localhost:3000/admin\n'));

  console.log(chalk.cyan('Documentation:'));
  console.log(chalk.gray('  https://github.com/mananssh/flix-yourself-template\n'));

  console.log(chalk.green('Happy streaming! 🍿\n'));
}

// Error handling
process.on('unhandledRejection', (error: Error) => {
  console.error(chalk.red('\n✖ Unhandled error:'), error.message);
  process.exit(1);
});

main().catch((error) => {
  console.error(chalk.red('\n✖ Error:'), error.message);
  process.exit(1);
});
