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
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                      if (id.includes('antd')) {
                        return 'antd'; // 单独为 antd 提取一个 chunk
                      }
                      if (id.includes('highlight.js')) {
                        const mach = id.match(/node_modules\/highlight.js\/lib\/languages\/([^.]+)\.js/);
                        console.log(mach);
                        return `highlight${mach ? mach[1] : ''}`;
                      }
                      if (id.includes('react-syntax-highlighter')) {
                        return 'syntax-highlighter';
                      }
                      if (id.includes('jsqr')) {
                        return 'jsqr';
                      }
                      if (id.includes('refractor/lang')) {
                        return 'refractor-lang';
                      }
                      return 'vendor'; // 其他第三方库统一打包成 vendor.[hash].js
                    }
                    if (id.includes('src/components')) {
                      return 'components'; // 所有组件提取到 components.[hash].js
                    }
                  },
            },
        },
    },
});
