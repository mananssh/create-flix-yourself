import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import { detectPackageManager } from './utils.js';

export async function installDependencies(
  projectPath: string
): Promise<boolean> {
  const packageManager = detectPackageManager();
  const spinner = ora(`Installing dependencies with ${packageManager}...`).start();

  try {
    await execa(packageManager, ['install'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed(chalk.green('Dependencies installed'));
    return true;
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to install dependencies'));
    console.error(chalk.red('  Error:'), error.message);
    console.log(chalk.yellow(`  Run "${packageManager} install" manually in the project directory`));
    return false;
  }
}

export async function initializeGit(
  projectPath: string
): Promise<boolean> {
  const spinner = ora('Initializing git repository...').start();

  try {
    // Check if git is already initialized
    try {
      await execa('git', ['rev-parse', '--git-dir'], {
        cwd: projectPath,
        stdio: 'pipe'
      });
      spinner.info(chalk.gray('Git repository already initialized'));
      return true;
    } catch {
      // Not a git repo, proceed with initialization
    }

    // Initialize git
    await execa('git', ['init'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    // Add all files
    await execa('git', ['add', '.'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    // Initial commit
    await execa('git', ['commit', '-m', 'Initial commit from create-flix-yourself'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed(chalk.green('Git repository initialized'));
    return true;
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to initialize git'));
    console.error(chalk.red('  Error:'), error.message);
    console.log(chalk.yellow('  You can initialize git manually with: git init'));
    return false;
  }
}

export async function setupDatabase(
  projectPath: string
): Promise<boolean> {
  let spinner = ora('Generating Prisma client...').start();

  try {
    // Generate Prisma client
    await execa('npx', ['prisma', 'generate'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed(chalk.green('Prisma client generated'));

    // Push database schema
    spinner = ora('Pushing database schema...').start();
    await execa('npx', ['prisma', 'db', 'push'], {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed(chalk.green('Database schema pushed'));

    // Run seed (optional, may fail if seed script doesn't exist)
    spinner = ora('Seeding database...').start();
    try {
      await execa('npm', ['run', 'db:seed'], {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 30000
      });
      spinner.succeed(chalk.green('Database seeded'));
    } catch {
      spinner.info(chalk.gray('Database seeding skipped (no seed script or failed)'));
    }

    return true;
  } catch (error: any) {
    spinner.fail(chalk.red('Database setup failed'));
    console.error(chalk.red('  Error:'), error.message);
    console.log(chalk.yellow('  Run database setup manually:'));
    console.log(chalk.gray('    npx prisma generate'));
    console.log(chalk.gray('    npx prisma db push'));
    console.log(chalk.gray('    npm run db:seed'));
    return false;
  }
}

export async function checkGitInstalled(): Promise<boolean> {
  try {
    await execa('git', ['--version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export async function checkNodeVersion(): Promise<{ valid: boolean; version: string }> {
  try {
    const { stdout } = await execa('node', ['--version'], { stdio: 'pipe' });
    const version = stdout.trim();
    const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
    return {
      valid: majorVersion >= 18,
      version
    };
  } catch {
    return { valid: false, version: 'unknown' };
  }
}
