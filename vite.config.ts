import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitest/config"

// Vite sert le jeu (npm run dev), Tailwind génère le CSS, Vitest lance les tests des paliers.
export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    include: ["tests/**/*.test.ts"],
  },
})
