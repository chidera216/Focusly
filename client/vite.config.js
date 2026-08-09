import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Focusly",
        short_name: "Focusly",
        description: "A simple productivity app for focused work sessions.",
        theme_color: "#16161c",
        background_color: "#16161c",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
