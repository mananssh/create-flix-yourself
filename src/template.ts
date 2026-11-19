import degit from 'degit';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

export async function fetchTemplate(
  projectPath: string,
  templateVersion?: string
): Promise<boolean> {
  const spinner = ora('Fetching template...').start();

  try {
    // Determine template source
    const templateSource = templateVersion
      ? `mananssh/flix-yourself-template#${templateVersion}`
      : 'mananssh/flix-yourself-template';

    spinner.text = `Cloning ${templateSource}...`;

    // Use degit to clone the template
    const emitter = degit(templateSource, {
      cache: false,
      force: true,
      verbose: false
    });

    await emitter.clone(projectPath);

    spinner.succeed(chalk.green('Template fetched successfully'));
    return true;
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to fetch template'));
    
    if (error.code === 'ENOENT') {
      console.error(chalk.red('\n✖ Template not found. Please check your internet connection.'));
    } else if (error.message?.includes('404')) {
      console.error(chalk.red('\n✖ Template repository not found or version does not exist.'));
      console.error(chalk.gray('  Ensure mananssh/flix-yourself-template is accessible.'));
    } else {
      console.error(chalk.red('\n✖ Error:'), error.message);
    }
    
    return false;
  }
}
