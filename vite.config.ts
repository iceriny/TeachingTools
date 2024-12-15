import { defineConfig } from "vite";
import { readFileSync } from "fs";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const appVersion = packageJson.version;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr({ svgrOptions: { icon: true } })],
    define: {
        __APP_VERSION__: `"${appVersion}"`,
    },
});
