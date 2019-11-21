#!/usr/bin/env node
import genDiff from '..';

const program = require('commander');

program
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => console.log(genDiff(firstConfig, secondConfig)));
program.parse(process.argv);

if (program.format) console.log('%s', [program.format]);
