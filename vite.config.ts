import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { env } from "node:process";

export default defineConfig(({ command, mode }) => {
    // Load environment variables from .env file based on the current mode (e.g., development, production)
    // const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        server: {
            proxy: {
                // Proxy requests from /api to the backend URL specified in the environment variables
                "/dunce": {
                    //target: "http://localhost:8125",
                    target: env.BASE_API_ENDPOINT,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/dunce/, "")
                }
            }
        }
        // Define global constants that will be replaced during the build process
        // define: {
        //     // Define __APP_ENV__ as a global constant with the value of env.APP_ENV
        //     __APP_ENV__: JSON.stringify(env.APP_ENV)
        // }
    };
});
