import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [compilerOptions.baseUrl],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  verbose: true,
};

// noinspection JSUnusedGlobalSymbols
export default config;
