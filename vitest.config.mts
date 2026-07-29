import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    globals: true,
    exclude: ["tests/e2e/**", "node_modules/**"],
    setupFiles: ["./tests/setup-env.ts"],
    coverage: {
      reporter: ["text", "html"],
      include: ["lib/**/*.ts", "services/recommendation.service.ts"],
    },
  },
});
