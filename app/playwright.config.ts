import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'yarn build && yarn preview --port 5173',
    port: 5173,
    reuseExistingServer: process.env.CI ? false : true
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } }
  ]
});
