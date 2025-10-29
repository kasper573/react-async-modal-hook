import { defineConfig, devices } from "@playwright/experimental-ct-react";
import path from "path";

const outputDir = ".playwright";
const artifactsDir = path.join(outputDir, "artifacts");
const snapshotDir = path.join(outputDir, "snapshots");
const reportDir = path.join(outputDir, "report");

const htmlReporter = [
  "html",
  { outputFolder: reportDir, open: "never" },
] as const;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  outputDir: artifactsDir,
  snapshotDir,
  testDir: "./playwright",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [htmlReporter, ["github"]] : [htmlReporter],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ctPort: 3100,
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
});
