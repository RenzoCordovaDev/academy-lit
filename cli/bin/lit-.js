#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toPascalCase(str) {
  return str
    .replace(/(^\w|[-_\s]\w)/g, match => match.replace(/[-_\s]/, '').toUpperCase());
}

program
  .command('create <name> [scope]')
  .alias('c')
  .description('Genera un nuevo componente')
  .option('--dir <path>', 'Directorio donde crear el componente', './packages/components')
  .action(async (name, scope, options) => {
    const spinner = ora('Generando componente...').start();
    try {
      const componentName = toKebabCase(name);
      const componentNamePascal = toPascalCase(componentName);
      const packageScope = scope ? `@${scope}/` : '';
      const packageName = `${packageScope}${componentName}`;
      const componentDir = path.join(process.cwd(), componentName);

      // Check if component directory already exists
      if (fs.existsSync(componentDir)) {
        spinner.fail(`El componente ${componentName} ya existe en este directorio`);
        return;
      }

      // Create directory structure
      fs.mkdirSync(path.join(componentDir, 'src'), { recursive: true });
      fs.mkdirSync(path.join(componentDir, 'demo'), { recursive: true });
      // Create test directory at same level as src (user requested)
      fs.mkdirSync(path.join(componentDir, 'test'), { recursive: true });

      // Templates directory
      const templatesDir = path.join(__dirname, '..', 'templates');

      // Template data
      const templateData = {
        componentName,
        componentNamePascal,
        componentNamePascalSpaced: componentNamePascal.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
        // File base (kebab-case) used for filenames like <name>.styles.scss
        componentFileBase: componentName,
        // Class-style name used for exports, e.g. AcademyButtonStyles
        componentClassName: componentNamePascal,
        packageScope,
        packageName,
      };

      // Generate files from templates
      const files = [
        { template: 'package.json.ejs', output: 'package.json' },
        { template: 'component.js.ejs', output: `src/${componentNamePascal}.js` },
        { template: 'component.styles.scss.ejs', output: `src/${componentName}.styles.scss` },
        { template: 'component.test.js.ejs', output: `test/${componentName}.test.js` },
        { template: 'locales.json.ejs', output: 'locales.json' },
        { template: 'index.js.ejs', output: 'index.js' },
        { template: 'demo.html.ejs', output: 'demo/index.html' },
        { template: 'demo1.html.ejs', output: 'demo/demo1.html' },
        { template: 'demo2.html.ejs', output: 'demo/demo2.html' },
        { template: 'demo-base.css.ejs', output: 'demo/demo-base.css' },
        { template: 'demo.js.ejs', output: 'demo/demo.js' },
        { template: 'vite.config.js.ejs', output: 'vite.config.js' },
        { template: 'web-test-runner.config.js.ejs', output: 'web-test-runner.config.js' },
      ];

      for (const file of files) {
        const templatePath = path.join(templatesDir, file.template);
        const outputPath = path.join(componentDir, file.output);

        const template = fs.readFileSync(templatePath, 'utf-8');
        const rendered = ejs.render(template, templateData);

        fs.writeFileSync(outputPath, rendered);
      }

      spinner.succeed(`Componente ${packageName} generado con éxito`);
      console.log(chalk.dim(`\nUbicación: ${componentDir}`));
      console.log(chalk.dim(`\nPróximos pasos:`));
      console.log(chalk.cyan(`  cd ${path.relative(process.cwd(), componentDir)}`));
      console.log(chalk.cyan(`  npm install`));
      console.log(chalk.cyan(`  lit- serve`));

    } catch (error) {
      spinner.fail('Error al generar el componente');
      console.error(chalk.red(error.message));
    }
  });

program
  .command('add <components...>')
  .description('Agrega componentes desde el catálogo')
  .action((components) => {
    console.log(`Agregando componentes: ${chalk.yellow(components.join(', '))}`);
  });

program
  .command('serve')
  .alias('s')
  .description('Levanta el servidor de desarrollo para el componente basado en el directorio actual')
  .action(async () => {
    const currentDirName = path.basename(process.cwd());
    const command = `pnpm --filter=@academy-lit-components/${currentDirName} run dev`;

    console.log(chalk.cyan(`Ejecutando: ${command}`));

    // Start embedded watcher from CLI so SCSS -> .styles.js is compiled on save in the current project
    let embeddedWatcher = null;
    try {
      const buildToolsModule = await import(new URL('../lib/build-tools.cjs', import.meta.url).href);
      const buildTools = buildToolsModule;
      console.log(chalk.gray('Iniciando watcher de estilos embebido en', process.cwd()));
      // watchDir is async because chokidar is ESM-only; await the watcher
      embeddedWatcher = await buildTools.watchDir(process.cwd());
    } catch (err) {
      console.error(chalk.red('No se pudo iniciar el watcher embebido de estilos:'), err.message || err);
    }

    const devProcess = exec(command);

    devProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    devProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    const cleanup = () => {
      if (embeddedWatcher) {
        try { embeddedWatcher.close(); } catch (e) {}
      }
    };

    devProcess.on('close', (code) => {
      cleanup();
      if (code === 0) {
        console.log(chalk.green('Servidor de desarrollo detenido correctamente.'));
      } else {
        console.log(chalk.red(`El servidor de desarrollo terminó con código ${code}.`));
      }
    });

    // Ensure watcher is killed if this CLI process receives termination signals
    process.on('SIGINT', () => {
      cleanup();
      process.exit();
    });
    process.on('SIGTERM', () => {
      cleanup();
      process.exit();
    });
  });

program.parse(process.argv);