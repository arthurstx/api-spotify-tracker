import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/services',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controller',
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
          pool: 'forks',
        },
      },
    ],
  },
})
