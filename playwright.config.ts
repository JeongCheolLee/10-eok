import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "line",
  use: { baseURL: "http://localhost:3210", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "./node_modules/.bin/next dev -p 3210",
    url: "http://localhost:3210",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
