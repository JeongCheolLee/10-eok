import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // `@/` = 레포 루트 (tsconfig paths와 동일). 미니앱(toss/src) 순수 로직 테스트가 쓴다.
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    include: ["lib/**/*.test.ts", "generator/**/*.test.ts", "toss/src/**/*.test.ts"],
    environment: "node",
  },
});
