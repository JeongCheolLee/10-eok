import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts", "generator/**/*.test.ts"],
    environment: "node",
  },
});
