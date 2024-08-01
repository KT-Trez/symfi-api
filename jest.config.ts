// noinspection JSUnusedGlobalSymbols

import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  // collectCoverage: true,
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [compilerOptions.baseUrl],
  preset: 'ts-jest',
  roots: ['./src', './tests'],
  testEnvironment: 'node',
  verbose: true,
};

// biome-ignore lint/style/noDefaultExport: it is required to correctly initialize the jest config file
export default config;
