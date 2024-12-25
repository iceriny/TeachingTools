import { defineConfig } from "vite";
import { readFileSync } from "fs";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const appVersion = packageJson.version;

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [react(), svgr({ svgrOptions: { icon: true } })],
    define: {
        __APP_VERSION__: `"${appVersion}"`,
        __NOTIFICATION_KEY__: '"NOTIFICATION"',
        __REPOSITORY__: `"${packageJson.repository.url}"`,
    },
    // build: {
    //     rollupOptions: {
    //         output: {
    //             manualChunks(id) {
    //                 if (id.includes("node_modules")) {
    //                     if (id.includes("react") || id.includes("react-dom")) {
    //                         return "react-vendor"; // 将 React 和 React DOM 打包到一起
    //                     }
    //                     if (id.includes("antd")) {
    //                         return "antd"; // 单独为 antd 提取一个 chunk
    //                     }
    //                     if (id.includes("highlight.js")) {
    //                         const match = id.match(
    //                             /node_modules\/highlight.js\/lib\/languages\/([^.]+)\.js/
    //                         );
    //                         if (match) {
    //                             return `highlight-${match[1]}`;
    //                         }
    //                     }
    //                     if (id.includes("react-syntax-highlighter")) {
    //                         return "syntax-highlighter";
    //                     }
    //                     if (id.includes("jsqr")) {
    //                         return "jsqr";
    //                     }
    //                     if (id.includes("refractor/lang")) {
    //                         return "refractor-lang";
    //                     }
    //                     return "vendor"; // 其他第三方库统一打包成 vendor.[hash].js
    //                 }
    //                 if (id.includes("src/components")) {
    //                     return "components"; // 所有组件提取到 components.[hash].js
    //                 }
    //             },
    //         },
    //     },
    // },
});
