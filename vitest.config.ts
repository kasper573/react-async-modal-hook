import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    include: ["**/test/**/*.test.{js,jsx,ts,tsx}"],
    typecheck: {
      tsconfig: path.resolve(__dirname, "test/tsconfig.json"),
    },
  },
});
