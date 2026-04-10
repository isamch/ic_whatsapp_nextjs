import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // reporters: ['verbose', 'html'],
    // outputFile: './test-results/index.html',
  },
})
