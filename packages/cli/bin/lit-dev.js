#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('lit-dev')
  .description('CLI para gestionar el ecosistema Lit Components')
  .version('1.0.0');

program
  .command('init <project-name>')
  .description('Inicializa un nuevo proyecto con Lit Components')
  .action((projectName) => {
    const spinner = ora('Creando proyecto...').start();
    setTimeout(() => {
      spinner.succeed(`Proyecto ${chalk.green(projectName)} creado con éxito.`);
    }, 2000);
  });

program
  .command('generate component <name>')
  .description('Genera un nuevo componente')
  .action((name) => {
    console.log(`Generando componente: ${chalk.blue(name)}`);
  });

program
  .command('add <components...>')
  .description('Agrega componentes desde el catálogo')
  .action((components) => {
    console.log(`Agregando componentes: ${chalk.yellow(components.join(', '))}`);
  });

program.parse(process.argv);