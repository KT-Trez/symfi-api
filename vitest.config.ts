/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          environment: 'node',
          globals: true,
          include: ['**/*.spec.ts'],
          name: 'e2e',
          root: './test/e2e',
        },
      },
    ],
  },
});
