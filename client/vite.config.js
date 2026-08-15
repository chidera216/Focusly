import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "Focusly",
        short_name: "Focusly",
        description: "A simple productivity app for focused work sessions.",
        theme_color: "#0B0B0F",
        background_color: "#0B0B0F",
        display: "standalone",
        start_url: "/",
        scope: "/",

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
